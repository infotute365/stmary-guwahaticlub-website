'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { usePathname, useRouter } from 'next/navigation'
import { getSession, getWebsiteContent, getWebsiteContentCatalog, saveWebsiteContent, getWebsiteContentHistory, restoreWebsiteContent, resetWebsiteContent, uploadWebsiteImage } from '../../services/api.js'
import { PUBLIC_PAGES, MANAGED_MODULES } from './editor-bindings.js'
import { CONTENT_BINDINGS } from '../../content/website-bindings.js'
import { updateDraft, removeDraft, editorErrorMessage, blocksExternalNavigation } from './editor-state.js'
import { useAuth } from '../../hooks/useAuth.js'

const WebsiteEditorUI = dynamic(() => import('./WebsiteEditorUI.jsx'), { ssr: false })
const INTENT_KEY = 'stmary.website-editor.intent.v1'
const noop = () => {}
const EMPTY_PUBLISHED = Object.freeze({})
const bindingsByKey = new Map(CONTENT_BINDINGS.map(binding => [binding.key, binding]))
const EditorContext = createContext({ active: false, preview: false, published: {}, drafts: {}, startEditing: noop, fieldProps: () => ({}), recordProps: () => ({}) })
export const useWebsiteEditor = () => useContext(EditorContext)

function rememberIntent(enabled) {
  try {
    if (enabled) sessionStorage.setItem(INTENT_KEY, 'requested')
    else sessionStorage.removeItem(INTENT_KEY)
  } catch { /* In-memory intent still works when browser storage is disabled. */ }
}

export default function WebsiteEditorProvider({ children, initialPublished = EMPTY_PUBLISHED }) {
  const path = usePathname()
  const router = useRouter()
  const auth = useAuth()
  const [intent, setIntent] = useState(false)
  const [verifiedPath, setVerifiedPath] = useState(null)
  const [catalog, setCatalog] = useState({})
  const [published, setPublished] = useState(initialPublished)
  const [drafts, setDrafts] = useState({})
  const [selectedKey, setSelectedKey] = useState(null)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [preview, setPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [capabilitiesLoading, setCapabilitiesLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [errorStatus, setErrorStatus] = useState(null)
  const [exitDestination, setExitDestination] = useState(null)
  const [hoverTarget, setHoverTarget] = useState(null)
  const [selectionKeys, setSelectionKeys] = useState([])
  const [confirmedDestinations, setConfirmedDestinations] = useState({})
  const confirmationsRef = useRef(confirmedDestinations)
  confirmationsRef.current = confirmedDestinations
  const [history, setHistory] = useState({entries:[]})
  const [historyVersion, setHistoryVersion] = useState(0)
  const [historyLoading, setHistoryLoading] = useState(false)
  const firstPublicRead = useRef(true)
  const generation = useRef(0)
  const authorizationVersion = useRef(0)
  const historyRequest = useRef(0)
  const account = useRef(null)
  const lock = useRef(false)
  const publication = useRef(0)
  const draftsRef = useRef(drafts)
  const catalogRef = useRef(catalog)
  const activeRef = useRef(false)
  draftsRef.current = drafts
  catalogRef.current = catalog
  const publicPage = PUBLIC_PAGES.find(page => page.path === path)
  const active = Boolean(intent && publicPage && verifiedPath === path && !auth.loading && auth.isAdmin)
  activeRef.current = active
  const dirtyCount = Object.keys(drafts).length

  const revoke = useCallback(() => {
    generation.current++
    authorizationVersion.current++
    historyRequest.current++
    activeRef.current=false
    account.current=null
    draftsRef.current={}
    catalogRef.current={}
    rememberIntent(false)
    setIntent(false)
    setVerifiedPath(null)
    setSelectedKey(null)
    setSelectedRecord(null)
    setDrafts({})
    setCatalog({})
    setCapabilitiesLoading(false)
    setHistoryLoading(false)
    setPreview(false)
    setHoverTarget(null)
    setExitDestination(null)
    setSelectionKeys([])
    setConfirmedDestinations({})
    setHistory({entries:[]})
  }, [])

  useEffect(() => {
    setPublished(previous => {
      const next = {...initialPublished}
      // Absence in a fresh server snapshot means the override was reset. Only
      // retain a newer local revision when that key still has a server override.
      for (const [key, state] of Object.entries(previous)) if (next[key] && state.revision > next[key].revision) next[key] = state
      return next
    })
  }, [initialPublished])

  useEffect(() => {
    try { setIntent(sessionStorage.getItem(INTENT_KEY) === 'requested') } catch { /* No persisted intent. */ }
  }, [])

  useEffect(() => {
    if (intent && !auth.loading && !auth.isAdmin) revoke()
  }, [intent, auth.loading, auth.isAdmin, revoke])

  const refreshCatalog = useCallback(async () => {
    if (!intent || !PUBLIC_PAGES.some(page => page.path === path)) return false
    const current = ++generation.current
    setCapabilitiesLoading(true)
    try {
      // Storage is only intent. Both responses are freshly authenticated by the
      // existing server middleware, including current active account/role.
      const [user, result] = await Promise.all([getSession(), getWebsiteContentCatalog(path)])
      if (current !== generation.current) return false
      if (!user?.isActive || !['admin', 'super-admin'].includes(user.role)) {
        revoke()
        return false
      }
      if (account.current && account.current !== user.id) {
        authorizationVersion.current++
        draftsRef.current={}
        setDrafts({})
        setSelectedKey(null)
        setSelectedRecord(null)
        setConfirmedDestinations({})
      }
      account.current = user.id
      const next = { ...catalogRef.current }
      for (const field of result.fields || []) next[field.key] = field
      catalogRef.current = next
      setCatalog(next)
      publication.current++
      setPublished(previous => {
        const values = { ...previous }
        for (const field of result.fields || []) {
          if (!bindingsByKey.has(field.key)) continue
          if (field.hasOverride) values[field.key] = { value: field.value, revision: field.revision, contentType: field.contentType }
          else delete values[field.key]
        }
        return values
      })
      setVerifiedPath(path)
      setError('')
      return true
    } catch (failure) {
      if (current !== generation.current) return false
      setError(editorErrorMessage(failure))
      if ([401, 403].includes(failure?.response?.status)) revoke()
      return false
    } finally {
      if (current === generation.current) setCapabilitiesLoading(false)
    }
  }, [intent, path, revoke])

  useEffect(() => {
    setSelectedKey(null)
    setSelectedRecord(null)
    setHoverTarget(null)
    if (intent && publicPage) refreshCatalog()
    else setVerifiedPath(null)
    return () => { generation.current++ }
  }, [intent, path, refreshCatalog, Boolean(publicPage)])

  useEffect(() => {
    if (!intent || !publicPage) return
    const verify = () => { if (document.visibilityState !== 'hidden') refreshCatalog() }
    window.addEventListener('focus', verify)
    document.addEventListener('visibilitychange', verify)
    const interval = window.setInterval(verify, 60000)
    return () => {
      window.removeEventListener('focus', verify)
      document.removeEventListener('visibilitychange', verify)
      clearInterval(interval)
    }
  }, [intent, Boolean(publicPage), refreshCatalog])

  useEffect(() => {
    if (!PUBLIC_PAGES.some(page => page.path === path)) return
    if (firstPublicRead.current) { firstPublicRead.current = false; return }
    let cancelled = false
    const version = publication.current
    getWebsiteContent(path).then(result => {
      if (cancelled || version !== publication.current) return
      setPublished(previous => {
        const next = { ...previous }
        for (const binding of CONTENT_BINDINGS.filter(binding => binding.routes.includes(path))) {
          const override = result.overrides?.[binding.key]
          if (override && Object.hasOwn(override, 'value')) next[binding.key] = override
          else delete next[binding.key]
        }
        return next
      })
    }).catch(() => { /* Exact source defaults remain available on read failure. */ })
    return () => { cancelled = true }
  }, [path])

  useEffect(() => {
    if (!intent || !dirtyCount) return
    const warn = event => { event.preventDefault(); event.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [intent, dirtyCount])

  const startEditing = useCallback(() => {
    rememberIntent(true)
    setIntent(true)
    setPreview(false)
    setError('')
    setMessage('')
  }, [])

  const selectField = useCallback((key, alternatives = [key]) => {
    const field = catalogRef.current[key]
    if (!activeRef.current || lock.current || !bindingsByKey.has(key) || !field?.editable) return
    setSelectionKeys(alternatives.filter(candidate => bindingsByKey.has(candidate) && catalogRef.current[candidate]?.editable))
    setSelectedKey(key)
    setSelectedRecord(null)
    setFieldError('')
    setErrorStatus(null)
    const target = [...document.querySelectorAll('[data-website-field]')].find(node => node.dataset.websiteField === key)
    target?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [])

  useEffect(() => {
    const request=++historyRequest.current
    if (!active || !selectedKey) { setHistory({entries:[]}); setHistoryLoading(false); return }
    let cancelled = false
    setHistoryLoading(true)
    getWebsiteContentHistory(selectedKey).then(result => { if (!cancelled && request===historyRequest.current) setHistory(result) })
      .catch(failure => { if (!cancelled && request===historyRequest.current) {setFieldError(editorErrorMessage(failure));if([401,403].includes(failure?.response?.status))revoke()} })
      .finally(() => { if (!cancelled && request===historyRequest.current) setHistoryLoading(false) })
    return () => { cancelled = true }
  }, [active, selectedKey, historyVersion, revoke])

  const selectManagedRecord = useCallback(record => {
    if (!activeRef.current || lock.current || !MANAGED_MODULES[record?.module]) return
    setSelectedRecord(record)
    setSelectedKey(null)
  }, [])

  const changeField = useCallback(value => {
    if (!activeRef.current || !selectedKey || lock.current) return
    const saved = catalogRef.current[selectedKey]
    if (!saved?.editable) return
    setDrafts(previous => updateDraft(previous, selectedKey, value, saved.value, saved.revision))
    setFieldError('')
    setErrorStatus(null)
    setMessage('')
  }, [selectedKey])

  const saveKeys = useCallback(async keys => {
    if (!activeRef.current || lock.current) return false
    lock.current = true
    setSaving(true)
    setFieldError('')
    setError('')
    setErrorStatus(null)
    let savedCount = 0
    const authorization=authorizationVersion.current
    try {
      for (const key of keys) {
        if(!activeRef.current || authorization!==authorizationVersion.current)return false
        const draft = draftsRef.current[key]
        const field = catalogRef.current[key]
        if (!draft || !field?.editable || !bindingsByKey.has(key)) continue
        if (field.contentType === 'url' && confirmationsRef.current[key] !== draft.value) {
          setSelectedKey(key)
          setFieldError('Confirm the destination change in this field before saving.')
          return false
        }
        if (typeof draft.value === 'string' && draft.value.length > field.maxLength) {
          setFieldError(`Keep this field within ${field.maxLength} characters.`)
          return false
        }
        const response = await saveWebsiteContent(key, draft.value, draft.expectedRevision, field.contentType, {confirmDestination:field.contentType === 'url'})
        if(!activeRef.current || authorization!==authorizationVersion.current)return false
        const committed = response.field
        const nextField = { ...field, ...committed }
        catalogRef.current = { ...catalogRef.current, [key]: nextField }
        setCatalog(catalogRef.current)
        publication.current++
        setPublished(previous => ({ ...previous, [key]: { value: committed.value, revision: committed.revision, contentType: field.contentType } }))
        draftsRef.current = removeDraft(draftsRef.current, key)
        setDrafts(draftsRef.current)
        savedCount++
      }
      setMessage(savedCount ? `${savedCount === 1 ? 'Change' : `${savedCount} changes`} saved.` : 'No unsaved changes.')
      if (savedCount) { setHistoryVersion(previous => previous + 1); router.refresh?.() }
      return true
    } catch (failure) {
      if(authorization!==authorizationVersion.current)return false
      const detail = editorErrorMessage(failure)
      setFieldError(detail)
      setError(detail)
      setErrorStatus(failure?.response?.status ?? null)
      if ([401, 403].includes(failure?.response?.status)) revoke()
      else if (savedCount) setMessage(`${savedCount} change${savedCount === 1 ? '' : 's'} saved. Remaining drafts are kept.`)
      return false
    } finally {
      lock.current = false
      setSaving(false)
    }
  }, [revoke, router])

  const saveField = useCallback(() => saveKeys(selectedKey ? [selectedKey] : []), [saveKeys, selectedKey])
  const saveAll = useCallback(() => saveKeys(Object.keys(draftsRef.current)), [saveKeys])
  const closePanel = useCallback(() => { if (!lock.current) { setSelectedKey(null); setSelectedRecord(null); setFieldError('') } }, [])
  const cancelField = useCallback(() => {
    if (lock.current) return
    if (selectedKey) setDrafts(previous => removeDraft(previous, selectedKey))
    closePanel()
  }, [selectedKey, closePanel])
  const discardAll = useCallback(() => {
    if (lock.current) return
    setDrafts({})
    setFieldError('')
    setError('')
    setMessage('Unsaved changes discarded.')
  }, [])

  const leave = useCallback(destination => {
    revoke()
    setMessage('')
    setError('')
    router.push(destination)
  }, [revoke, router])
  const requestExit = useCallback((destination = '/admin/dashboard') => {
    if (lock.current) return
    if (Object.keys(draftsRef.current).length) { setPreview(false); setExitDestination(destination) }
    else leave(destination)
  }, [leave])
  const finishExit = useCallback(async action => {
    if (action === 'cancel') { setExitDestination(null); return }
    const destination = exitDestination || '/admin/dashboard'
    if (action === 'save' && !await saveAll()) return
    leave(destination)
  }, [exitDestination, leave, saveAll])

  const reloadSelected = useCallback(async () => {
    if (!selectedKey || lock.current) return
    if (await refreshCatalog()) {
      setDrafts(previous => removeDraft(previous, selectedKey))
      setFieldError('')
      setErrorStatus(null)
      setMessage('Loaded the latest saved value. Your previous draft was discarded.')
    }
  }, [selectedKey, refreshCatalog])

  const fieldProps = useCallback(key => {
    if (!active || preview || !bindingsByKey.has(key)) return {}
    const binding = bindingsByKey.get(key)
    return { 'data-website-field': key, tabIndex: 0, 'aria-label': `Edit ${binding.label}`, 'aria-describedby': 'website-editor-instructions' }
  }, [active, preview])
  const recordProps = useCallback((module, id, label) => {
    if (!active || preview || !MANAGED_MODULES[module]) return {}
    return { 'data-website-record': module, 'data-website-record-id': String(id || ''), 'data-website-record-label': label || MANAGED_MODULES[module].label, tabIndex: 0, 'aria-describedby': 'website-editor-instructions' }
  }, [active, preview])

  const applyReversion = useCallback((field, response) => {
    const committed = response.field
    catalogRef.current = {...catalogRef.current,[field.key]:{...field,...committed}}
    setCatalog(catalogRef.current)
    publication.current++
    setPublished(previous => {
      const next = {...previous}
      if (committed.hasOverride) next[field.key] = {value:committed.value,revision:committed.revision,contentType:field.contentType}
      else delete next[field.key]
      return next
    })
    draftsRef.current = removeDraft(draftsRef.current,field.key)
    setDrafts(draftsRef.current)
    setHistoryVersion(previous=>previous+1)
    router.refresh?.()
  }, [router])

  const revertSelected = useCallback(async revision => {
    const field=catalogRef.current[selectedKey]
    if (!activeRef.current || lock.current || !field?.editable) return false
    const currentValue=draftsRef.current[selectedKey]?.value ?? field.value
    if (field.contentType==='url' && confirmationsRef.current[selectedKey]!==currentValue) {setFieldError('Confirm changing this destination before restoring it.');return false}
    lock.current=true;setSaving(true);setFieldError('');setError('');setErrorStatus(null)
    const authorization=authorizationVersion.current
    try {
      const options={confirmDestination:field.contentType==='url'}
      const response=revision ? await restoreWebsiteContent(field.key,revision,field.revision,options) : await resetWebsiteContent(field.key,field.revision,options)
      if(!activeRef.current || authorization!==authorizationVersion.current)return false
      applyReversion(field,response)
      setMessage(revision?'Previous content restored.':'Original content restored.')
      return true
    } catch(failure) {
      if(authorization!==authorizationVersion.current)return false
      setFieldError(editorErrorMessage(failure));setErrorStatus(failure?.response?.status ?? null)
      if([401,403].includes(failure?.response?.status))revoke()
      return false
    } finally {lock.current=false;setSaving(false)}
  }, [selectedKey,applyReversion,revoke])

  const uploadSelectedImage = useCallback(async file => {
    const field=catalogRef.current[selectedKey]
    if(!file || !activeRef.current || lock.current || !field?.uploadAllowed)return false
    lock.current=true;setSaving(true);setFieldError('');setErrorStatus(null)
    const authorization=authorizationVersion.current
    try {
      const result=await uploadWebsiteImage(field.key,file)
      if(!activeRef.current || authorization!==authorizationVersion.current)return false
      setDrafts(previous=>updateDraft(previous,field.key,result.image.value,field.value,field.revision))
      setMessage('Image ready to preview. Save this field to publish it.')
      return true
    } catch(failure) {
      if(authorization!==authorizationVersion.current)return false
      setFieldError(editorErrorMessage(failure));setErrorStatus(failure?.response?.status ?? null)
      if([401,403].includes(failure?.response?.status))revoke()
      return false
    } finally {lock.current=false;setSaving(false)}
  },[selectedKey,revoke])

  const loadOlderHistory = useCallback(async () => {
    if(!activeRef.current || !selectedKey || !history.hasMore || historyLoading)return
    const request=historyRequest.current
    setHistoryLoading(true)
    try {
      const result=await getWebsiteContentHistory(selectedKey,{before:history.nextBefore})
      if(request!==historyRequest.current || !activeRef.current)return
      setHistory(previous=>previous.key===result.key?{...result,entries:[...previous.entries,...result.entries]}:previous)
    } catch(failure){if(request===historyRequest.current){setFieldError(editorErrorMessage(failure));if([401,403].includes(failure?.response?.status))revoke()}}
    finally {if(request===historyRequest.current)setHistoryLoading(false)}
  },[selectedKey,history.hasMore,history.nextBefore,historyLoading,revoke])

  useEffect(() => {
    if (!active) return
    const isEditor = target => target?.closest?.('[data-website-editor-ui]')
    const selectFrom = target => {
      const field = target.closest?.('[data-website-field]')
      if (field) selectField(field.dataset.websiteField, field.dataset.websiteFields?.split(' ').filter(Boolean) || [field.dataset.websiteField])
    }
    const click = event => {
      if (isEditor(event.target)) return
      if (!preview && event.target.closest?.('[data-website-field]')) {
        event.preventDefault()
        event.stopPropagation()
        selectFrom(event.target)
        return
      }
      const image = !preview && !event.target.closest?.('a,button,input,select,textarea') && event.target.closest?.('[data-website-image-field]')
      if (image) {
        event.preventDefault()
        event.stopPropagation()
        selectField(image.dataset.websiteImageField)
        return
      }
      const anchor = event.target.closest?.('a[href]')
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (anchor.hasAttribute('download') && href?.startsWith('blob:')) return
      if (blocksExternalNavigation(href, window.location.origin)) {
        event.preventDefault()
        event.stopPropagation()
        setMessage('External and payment links are protected while editing.')
        return
      }
      const next = new URL(href, window.location.origin)
      if (!PUBLIC_PAGES.some(page => page.path === next.pathname)) {
        event.preventDefault()
        event.stopPropagation()
        requestExit(next.pathname + next.search + next.hash)
      } else if (next.pathname !== path || next.search !== window.location.search) {
        // Existing plain <a> links must not reload away in-memory drafts.
        event.preventDefault()
        event.stopPropagation()
        router.push(next.pathname + next.search + next.hash)
      }
    }
    const submit = event => { if (!isEditor(event.target)) { event.preventDefault(); event.stopPropagation(); setMessage('Public forms are paused while editing.') } }
    const keydown = event => {
      if (isEditor(event.target) || preview) return
      if (['Enter', ' '].includes(event.key) && event.target.closest?.('[data-website-field]')) {
        event.preventDefault(); event.stopPropagation(); selectFrom(event.target)
      } else if (event.altKey && event.key === 'Enter') {
        const node = event.target.closest?.('[data-website-record]')
        if (node) { event.preventDefault(); selectManagedRecord({ module: node.dataset.websiteRecord, id: node.dataset.websiteRecordId, label: node.dataset.websiteRecordLabel }) }
      }
    }
    const over = event => {
      if (preview || isEditor(event.target)) return
      const node = event.target.closest?.('[data-website-field], [data-website-record]') || (!event.target.closest?.('a,button,input,select,textarea') && event.target.closest?.('[data-website-image-field]'))
      if (!node) { setHoverTarget(null); return }
      const rect = node.getBoundingClientRect()
      const key = node.dataset.websiteField || node.dataset.websiteImageField
      setHoverTarget(key
        ? { kind: 'field', key, keys:node.dataset.websiteFields?.split(' ').filter(Boolean)||[key], label: bindingsByKey.get(key)?.label, rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height } }
        : { kind: 'record', module: node.dataset.websiteRecord, id: node.dataset.websiteRecordId, label: node.dataset.websiteRecordLabel, rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height } })
    }
    const clearHover = () => setHoverTarget(null)
    document.addEventListener('click', click, true)
    document.addEventListener('auxclick', click, true)
    document.addEventListener('submit', submit, true)
    document.addEventListener('keydown', keydown, true)
    document.addEventListener('pointerover', over, true)
    window.addEventListener('scroll', clearHover, true)
    window.addEventListener('resize', clearHover)
    return () => {
      document.removeEventListener('click', click, true)
      document.removeEventListener('auxclick', click, true)
      document.removeEventListener('submit', submit, true)
      document.removeEventListener('keydown', keydown, true)
      document.removeEventListener('pointerover', over, true)
      window.removeEventListener('scroll', clearHover, true)
      window.removeEventListener('resize', clearHover)
    }
  }, [active, preview, path, router, requestExit, selectField, selectManagedRecord])

  const selectedBinding = bindingsByKey.get(selectedKey)
  const selectedField = selectedKey && catalog[selectedKey] ? { ...catalog[selectedKey], editorLabel: selectedBinding?.label, editorKind: selectedBinding?.kind } : null
  const value = selectedKey && Object.hasOwn(drafts, selectedKey) ? drafts[selectedKey].value : selectedField?.value
  const fields = CONTENT_BINDINGS.filter(binding => binding.routes.includes(path) && catalog[binding.key]?.editable).map(binding => ({ ...catalog[binding.key], editorLabel: binding.label, editorKind: binding.kind, sourceFile:binding.sourceFile }))
  const selectionFields = selectionKeys.map(key=>({key,label:bindingsByKey.get(key)?.label})).filter(field=>catalog[field.key]?.editable)
  const destinationConfirmed = Boolean(selectedKey && confirmationsRef.current[selectedKey]===value)
  const context = useMemo(() => ({
    active, preview, path, pageName: publicPage?.label || path, fields, selectedField, selectedRecord, value, dirtyCount, saving,
    message, error, fieldError, errorStatus, exitDestination, capabilitiesLoading, hoverTarget, published, drafts,
    selectionFields, history, historyLoading, destinationConfirmed,
    confirmDestination: confirmed => setConfirmedDestinations(previous=>({...previous,[selectedKey]:confirmed?value:null})),
    uploadSelectedImage, revertSelected, loadOlderHistory,
    startEditing, fieldProps, recordProps, selectField, selectManagedRecord, changeField, saveField, cancelField, closePanel,
    saveAll, discardAll, requestExit, finishExit, reloadSelected, retryCatalog: refreshCatalog,
    togglePreview: () => { setPreview(previous => !previous); setHoverTarget(null) },
    manageRecord: module => { if (MANAGED_MODULES[module]) requestExit(MANAGED_MODULES[module].path) },
    chooseManagedModule: module => selectManagedRecord({ module, id: null, label: MANAGED_MODULES[module]?.label }),
  }), [active, preview, path, publicPage?.label, fields, selectedField, selectedRecord, value, dirtyCount, saving, message, error, fieldError, errorStatus, exitDestination, capabilitiesLoading, hoverTarget, published, drafts, selectionFields, history, historyLoading, destinationConfirmed, uploadSelectedImage, revertSelected, loadOlderHistory, startEditing, fieldProps, recordProps, selectField, selectManagedRecord, changeField, saveField, cancelField, closePanel, saveAll, discardAll, requestExit, finishExit, reloadSelected, refreshCatalog])
  return <EditorContext.Provider value={context}>{children}{active && <WebsiteEditorUI />}</EditorContext.Provider>
}
