import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCollection } from '../context/CollectionContext.jsx'
import { LANGUAGES, useLanguage } from '../i18n/LanguageContext.jsx'
import {
  backupFileName,
  combineLists,
  createBackup,
  downloadJson,
  parseBackup,
} from '../utils/backup.js'

// Reached via the gear on the Collection page: app language plus export /
// import of the wishlist and collection.
export default function Settings() {
  const navigate = useNavigate()
  const { lang, setLanguage, t } = useLanguage()
  const { wishlist, collection, setLists } = useCollection()
  const fileInputRef = useRef(null)
  // A parsed backup waiting for the user to choose merge or replace.
  const [pending, setPending] = useState(null)
  const [status, setStatus] = useState(null) // { tone: 'ok' | 'error', text }

  // Opened from a bookmark there's no history entry to go back to.
  const goBack = () => {
    if (window.history.state?.idx > 0) navigate(-1)
    else navigate('/collection')
  }

  const exportData = () => {
    const fileName = backupFileName()
    downloadJson(createBackup({ wishlist, collection, language: lang }), fileName)
    setPending(null)
    setStatus({ tone: 'ok', text: t('settings.exported', fileName) })
  }

  const readFile = async (event) => {
    const file = event.target.files?.[0]
    // Reset so picking the same file again still fires a change event.
    event.target.value = ''
    if (!file) return
    try {
      setPending(parseBackup(await file.text()))
      setStatus(null)
    } catch {
      setPending(null)
      setStatus({ tone: 'error', text: t('settings.invalidFile') })
    }
  }

  const applyImport = (mode) => {
    const next = combineLists({ wishlist, collection }, pending, mode)
    setLists(next)
    setPending(null)
    setStatus({
      tone: 'ok',
      text: t('settings.imported', next.collection.length, next.wishlist.length),
    })
  }

  return (
    <div className="page settings-page">
      <button type="button" className="back-btn" onClick={goBack}>
        {t('common.back')}
      </button>

      <header className="page-header">
        <p className="eyebrow">{t('settings.eyebrow')}</p>
        <h1 className="page-title">{t('settings.title')}</h1>
      </header>

      <section className="settings-card" aria-labelledby="settings-language">
        <h2 className="settings-card-title" id="settings-language">
          <span className="settings-card-icon" aria-hidden="true">
            🌐
          </span>
          {t('settings.languageTitle')}
        </h2>
        <p className="settings-hint">{t('settings.languageHint')}</p>
        <div className="segmented" role="radiogroup" aria-labelledby="settings-language">
          {LANGUAGES.map(({ code, label, short }) => {
            const active = lang === code
            return (
              <button
                key={code}
                type="button"
                role="radio"
                aria-checked={active}
                className={`segment ${active ? 'segment-active' : ''}`}
                onClick={() => setLanguage(code)}
              >
                <span className="segment-badge" aria-hidden="true">
                  {short}
                </span>
                {label}
              </button>
            )
          })}
        </div>
      </section>

      <section className="settings-card" aria-labelledby="settings-data">
        <h2 className="settings-card-title" id="settings-data">
          <span className="settings-card-icon" aria-hidden="true">
            🗂️
          </span>
          {t('settings.dataTitle')}
        </h2>
        <p className="settings-hint">{t('settings.dataHint')}</p>
        <p className="settings-counts">{t('settings.counts', collection.length, wishlist.length)}</p>

        <div className="settings-actions">
          <button type="button" className="btn btn-accent" onClick={exportData}>
            <span className="btn-icon" aria-hidden="true">
              ↓
            </span>
            {t('settings.export')}
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="btn-icon" aria-hidden="true">
              ↑
            </span>
            {t('settings.import')}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="visually-hidden"
            tabIndex={-1}
            aria-hidden="true"
            onChange={readFile}
          />
        </div>

        {pending && (
          <div className="import-confirm">
            <p className="import-summary">
              {t('settings.preview', pending.collection.length, pending.wishlist.length)}
            </p>
            {pending.skipped > 0 && (
              <p className="settings-hint">{t('settings.skipped', pending.skipped)}</p>
            )}
            <div className="import-choices">
              <button type="button" className="import-choice" onClick={() => applyImport('merge')}>
                <strong>{t('settings.merge')}</strong>
                <span>{t('settings.mergeHint')}</span>
              </button>
              <button
                type="button"
                className="import-choice import-choice-replace"
                onClick={() => applyImport('replace')}
              >
                <strong>{t('settings.replace')}</strong>
                <span>{t('settings.replaceHint')}</span>
              </button>
            </div>
            <button type="button" className="import-cancel" onClick={() => setPending(null)}>
              {t('settings.cancel')}
            </button>
          </div>
        )}

        {status && (
          <p className={`settings-status settings-status-${status.tone}`} role="status">
            {status.text}
          </p>
        )}
      </section>
    </div>
  )
}
