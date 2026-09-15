// Export / import of the user's lists as a small JSON file, so they can be
// backed up or moved to another device (everything else lives in
// localStorage, which never leaves the browser).

import { PERFUMES } from '../data/perfumes.js'

const APP_ID = 'scent-perfume-app'
const VERSION = 1

export function backupFileName(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0')
  return `scent-backup-${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}.json`
}

export function createBackup({ wishlist, collection, language }) {
  return {
    app: APP_ID,
    version: VERSION,
    exportedAt: new Date().toISOString(),
    language,
    collection,
    wishlist,
  }
}

// Triggers a download of `data` as a JSON file.
export function downloadJson(data, fileName) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  // Give the browser a moment to start the download before revoking.
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/**
 * Parses and validates backup file text. Unknown perfume ids (e.g. from a newer
 * catalogue) are dropped and counted. Throws when the file isn't a backup.
 */
export function parseBackup(text) {
  let data
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error('invalid-json')
  }
  const listsOk =
    data && typeof data === 'object' && Array.isArray(data.collection) && Array.isArray(data.wishlist)
  if (!listsOk || (data.app !== undefined && data.app !== APP_ID)) {
    throw new Error('not-a-backup')
  }

  const known = new Set(PERFUMES.map((p) => p.id))
  let skipped = 0
  const clean = (list) => {
    const out = []
    for (const id of list) {
      if (typeof id !== 'string' || !known.has(id)) {
        skipped++
      } else if (!out.includes(id)) {
        out.push(id)
      }
    }
    return out
  }

  const collection = clean(data.collection)
  // Owning a perfume removes it from the wishlist, same rule as in the app.
  const wishlist = clean(data.wishlist).filter((id) => !collection.includes(id))
  return {
    collection,
    wishlist,
    language: typeof data.language === 'string' ? data.language : null,
    skipped,
  }
}

/** Combines current lists with imported ones (`mode` = 'merge' | 'replace'). */
export function combineLists(current, incoming, mode) {
  if (mode === 'replace') {
    return { collection: incoming.collection, wishlist: incoming.wishlist }
  }
  const collection = [...current.collection]
  for (const id of incoming.collection) if (!collection.includes(id)) collection.push(id)
  const wishlist = []
  for (const id of [...current.wishlist, ...incoming.wishlist]) {
    if (!collection.includes(id) && !wishlist.includes(id)) wishlist.push(id)
  }
  return { collection, wishlist }
}
