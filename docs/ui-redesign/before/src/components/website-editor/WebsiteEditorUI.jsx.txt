'use client'

import React, { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AlertCircle, BookOpen, ChevronDown, Edit3, ExternalLink, Eye, FileText, Image, Loader, Lock, LogOut, RotateCcw, Save, Users, X } from 'lucide-react'
import { useWebsiteEditor } from './WebsiteEditorProvider.jsx'
import styles from './WebsiteEditorUI.module.css'

const modules = [
  { key: 'circulars', label: 'Circulars', Icon: FileText },
  { key: 'staff', label: 'Staff', Icon: Users },
  { key: 'gallery', label: 'Gallery', Icon: Image },
  { key: 'syllabus', label: 'Syllabus', Icon: BookOpen },
  { key: 'disclosure', label: 'Disclosure', Icon: FileText },
]

function text(value) {
  return value === null || value === undefined ? '' : String(value)
}

function imageSource(value) {
  const source = text(value)
  const background = source.match(/^url\((['"]?)(.*?)\1\)$/)
  const resolved = background ? background[2] : source
  return /^(?:\/(?!\/)|https:\/\/)/.test(resolved) ? resolved : null
}

export default function WebsiteEditorUI() {
  const editor = useWebsiteEditor()
  const {
    active, preview, pageName, fields = [], selectedField, selectedRecord, value,
    dirtyCount = 0, saving, message, error, fieldError, exitDestination,
    capabilitiesLoading, errorStatus,
    selectField, changeField, saveField, cancelField, closePanel, saveAll,
    discardAll, togglePreview, requestExit, finishExit, reloadSelected,
    retryCatalog, manageRecord, chooseManagedModule, hoverTarget, selectManagedRecord,
    selectionFields = [], history = {entries:[]}, historyLoading,
    uploadSelectedImage, revertSelected, loadOlderHistory, destinationConfirmed, confirmDestination,
  } = editor
  const [mounted, setMounted] = useState(false)
  const [menu, setMenu] = useState(null)
  const [fieldSearch, setFieldSearch] = useState('')
  const [pendingRestore, setPendingRestore] = useState(null)
  const inputRef = useRef(null)
  const panelRef = useRef(null)
  const modalRef = useRef(null)
  const fieldsButtonRef = useRef(null)
  const returnButtonRef = useRef(null)
  const titleId = useId()
  const inputId = useId()
  const helpId = useId()
  const errorId = useId()
  const exitTitleId = useId()
  const exitDescriptionId = useId()

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => { setMenu(null) }, [editor.path, preview, active])
  useEffect(() => { setPendingRestore(null) }, [selectedField?.key])
  useEffect(() => {
    if (!mounted || !active || !preview) return undefined
    const frame = window.requestAnimationFrame(() => returnButtonRef.current?.focus())
    return () => window.cancelAnimationFrame(frame)
  }, [mounted, active, preview])

  useEffect(() => {
    if (!active || preview || exitDestination || (!selectedField && !selectedRecord)) return undefined
    const previous = document.activeElement
    const timer = window.requestAnimationFrame(() => {
      const target = inputRef.current || panelRef.current?.querySelector('button')
      target?.focus()
    })
    const keydown = event => {
      if (event.key === 'Escape' && !saving) {
        event.preventDefault()
        event.stopPropagation()
        closePanel()
      }
    }
    document.addEventListener('keydown', keydown, true)
    return () => {
      window.cancelAnimationFrame(timer)
      document.removeEventListener('keydown', keydown, true)
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus()
      else fieldsButtonRef.current?.focus()
    }
  }, [active, preview, selectedField?.key, selectedRecord?.module, exitDestination, saving, closePanel])

  useEffect(() => {
    if (!active || preview || !exitDestination) return undefined
    const previous = document.activeElement
    const dialog = modalRef.current
    const focusable = () => [...dialog.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]')].filter(element => element.getClientRects().length)
    const focusFirst = () => (focusable()[0] || dialog).focus()
    const timer = window.requestAnimationFrame(focusFirst)
    const keydown = event => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        if (!saving) finishExit('cancel')
        return
      }
      if (event.key !== 'Tab') return
      const controls = focusable()
      if (!controls.length) {
        event.preventDefault()
        dialog.focus()
        return
      }
      const first = controls[0]
      const last = controls.at(-1)
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialog)) {
        event.preventDefault()
        first.focus()
      }
    }
    const keepFocus = event => { if (!dialog.contains(event.target)) focusFirst() }
    document.addEventListener('keydown', keydown, true)
    document.addEventListener('focusin', keepFocus)
    return () => {
      window.cancelAnimationFrame(timer)
      document.removeEventListener('keydown', keydown, true)
      document.removeEventListener('focusin', keepFocus)
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus()
      else fieldsButtonRef.current?.focus()
    }
  }, [active, preview, exitDestination, saving, finishExit])

  if (!mounted || !active) return null

  if (preview) return createPortal(
    <div className={styles.root} data-website-editor-ui="true">
      <button ref={returnButtonRef} type="button" className={styles.returnButton} onClick={togglePreview} aria-label="Return to website editing">
        <Edit3 size={16} aria-hidden="true" /> Return to editing
      </button>
    </div>,
    document.body
  )

  const choices = selectedField?.contentType === 'image' && selectedField.uploadAllowed && !selectedField.choices?.some(choice=>choice.value===value)
    ? [...(selectedField.choices || []),{value,label:'Uploaded image'}] : selectedField?.choices
  const displayValue = current => choices?.find(choice => choice.value === current)?.label || text(current)
  const protectedField = selectedField && (selectedField.editable !== true || selectedField.status === 'protected' || (['image', 'url', 'link'].includes(selectedField.contentType) && !choices?.length))
  const isNumber = selectedField?.contentType === 'number' || selectedField?.editorKind === 'number'
  const multiline = selectedField && (['multiline', 'paragraph', 'description'].includes(selectedField.editorKind) || text(selectedField.defaultValue).includes('\n') || text(selectedField.defaultValue).length > 220)
  const selectedDirty = selectedField && value !== selectedField.value
  const selectedModule = selectedRecord && modules.find(item => item.key === selectedRecord.module)
  const isImage = selectedField?.contentType === 'image' || selectedField?.editorKind === 'image'
  const previewImage = isImage ? imageSource(value) : null
  const selectedLabel = selectedField?.editorLabel || selectedField?.fieldName || 'Selected content'
  const hoverModule = hoverTarget && modules.find(item => item.key === hoverTarget.module)
  const hoverRect = hoverTarget?.rect
  const hoverVisible = hoverRect && hoverRect.width > 0 && hoverRect.height > 0 && hoverRect.top + hoverRect.height > 0 && hoverRect.top < window.innerHeight && hoverRect.left + hoverRect.width > 0 && hoverRect.left < window.innerWidth
  const hoverTop = hoverVisible && hoverRect.top >= 44 ? hoverRect.top - 36 : hoverVisible && hoverRect.top + hoverRect.height + 44 <= window.innerHeight ? hoverRect.top + hoverRect.height + 6 : null
  const visibleFields=fields.filter(field=>`${field.editorLabel} ${field.section} ${field.sourceFile}`.toLowerCase().includes(fieldSearch.toLowerCase()))
  const sourceLabel=field=>`${field.scope==='global'?'Shared · ':''}${(field.sourceFile||'Website').split('/').at(-1).replace(/\.jsx$/,'').replace(/([a-z])([A-Z])/g,'$1 $2')}`

  return createPortal(
    <div className={styles.root} data-website-editor-ui="true">
      <style>{'[data-website-field]:hover,[data-website-field]:focus-visible{outline:2px solid #bc8c23;outline-offset:3px;cursor:text}'}</style>
      <p id="website-editor-instructions" className={styles.srOnly}>Select outlined text or use Tab and Enter to edit. On a managed record, use Alt and Enter to open its existing content tools.</p>
      {hoverTop !== null && hoverTarget && <button type="button" className={styles.hoverButton} style={{ top: hoverTop, left: Math.max(8, Math.min(hoverRect.left, window.innerWidth - 228)) }} onClick={() => hoverTarget.kind === 'record' ? selectManagedRecord({ module: hoverTarget.module, id: hoverTarget.id, label: hoverTarget.label }) : selectField(hoverTarget.key,hoverTarget.keys)}>
        {hoverTarget.kind === 'record' ? <ExternalLink size={13} aria-hidden="true" /> : <Edit3 size={13} aria-hidden="true" />}<span>{hoverTarget.kind === 'record' ? `Manage ${hoverModule?.label || 'content'}` : `Edit ${hoverTarget.label || 'content'}`}</span>
      </button>}
      {(message || error || capabilitiesLoading) && (
        <div className={styles.feedback}>
          {capabilitiesLoading && <p role="status"><Loader size={15} className={styles.spin} aria-hidden="true" /> Checking editor access…</p>}
          {message && <p role="status" aria-live="polite">{message}</p>}
          {error && <div className={styles.error} role="alert"><AlertCircle size={16} aria-hidden="true" /><span>{error}</span>{![401, 403].includes(errorStatus) && <button type="button" onClick={retryCatalog} disabled={saving}>Retry</button>}</div>}
        </div>
      )}

      <div className={styles.toolbar} role="region" aria-label="Website editor toolbar" aria-busy={Boolean(saving)}>
        <div className={styles.identity}>
          <span className={styles.indicator}><span aria-hidden="true" /> Edit Website</span>
          <span className={styles.pageName}><span className={styles.srOnly}>Current page: </span>{pageName || 'Website'}</span>
          <span className={dirtyCount ? styles.unsaved : styles.saved}>{dirtyCount ? `${dirtyCount} unsaved ${dirtyCount === 1 ? 'change' : 'changes'}` : 'All changes saved'}</span>
        </div>
        <div className={styles.tools}>
          <button ref={fieldsButtonRef} type="button" className={styles.button} aria-expanded={menu === 'fields'} aria-controls="website-editor-fields-menu" onClick={() => setMenu(menu === 'fields' ? null : 'fields')} disabled={saving || capabilitiesLoading}>
            <Edit3 size={15} aria-hidden="true" /> Edit fields <ChevronDown size={13} aria-hidden="true" />
          </button>
          <button type="button" className={styles.button} aria-expanded={menu === 'records'} aria-controls="website-editor-records-menu" onClick={() => setMenu(menu === 'records' ? null : 'records')} disabled={saving || capabilitiesLoading}>
            <FileText size={15} aria-hidden="true" /> Existing content <ChevronDown size={13} aria-hidden="true" />
          </button>
          <button type="button" className={styles.button} onClick={togglePreview} disabled={saving} aria-label="Preview website without editing controls"><Eye size={16} aria-hidden="true" /> Preview</button>
          <button type="button" className={styles.primaryButton} onClick={saveAll} disabled={saving || !dirtyCount || capabilitiesLoading}>
            {saving ? <Loader size={16} className={styles.spin} aria-hidden="true" /> : <Save size={16} aria-hidden="true" />} {saving ? 'Saving…' : 'Save Changes'}
          </button>
          <button type="button" className={styles.button} onClick={discardAll} disabled={saving || !dirtyCount}><RotateCcw size={15} aria-hidden="true" /> Discard Changes</button>
          <button type="button" className={styles.exitButton} onClick={() => requestExit('/admin/dashboard')} disabled={saving}><LogOut size={15} aria-hidden="true" /> Exit Editor</button>
        </div>
      </div>

      {menu === 'fields' && (
        <section id="website-editor-fields-menu" className={styles.menu} aria-label="Editable fields on this page">
          <div className={styles.menuHeader}><h2>Fields on this page</h2><button type="button" className={styles.iconButton} onClick={() => setMenu(null)} aria-label="Close fields list"><X size={17} aria-hidden="true" /></button></div>
          <label className={styles.label}>Find content<input className={styles.input} type="search" value={fieldSearch} onChange={event=>setFieldSearch(event.target.value)} placeholder="Search text or section" /></label>
          <p className={styles.hint}>{visibleFields.length} editable fields, including shared website content.</p>
          {visibleFields.length ? <ul className={styles.fieldList}>{visibleFields.map(field => <li key={field.key}><button type="button" aria-pressed={selectedField?.key === field.key} onClick={() => { selectField(field.key); setMenu(null) }}><Edit3 size={15} aria-hidden="true" /><span><small className={styles.fieldSource}>{sourceLabel(field)}</small>{field.editorLabel || field.fieldName}</span></button></li>)}</ul> : <p className={styles.empty}>No content matches this search.</p>}
          <p className={styles.hint}>You can also select outlined content on the page. Use Tab, then Enter, to edit with your keyboard.</p>
        </section>
      )}

      {menu === 'records' && (
        <section id="website-editor-records-menu" className={styles.menu} aria-label="Existing content management">
          <div className={styles.menuHeader}><h2>Existing content</h2><button type="button" className={styles.iconButton} onClick={() => setMenu(null)} aria-label="Close existing content list"><X size={17} aria-hidden="true" /></button></div>
          <p className={styles.hint}>Open the existing tools to manage these records.</p>
          <ul className={styles.fieldList}>{modules.map(({ key, label, Icon }) => <li key={key}><button type="button" onClick={() => { chooseManagedModule(key); setMenu(null) }}><Icon size={17} aria-hidden="true" /><span>{label}</span></button></li>)}</ul>
        </section>
      )}

      {(selectedField || selectedRecord) && (
        <section ref={panelRef} className={styles.panel} role="dialog" aria-modal="false" aria-labelledby={titleId} aria-busy={Boolean(saving)}>
          <div className={styles.panelHeader}>
            <div><p className={styles.eyebrow}>{selectedField ? 'Edit content' : 'Existing content'}</p><h2 id={titleId}>{selectedField ? selectedLabel : selectedRecord.label || selectedModule?.label || 'Manage content'}</h2></div>
            <button type="button" className={styles.iconButton} onClick={closePanel} disabled={saving} aria-label="Close editing panel"><X size={19} aria-hidden="true" /></button>
          </div>
          {selectedField ? (
            <form className={styles.panelBody} onSubmit={event => { event.preventDefault(); if (!saving && !protectedField && selectedDirty) saveField() }}>
              {selectionFields.length>1 && <label className={styles.label}>Content in this element<select className={styles.input} value={selectedField.key} disabled={saving} onChange={event=>selectField(event.target.value,selectionFields.map(field=>field.key))}>{selectionFields.map(field=><option value={field.key} key={field.key}>{field.label || field.key}</option>)}</select></label>}
              {protectedField ? <div className={styles.protected}><Lock size={19} aria-hidden="true" /><div><strong>Protected content</strong><p>This image or destination is protected by the website’s content policy.</p></div></div> : <p className={styles.hint}>Change only this field. Its position and styling stay the same.</p>}
              {previewImage && <img className={styles.imagePreview} src={previewImage} alt="Current website image" />}
              {isImage && selectedField.uploadAllowed && <label className={styles.label}>Upload a replacement<input className={styles.input} type="file" accept="image/jpeg,image/png,image/webp" disabled={saving} onChange={event=>{const file=event.currentTarget.files?.[0];event.currentTarget.value='';if(file)uploadSelectedImage(file)}}/><span className={styles.hint}>JPEG, PNG or WebP, up to 10 MB. Images are resized without cropping; originals and saved revisions are retained.</span></label>}
              <label className={styles.label} htmlFor={inputId}>{protectedField ? 'Current value' : isImage ? 'Image' : choices?.length ? 'Destination' : 'Content'}</label>
              {choices?.length && !protectedField ? (
                <select ref={inputRef} id={inputId} className={styles.input} value={value} onChange={event => changeField(event.target.value)} disabled={saving} aria-describedby={`${helpId}${fieldError ? ` ${errorId}` : ''}`} aria-invalid={Boolean(fieldError)}>
                  {choices.map(choice => <option key={choice.value} value={choice.value}>{choice.label}</option>)}
                </select>
              ) : multiline ? <textarea ref={inputRef} id={inputId} className={styles.input} rows={6} value={text(value)} onChange={event => changeField(event.target.value)} maxLength={selectedField.maxLength || undefined} readOnly={Boolean(protectedField)} disabled={saving} aria-describedby={`${helpId}${fieldError ? ` ${errorId}` : ''}`} aria-invalid={Boolean(fieldError)} /> : <input ref={inputRef} id={inputId} className={styles.input} type={isNumber ? 'number' : 'text'} step={isNumber ? 1 : undefined} min={isNumber ? 0 : undefined} max={isNumber ? 1000000000 : undefined} value={isNumber ? value ?? '' : text(value)} onChange={event => changeField(isNumber && event.target.value !== '' ? Number(event.target.value) : event.target.value)} maxLength={selectedField.maxLength || undefined} readOnly={Boolean(protectedField)} disabled={saving} aria-describedby={`${helpId}${fieldError ? ` ${errorId}` : ''}`} aria-invalid={Boolean(fieldError)} />}
              <p id={helpId} className={styles.inputHelp}>{protectedField ? 'Use the existing content tools for managed records.' : choices?.length ? 'Choose from the approved school images or public pages.' : isNumber ? 'Enter a whole number, including zero.' : selectedField.maxLength ? `${text(value).length} / ${selectedField.maxLength} characters` : 'Plain text only.'}</p>
              {selectedField.contentType==='url' && <label className={styles.confirmation}><input type="checkbox" checked={Boolean(destinationConfirmed)} disabled={saving} onChange={event=>confirmDestination(event.target.checked)}/><span>I confirm changing this destination, including any restoration I select below.<small>Saved: {text(selectedField.value)}<br/>Selected: {text(value)}</small></span></label>}
              {fieldError && <p id={errorId} className={styles.fieldError} role="alert"><AlertCircle size={16} aria-hidden="true" />{fieldError}</p>}
              {errorStatus === 409 && <div className={styles.conflict}><p>Another administrator saved a newer value. Reloading replaces your unsaved edit for this field.</p><button type="button" className={styles.button} onClick={reloadSelected} disabled={saving}>Reload saved value</button></div>}
              <details className={styles.values}><summary>Original and saved content</summary><h3>Original</h3><p>{displayValue(selectedField.defaultValue) || <em>Empty value</em>}</p><h3>Currently saved</h3><p>{displayValue(selectedField.value) || <em>Empty value</em>}</p></details>
              <div className={styles.panelActions}><button type="submit" className={styles.primaryButton} disabled={saving || Boolean(protectedField) || !selectedDirty || capabilitiesLoading || selectedField.contentType==='url'&&!destinationConfirmed}>{saving ? <Loader size={15} className={styles.spin} aria-hidden="true" /> : <Save size={15} aria-hidden="true" />} {saving ? 'Saving…' : 'Save'}</button><button type="button" className={styles.button} onClick={cancelField} disabled={saving}>Cancel</button></div>
              <button type="button" className={styles.button} disabled={saving || !selectedField.hasOverride || selectedField.contentType==='url'&&!destinationConfirmed} onClick={()=>revertSelected()}>Restore original content</button>
              <details className={styles.values}><summary>Saved revision history</summary>
                {historyLoading && <p role="status">Loading saved revisions…</p>}
                {!historyLoading && !history.entries?.length && <p>No saved revisions yet.</p>}
                <ul className={styles.historyList}>{history.entries?.map(entry=><li key={entry.revision}>
                  <strong>Revision {entry.revision}</strong><small>{new Date(entry.changedAt).toLocaleString()}</small>
                  {isImage && imageSource(entry.newValue) ? <img src={imageSource(entry.newValue)} className={styles.historyImage} alt={`Image from revision ${entry.revision}`} loading="lazy"/> : <p>{text(entry.newValue).slice(0,160)}</p>}
                  {pendingRestore===entry.revision ? <div><p>Restore this saved content?</p><button type="button" className={styles.button} disabled={saving || selectedField.contentType==='url'&&!destinationConfirmed} onClick={async()=>{if(await revertSelected(entry.revision))setPendingRestore(null)}}>Confirm restore</button><button type="button" className={styles.button} disabled={saving} onClick={()=>setPendingRestore(null)}>Cancel</button></div> : <button type="button" className={styles.button} disabled={saving} onClick={()=>setPendingRestore(entry.revision)}>Restore this revision</button>}
                </li>)}</ul>
                {history.hasMore && <button type="button" className={styles.button} onClick={loadOlderHistory} disabled={historyLoading || saving}>Load older revisions</button>}
              </details>
            </form>
          ) : (
            <div className={styles.panelBody}><p>Manage {selectedModule?.label?.toLowerCase() || 'this content'} with the existing school administration tools.</p><p className={styles.hint}>Your website changes will be checked before leaving the editor.</p><button type="button" className={styles.primaryButton} onClick={() => manageRecord(selectedRecord.module)} disabled={saving}><ExternalLink size={16} aria-hidden="true" /> Open {selectedModule?.label || 'content tools'}</button></div>
          )}
        </section>
      )}

      {exitDestination && (
        <div className={styles.backdrop} onMouseDown={event => { if (event.target === event.currentTarget && !saving) finishExit('cancel') }}>
          <section ref={modalRef} className={styles.exitDialog} role="alertdialog" aria-modal="true" aria-labelledby={exitTitleId} aria-describedby={exitDescriptionId} tabIndex={-1} aria-busy={Boolean(saving)}>
            <div className={styles.exitIcon}><AlertCircle size={24} aria-hidden="true" /></div>
            <h2 id={exitTitleId}>Save your changes before leaving?</h2>
            <p id={exitDescriptionId}>You have {dirtyCount} unsaved {dirtyCount === 1 ? 'change' : 'changes'}. Choose what to do before leaving the website editor.</p>
            {error && <p className={styles.fieldError} role="alert">{error}</p>}
            <div className={styles.exitActions}><button type="button" className={styles.primaryButton} onClick={() => finishExit('save')} disabled={saving}>{saving ? <Loader size={16} className={styles.spin} aria-hidden="true" /> : <Save size={16} aria-hidden="true" />} {saving ? 'Saving…' : 'Save and Exit'}</button><button type="button" className={styles.dangerButton} onClick={() => finishExit('discard')} disabled={saving}>Discard and Exit</button><button type="button" className={styles.button} onClick={() => finishExit('cancel')} disabled={saving}>Cancel</button></div>
          </section>
        </div>
      )}
    </div>,
    document.body
  )
}
