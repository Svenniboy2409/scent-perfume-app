// Fuzzy, concept-aware search over the perfume catalogue.
//
// Goals (in order of importance):
//  1. Multi-field queries work: "dior sauvage", "sauvage dior", "chanel edp".
//     Every query word must match *something* on the perfume, but the words may
//     come from different fields.
//  2. Typos are forgiven: "savage", "chanell", "aventus" → the real thing.
//  3. Concepts are searchable, in English *and* Dutch: "herfst", "gym",
//     "bruiloft", "date night", "vanilla", "men" all return sensible results.
//
// Each perfume is indexed once into a token → weight map; a query is scored
// token by token against that map (exact > prefix > fuzzy), and phrase bonuses
// push literal "brand name" matches to the top.

import { PERFUMES } from '../data/perfumes.js'
import { SEASONS, OCCASIONS } from '../data/occasions.js'
import { getLongevity } from '../data/longevity.js'
import { getTimeOfDay } from '../data/timeOfDay.js'

// --- text helpers -----------------------------------------------------------

// Lowercase, strip accents (Hermès → hermes), and reduce everything else to
// single-spaced a-z0-9 so "Dolce & Gabbana" and "dolce and gabbana" collide.
export function normalize(str) {
  return String(str ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function tokenize(str) {
  const n = normalize(str)
  return n ? n.split(' ') : []
}

// Damerau-Levenshtein (optimal string alignment) with an early exit once the
// whole row exceeds `max` — keeps the per-keystroke cost negligible.
function editDistance(a, b, max) {
  if (a === b) return 0
  if (Math.abs(a.length - b.length) > max) return max + 1
  let prev2 = null
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const row = new Array(b.length + 1)
    row[0] = i
    let rowMin = i
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      let v = Math.min(row[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost)
      // transposition ("chanle" → "chanel")
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        v = Math.min(v, prev2[j - 2] + 1)
      }
      row[j] = v
      if (v < rowMin) rowMin = v
    }
    if (rowMin > max) return max + 1
    prev2 = prev
    prev = row
  }
  return prev[b.length]
}

// How much misspelling we tolerate, by word length. Short words stay strict —
// "day" must not fuzz into "date".
function maxDistanceFor(token) {
  if (token.length <= 3) return 0
  if (token.length <= 5) return 1
  return 2
}

// --- vocabulary -------------------------------------------------------------

const SEASON_WORDS = {
  Spring: ['spring', 'lente', 'voorjaar', 'printemps', 'blossom', 'bloesem'],
  Summer: [
    'summer', 'zomer', 'summertime', 'beach', 'strand', 'holiday', 'vakantie',
    'hot', 'heat', 'warm weather', 'sunny', 'zon', 'ete',
  ],
  Fall: ['fall', 'autumn', 'herfst', 'najaar', 'automne', 'cozy', 'cosy', 'knus'],
  Winter: ['winter', 'cold', 'koud', 'snow', 'sneeuw', 'christmas', 'kerst', 'hiver'],
}

const OCCASION_WORDS = {
  Daily: [
    'daily', 'everyday', 'every day', 'casual', 'dagelijks', 'alledaags',
    'signature', 'school', 'errands',
  ],
  Office: [
    'office', 'work', 'working', 'business', 'professional', 'kantoor', 'werk',
    'meeting', 'vergadering', 'corporate',
  ],
  Evening: [
    'evening', 'avond', 'night out', 'uitgaan', 'club', 'clubbing', 'party',
    'feest', 'bar', 'dinner', 'diner', 'concert',
  ],
  Date: [
    'date', 'date night', 'romantic', 'romance', 'romantisch', 'seductive',
    'seduction', 'afspraakje', 'valentine', 'valentijn', 'sexy', 'flirt',
    'compliment', 'compliments',
  ],
  Sport: [
    'sport', 'sports', 'sporten', 'gym', 'workout', 'training', 'fitness',
    'active', 'running', 'hardlopen', 'outdoor', 'buiten', 'sportschool',
    'sportief', 'exercise', 'run',
  ],
  Special: [
    'special', 'special occasion', 'wedding', 'bruiloft', 'trouwen', 'formal',
    'formeel', 'gala', 'ceremony', 'celebration', 'event', 'evenement',
    'luxury', 'luxe', 'statement', 'feestelijk', 'birthday', 'verjaardag',
  ],
}

const GENDER_WORDS = {
  Masculine: [
    'masculine', 'male', 'men', 'mens', 'man', 'heren', 'mannen', 'homme',
    'pour homme', 'manly', 'mannelijk',
  ],
  Feminine: [
    'feminine', 'female', 'women', 'womens', 'woman', 'dames', 'vrouwen',
    'femme', 'pour femme', 'girl', 'lady', 'vrouwelijk',
  ],
  Unisex: ['unisex', 'uniseks', 'shared', 'genderless', 'everyone', 'iedereen'],
}

const TIME_WORDS = {
  Day: ['day', 'daytime', 'dag', 'overdag', 'morning', 'ochtend', 'afternoon', 'middag', 'daylight'],
  Night: ['night', 'nighttime', 'nacht', 'dark', 'donker', 'moon', 'maan', 'late'],
}

// Dutch (and a few colloquial) equivalents for the accords and notes people
// are most likely to type. Keyed by the normalized English word.
const TERM_SYNONYMS = {
  fresh: ['fris', 'frisse'],
  sweet: ['zoet', 'zoete'],
  woody: ['houtachtig', 'hout', 'woods'],
  floral: ['bloemig', 'bloemen', 'flowers'],
  spicy: ['kruidig', 'spice', 'spices'],
  fruity: ['fruitig', 'fruit'],
  citrus: ['citrusy', 'fris citrus'],
  leather: ['leer', 'leren'],
  vanilla: ['vanille'],
  smoky: ['rokerig', 'rook', 'smoke'],
  powdery: ['poederig'],
  aquatic: ['aquatisch', 'water', 'marine', 'zee', 'ocean'],
  green: ['groen', 'grassy', 'gras'],
  creamy: ['romig', 'cremig'],
  gourmand: ['eetbaar', 'dessert', 'edible'],
  rose: ['roos', 'rozen'],
  oud: ['agarwood', 'oudh'],
  musky: ['musk', 'muskus', 'clean', 'schoon', 'soapy', 'zeep'],
  coffee: ['koffie'],
  chocolate: ['chocolade', 'cacao'],
  honey: ['honing'],
  amber: ['ambery', 'amberachtig'],
  tobacco: ['tabak'],
  coconut: ['kokos'],
  almond: ['amandel'],
  cinnamon: ['kaneel'],
  lavender: ['lavendel'],
  apple: ['appel'],
  lemon: ['citroen'],
  pineapple: ['ananas'],
  pear: ['peer'],
  cherry: ['kers'],
  salty: ['zout', 'zilt'],
  warm: ['warm', 'warme'],
  tropical: ['tropisch'],
  incense: ['wierook'],
  mint: ['munt'],
  minty: ['munt', 'muntig'],
  pepper: ['peper'],
  peppery: ['peperig'],
  sandalwood: ['sandelhout'],
  cedar: ['ceder'],
  jasmine: ['jasmijn'],
  strawberry: ['aardbei'],
  raspberry: ['framboos'],
  peach: ['perzik'],
  mango: ['mango'],
}

// Extra words a concentration should answer to.
function concentrationWords(concentration) {
  const n = normalize(concentration)
  const out = [concentration]
  if (n.includes('eau de parfum')) out.push('edp')
  if (n.includes('eau de toilette')) out.push('edt')
  if (n.includes('cologne')) out.push('edc', 'eau de cologne')
  if (n.includes('extrait')) out.push('extrait', 'pure parfum', 'extract')
  if (n === 'parfum' || n === 'le parfum' || n.includes('extrait')) out.push('parfum', 'strongest')
  if (n.includes('intense')) out.push('intense')
  if (n.includes('concentree')) out.push('concentree', 'concentrated')
  return out
}

// Words that describe how long a perfume lasts.
function longevityWords(rating) {
  const lasting = ['langhoudend', 'langdurig', 'blijft hangen']
  if (rating >= 5) {
    return ['eternal', 'beast mode', 'beast', 'monster', 'strongest', 'performance', ...lasting]
  }
  if (rating === 4) {
    return ['very long lasting', 'long lasting', 'strong', 'powerful', 'krachtig', 'performance', ...lasting]
  }
  if (rating === 3) return ['long lasting', 'moderate', 'decent', ...lasting]
  if (rating === 2) return ['moderate', 'soft', 'light', 'subtle', 'zacht', 'discreet', 'kort']
  return ['weak', 'light', 'skin scent', 'subtle', 'zwak', 'kort']
}

// Nicknames the acronym generator can't derive.
const BRAND_ALIASES = {
  'Yves Saint Laurent': ['ysl', 'saint laurent'],
  'Jean Paul Gaultier': ['jpg', 'gaultier'],
  'Parfums de Marly': ['pdm', 'marly'],
  'Maison Francis Kurkdjian': ['mfk', 'kurkdjian', 'francis kurkdjian'],
  'Maison Margiela': ['margiela', 'replica'],
  'Dolce & Gabbana': ['dg', 'dolce', 'gabbana'],
  'Giorgio Armani': ['armani'],
  'Emporio Armani': ['armani'],
  'Louis Vuitton': ['lv', 'vuitton'],
  'Viktor&Rolf': ['viktor', 'rolf', 'vr'],
  'Carolina Herrera': ['herrera', 'ch'],
  'Paco Rabanne': ['paco', 'rabanne'],
  'Acqua di Parma': ['adp'],
  'Tom Ford': ['tf'],
  'Le Labo': ['labo'],
  'Swiss Arabian': ['swiss'],
  'Al Haramain': ['haramain'],
  'Marc Jacobs': ['mj'],
  'Issey Miyake': ['issey', 'miyake'],
  "Penhaligon's": ['penhaligons', 'penhaligon'],
  'French Avenue': ['fa'],
  'BDK Parfums': ['bdk'],
  Montblanc: ['mont blanc'],
  'Ariana Grande': ['ariana'],
  Bvlgari: ['bulgari'],
  Hermès: ['hermes'],
  Lancôme: ['lancome'],
  'Hugo Boss': ['boss'],
  'Calvin Klein': ['ck'],
  'Ralph Lauren': ['polo', 'rl'],
  'Abercrombie & Fitch': ['abercrombie', 'af'],
  'Narciso Rodriguez': ['narciso'],
  'Frederic Malle': ['malle', 'fm'],
}

const NAME_ALIASES = {
  'mfk-baccarat-rouge-540': ['br540', 'br 540', 'baccarat'],
  'armaf-club-de-nuit-intense-man': ['cdni', 'club de nuit'],
  'armaf-club-de-nuit-sillage': ['club de nuit'],
  'armaf-club-de-nuit-untold': ['club de nuit'],
  'chanel-bleu-de-chanel': ['bdc'],
  'chanel-bleu-de-chanel-edt': ['bdc'],
  'armani-acqua-di-gio-profumo': ['adg'],
  'armani-acqua-di-gio-parfum': ['adg'],
  'ysl-la-nuit-de-lhomme': ['lndlh', 'la nuit'],
  'mugler-amen': ['a men', 'amen'],
  'tom-ford-fabulous': ['fucking fabulous', 'ff'],
  'mfk-oud-satin-mood': ['osm'],
}

// Filler halves of multi-word synonyms — indexing these on their own would
// make unrelated perfumes match.
const SYNONYM_STOPWORDS = new Set([
  'out', 'every', 'weather', 'pure', 'scent', 'skin', 'de', 'du', 'la',
])

// "Jean Paul Gaultier" → "jpg", "Bleu de Chanel" → "bdc".
function acronym(text) {
  const words = tokenize(text)
  if (words.length < 2) return null
  return words.map((w) => w[0]).join('')
}

// --- index ------------------------------------------------------------------

// Field weights: a hit on the name counts far more than one in the description.
const W = {
  name: 12,
  brand: 9,
  alias: 9,
  concept: 6,
  accord: 4.5,
  note: 3.5,
  meta: 3,
  description: 1.2,
}

const CONCEPT_GROUPS = [
  { type: 'season', words: SEASON_WORDS },
  { type: 'occasion', words: OCCASION_WORDS },
  { type: 'gender', words: GENDER_WORDS },
  { type: 'time', words: TIME_WORDS },
]

function buildEntry(perfume) {
  const tokens = new Map()
  const add = (text, weight) => {
    for (const t of tokenize(text)) {
      if (!t) continue
      if ((tokens.get(t) ?? 0) < weight) tokens.set(t, weight)
    }
  }
  // Multi-word synonyms are indexed word by word, so drop the filler halves
  // ("night out" should be findable by "night", not by "out").
  const addConcept = (text, weight) => {
    for (const t of tokenize(text)) {
      if (!t || SYNONYM_STOPWORDS.has(t)) continue
      if ((tokens.get(t) ?? 0) < weight) tokens.set(t, weight)
    }
  }
  // Accords and notes also answer to their Dutch/colloquial equivalents.
  const addTranslated = (text, weight) => {
    add(text, weight)
    for (const t of tokenize(text)) {
      for (const synonym of TERM_SYNONYMS[t] ?? []) add(synonym, weight)
    }
  }

  add(perfume.name, W.name)
  add(perfume.brand, W.brand)
  for (const a of BRAND_ALIASES[perfume.brand] ?? []) add(a, W.alias)
  for (const a of NAME_ALIASES[perfume.id] ?? []) add(a, W.alias)
  const brandAcronym = acronym(perfume.brand)
  if (brandAcronym) add(brandAcronym, W.alias)
  const nameAcronym = acronym(perfume.name)
  if (nameAcronym) add(nameAcronym, W.alias)

  for (const c of concentrationWords(perfume.concentration)) add(c, W.meta)
  add(String(perfume.year), W.meta)

  // Concepts: the perfume's own season/occasion/gender/time labels plus every
  // synonym for them, so "herfst" and "gym" find the right bottles.
  for (const season of SEASONS) {
    if (perfume.occasions.includes(season)) {
      for (const w of SEASON_WORDS[season]) addConcept(w, W.concept)
      addConcept(season, W.concept)
    }
  }
  for (const occasion of OCCASIONS) {
    if (perfume.occasions.includes(occasion)) {
      for (const w of OCCASION_WORDS[occasion]) addConcept(w, W.concept)
      addConcept(occasion, W.concept)
    }
  }
  for (const w of GENDER_WORDS[perfume.gender] ?? []) addConcept(w, W.concept)
  addConcept(perfume.gender, W.concept)
  for (const time of getTimeOfDay(perfume)) {
    for (const w of TIME_WORDS[time] ?? []) addConcept(w, W.concept)
  }

  const longevity = getLongevity(perfume)
  addConcept(longevity.label, W.meta)
  for (const w of longevityWords(longevity.rating)) addConcept(w, W.meta)

  for (const a of perfume.accords) addTranslated(a, W.accord)
  for (const group of ['top', 'heart', 'base']) {
    for (const n of perfume.notes?.[group] ?? []) addTranslated(n, W.note)
  }
  add(perfume.description, W.description)

  const name = normalize(perfume.name)
  const brand = normalize(perfume.brand)
  return {
    perfume,
    tokens,
    name,
    brand,
    brandName: `${brand} ${name}`,
    nameBrand: `${name} ${brand}`,
  }
}

const INDEX = new WeakMap()

function entryFor(perfume) {
  let entry = INDEX.get(perfume)
  if (!entry) {
    entry = buildEntry(perfume)
    INDEX.set(perfume, entry)
  }
  return entry
}

// Every word the catalogue knows. A query word that appears here is spelled
// correctly, so it must NOT be fuzzy-matched — otherwise "night" would also
// drag in "light" and "fris" would find "iris". Typo tolerance is reserved for
// words the catalogue has never seen.
// Built from the whole catalogue (not the filtered shortlist) so that active
// chips can't shrink the dictionary.
let VOCABULARY = null

function vocabulary() {
  if (!VOCABULARY) {
    VOCABULARY = new Set()
    for (const perfume of PERFUMES) {
      for (const token of entryFor(perfume).tokens.keys()) VOCABULARY.add(token)
    }
  }
  return VOCABULARY
}

// --- scoring ----------------------------------------------------------------

// Best score for one query word against one perfume's tokens.
// Exact hit keeps the full field weight; a prefix ("sauv") or a typo
// ("savage") keeps a fraction of it.
function scoreToken(entry, qt, allowFuzzy) {
  const exact = entry.tokens.get(qt)
  if (exact !== undefined) return exact

  const maxDist = allowFuzzy ? maxDistanceFor(qt) : 0
  let best = 0
  for (const [t, w] of entry.tokens) {
    if (w * 0.9 <= best) continue // can't beat what we already have
    if (qt.length >= 3 && t.startsWith(qt)) {
      const score = w * (0.6 + 0.3 * (qt.length / t.length))
      if (score > best) best = score
      continue
    }
    if (maxDist > 0 && Math.abs(t.length - qt.length) <= maxDist) {
      const d = editDistance(qt, t, maxDist)
      if (d <= maxDist) {
        // Two edits away is a weak signal — keep it well below a one-edit hit
        // so "wnter" ranks Winter perfumes above "water" ones.
        const score = w * (d === 1 ? 0.6 : 0.22)
        if (score > best) best = score
      }
    }
  }
  return best
}

function scoreEntry(entry, qTokens, qNorm, fuzzyFlags) {
  let total = 0
  for (let i = 0; i < qTokens.length; i++) {
    const qt = qTokens[i]
    const best = scoreToken(entry, qt, fuzzyFlags[i])
    // Every word has to land somewhere — that's what makes "dior sauvage"
    // narrow down instead of returning every Dior *and* every Sauvage.
    // Single letters are the exception: they carry real meaning when they hit
    // (YSL "Y") but must not sink a query when they're just a split-up
    // abbreviation ("d g light blue").
    if (best === 0) {
      if (qt.length === 1) continue
      return 0
    }
    total += best
  }

  // Phrase bonuses: literal "brand name" / "name brand" beats a scattered
  // match, and the exact full title beats a longer title it's a prefix of
  // ("Burberry Her" must outrank "Burberry Hero").
  if (entry.brandName === qNorm || entry.nameBrand === qNorm) total += 60
  if (qTokens.length > 1) {
    if (entry.brandName.includes(qNorm)) total += 45
    else if (entry.nameBrand.includes(qNorm)) total += 35
  }
  if (entry.name === qNorm) total += 40
  else if (entry.name.startsWith(qNorm)) total += 25
  else if (entry.name.includes(qNorm)) total += 12
  if (entry.brand === qNorm) total += 18

  return total
}

/**
 * Ranked search over `perfumes`. An empty query returns the list sorted by
 * brand → name (the catalogue's default order).
 */
export function searchPerfumes(perfumes, query) {
  const qNorm = normalize(query)
  const byBrand = (a, b) => a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name)
  if (!qNorm) return [...perfumes].sort(byBrand)

  const qTokens = qNorm.split(' ')
  const known = vocabulary()
  const fuzzyFlags = qTokens.map((qt) => !known.has(qt))
  const scored = []
  for (const perfume of perfumes) {
    const score = scoreEntry(entryFor(perfume), qTokens, qNorm, fuzzyFlags)
    if (score > 0) scored.push({ perfume, score })
  }
  scored.sort((a, b) => b.score - a.score || byBrand(a.perfume, b.perfume))
  return scored.map((s) => s.perfume)
}

// --- query understanding (for UI hints) -------------------------------------

/**
 * Which concepts the query words stand for, e.g. "herfst avond" →
 * [{ type: 'season', value: 'Fall' }, { type: 'occasion', value: 'Evening' }].
 * Used to tell the user how their search was interpreted.
 */
export function describeQuery(query) {
  const qNorm = normalize(query)
  if (!qNorm) return []
  const qTokens = new Set(qNorm.split(' '))

  // Pass 1: literal hits. A single-word phrase must match a whole query word,
  // so "winter" doesn't half-match "wintergreen"; multi-word phrases like
  // "date night" are matched against the raw query.
  const exact = []
  for (const { type, words } of CONCEPT_GROUPS) {
    for (const [value, synonyms] of Object.entries(words)) {
      const phrases = [normalize(value), ...synonyms.map(normalize)]
      const hit = phrases.some((phrase) =>
        phrase.includes(' ') ? qNorm.includes(phrase) : qTokens.has(phrase),
      )
      if (hit) exact.push({ type, value })
    }
  }
  if (exact.length > 0) return exact

  // Pass 2: nothing matched literally, so the user probably mistyped a concept
  // word ("wnter", "gymm"). Only now do we allow fuzzy matching — and only for
  // words the catalogue doesn't know, so "koffie" isn't read as "office".
  const known = vocabulary()
  const unknownTokens = [...qTokens].filter((qt) => !known.has(qt))
  if (unknownTokens.length === 0) return []

  const fuzzy = []
  for (const { type, words } of CONCEPT_GROUPS) {
    for (const [value, synonyms] of Object.entries(words)) {
      const phrases = [normalize(value), ...synonyms.map(normalize)].filter(
        (p) => !p.includes(' '),
      )
      const hit = phrases.some((phrase) =>
        unknownTokens.some((qt) => {
          if (qt.length < 4) return false
          const max = maxDistanceFor(qt)
          return max > 0 && editDistance(qt, phrase, max) <= max
        }),
      )
      if (hit) fuzzy.push({ type, value })
    }
  }
  // A mistyped word that suddenly means four different things is noise, not a
  // hint — only show it when the interpretation is reasonably unambiguous.
  return fuzzy.length <= 2 ? fuzzy : []
}

/**
 * Closest catalogue term to a query that found nothing — powers "Did you mean…".
 * Returns a display string or null when nothing is close enough.
 */
export function suggestTerm(perfumes, query) {
  const qNorm = normalize(query)
  if (!qNorm) return null
  const qTokens = qNorm.split(' ')

  const candidates = new Map() // normalized → display
  for (const perfume of perfumes) {
    candidates.set(normalize(perfume.brand), perfume.brand)
    candidates.set(normalize(perfume.name), perfume.name)
    for (const word of tokenize(perfume.name)) {
      if (word.length >= 4) candidates.set(word, word)
    }
    for (const accord of perfume.accords) candidates.set(normalize(accord), accord)
  }
  for (const { words } of CONCEPT_GROUPS) {
    for (const value of Object.keys(words)) candidates.set(normalize(value), value)
  }

  let best = null
  let bestDist = Infinity
  for (const [candidate, display] of candidates) {
    // Compare the whole query, and each word, against each candidate.
    for (const probe of [qNorm, ...qTokens]) {
      if (probe.length < 3) continue
      const limit = probe.length <= 5 ? 2 : 3
      const d = editDistance(probe, candidate, limit)
      if (d <= limit && d < bestDist) {
        bestDist = d
        best = display
      }
    }
  }
  return best
}
