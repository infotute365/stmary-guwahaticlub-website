export function removeDraft(drafts, key) {
  const next = { ...drafts }
  delete next[key]
  return next
}

export function updateDraft(drafts, key, value, savedValue, expectedRevision) {
  if (Object.is(value, savedValue)) return removeDraft(drafts, key)
  return { ...drafts, [key]: { value, expectedRevision: drafts[key]?.expectedRevision ?? expectedRevision } }
}

export function editorErrorMessage(error) {
  const status = error?.response?.status
  if (status === 409) return 'This field changed in another session. Your draft is kept. Reload the saved value before editing again.'
  if (status === 401) return 'Your administrator session is no longer available. Sign in again to edit the website.'
  if (status === 403) return 'Access to this edit is not allowed. Reload your administrator session before trying again.'
  if (status === 413) return 'This content is too long. Shorten it and try again.'
  if (status >= 500) return 'The server could not complete this request. Reload the saved content before trying again.'
  const detail = error?.response?.data?.message
  return typeof detail === 'string' && detail.length < 800 ? detail : 'Could not reach the server. Your draft is kept; check your connection and try again.'
}

export function blocksExternalNavigation(href, origin) {
  try {
    const url = new URL(href, origin)
    return !['http:', 'https:'].includes(url.protocol) || url.origin !== new URL(origin).origin
  } catch { return true }
}
