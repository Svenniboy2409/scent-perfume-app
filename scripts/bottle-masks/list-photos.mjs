// Prints { perfumeId: photoUrl } for every perfume with a Fragrantica photo,
// as JSON, for make_masks.py.
import { PERFUMES } from '../../src/data/perfumes.js'
import { FRAGRANTICA_IDS } from '../../src/data/fragranticaIds.js'

const photos = {}
for (const p of PERFUMES) {
  const fid = p.fragranticaId ?? FRAGRANTICA_IDS[p.id]
  if (fid) photos[p.id] = `https://fimgs.net/mdimg/perfume/375x500.${fid}.jpg`
}
console.log(JSON.stringify(photos))
