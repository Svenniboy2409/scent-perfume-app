import { createContext, useCallback, useContext, useEffect, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { STRINGS } from './strings.js'
import { translateAnyTerm, translateTerm } from './terms.js'
import { DESCRIPTIONS_NL } from './descriptions.nl.js'

export const LANGUAGE_KEY = 'perfume-app:language'
export const DEFAULT_LANGUAGE = 'en'

export const LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'nl', label: 'Nederlands', short: 'NL' },
]

const DESCRIPTIONS = { nl: DESCRIPTIONS_NL }

export function isLanguage(code) {
  return LANGUAGES.some((l) => l.code === code)
}

function lookup(table, key) {
  return key.split('.').reduce((node, part) => node?.[part], table)
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [stored, setLanguage] = useLocalStorage(LANGUAGE_KEY, DEFAULT_LANGUAGE)
  const lang = isLanguage(stored) ? stored : DEFAULT_LANGUAGE

  // t('discover.results', 3) → "3 results". Strings may be functions of the
  // extra arguments; a key missing in Dutch falls back to English.
  const t = useCallback(
    (key, ...args) => {
      const value = lookup(STRINGS[lang], key) ?? lookup(STRINGS[DEFAULT_LANGUAGE], key)
      if (typeof value === 'function') return value(...args)
      return value ?? key
    },
    [lang],
  )

  const term = useCallback((kind, value) => translateTerm(lang, kind, value), [lang])
  const anyTerm = useCallback((value) => translateAnyTerm(lang, value), [lang])
  const describe = useCallback(
    (perfume) => DESCRIPTIONS[lang]?.[perfume.id] ?? perfume.description,
    [lang],
  )

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = t('app.title')
  }, [lang, t])

  const value = useMemo(
    () => ({ lang, setLanguage, t, term, anyTerm, describe }),
    [lang, setLanguage, t, term, anyTerm, describe],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return ctx
}
