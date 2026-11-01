import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Share one refresh request when several API calls encounter an expired access
// token together. Retry each original request once without changing its payload.
let pendingRefresh
const recoverSession = async () => {
  if (!pendingRefresh) {
    pendingRefresh = axios.post(`${API_URL}/auth/refresh-token`, {}, { withCredentials: true }).finally(() => { pendingRefresh = null })
  }
  return pendingRefresh
}
api.interceptors.request.use(async config => {
  // Admin lists ask for all records. Check the session first so an expired
  // access cookie cannot silently turn the dashboard into a public-only list.
  if (config.params?.all === 'true') await api.get('/auth/session')
  return config
})
api.interceptors.response.use(response => response, async error => {
  const config = error.config
  if (error.response?.status === 401 && config && !config._sessionRetried && !/\/auth\/(login|logout|refresh-token|change-password)/.test(config.url)) {
    config._sessionRetried = true
    await recoverSession()
    return api(config)
  }
  throw error
})

const uploadRequest = async (url, options) => {
  let response = await fetch(url, options)
  if (response.status === 401) {
    await recoverSession()
    response = await fetch(url, options)
  }
  return response
}

// ==================== AUTH ====================
export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password })
  return data
}

export const logout = async () => {
  const { data } = await api.post('/auth/logout')
  return data
}

export const getSession = async () => {
  const { data } = await api.get('/auth/session')
  return data
}

export const refreshToken = async () => {
  const { data } = await recoverSession()
  return data
}

export const changePassword = async (oldPassword, newPassword) => {
  await getSession()
  const { data } = await api.put('/auth/change-password', { oldPassword, newPassword })
  return data
}

// ==================== CIRCULARS ====================
export const getCirculars = async (all = false) => {
  const params = all ? { params: { all: 'true' } } : {}
  const { data } = await api.get('/circulars', params)
  const circulars = Array.isArray(data) ? data : data?.circulars || data?.data
  return Array.isArray(circulars) ? circulars : []
}

export const getCircularById = async (id) => {
  const { data } = await api.get(`/circulars/${id}`)
  return data
}

export const createCircular = async (circularData) => {
  const { data } = await api.post('/circulars', circularData)
  return data
}

export const updateCircular = async (id, circularData) => {
  const { data } = await api.put(`/circulars/${id}`, circularData)
  return data
}

export const deleteCircular = async (id) => {
  const { data } = await api.delete(`/circulars/${id}`)
  return data
}

// ==================== STAFF ====================
export const getStaff = async (category = null, staffType = null, all = false) => {
  const params = {}
  if (category) params.category = category
  if (staffType) params.staffType = staffType
  if (all) params.all = 'true'
  
  const { data } = await api.get('/staff', { params })
  return data
}

export const getStaffById = async (id) => {
  const { data } = await api.get(`/staff/${id}`)
  return data
}

export const createStaff = async (staffData) => {
  const { data } = await api.post('/staff', staffData)
  return data
}

export const updateStaff = async (id, staffData) => {
  const { data } = await api.put(`/staff/${id}`, staffData)
  return data
}

export const deleteStaff = async (id) => {
  const { data } = await api.delete(`/staff/${id}`)
  return data
}

// ==================== GALLERY ====================
// Public gallery – returns paginated flat list of images
export const getGallery = async (page = 1, limit = 12, all = false) => {
  const params = {
    flat: 'true',
    page,
    limit,
    ...(all && { all: 'true' })
  }
  const { data } = await api.get('/gallery', { params })
  return data   // { data: [...images], pagination: { page, limit, total, totalPages } }
}

// For admin: get events (not flattened) – also paginated
export const getGalleryEvents = async (page = 1, limit = 12, all = false) => {
  const params = {
    page,
    limit,
    ...(all && { all: 'true' })
  }
  const { data } = await api.get('/gallery', { params })
  return data.data || []
}

export const getGalleryEventById = async (id) => {
  const { data } = await api.get(`/gallery/${id}`)
  return data
}

export const getGalleryEventBySlug = async (slug) => {
  const { data } = await api.get(`/gallery/slug/${slug}`)
  return data
}

export const createGalleryEvent = async (eventData) => {
  const { data } = await api.post('/gallery', eventData)
  return data
}

export const updateGalleryEvent = async (id, eventData) => {
  const { data } = await api.put(`/gallery/${id}`, eventData)
  return data
}

export const deleteGalleryEvent = async (id) => {
  const { data } = await api.delete(`/gallery/${id}`)
  return data
}

export const addImagesToEvent = async (eventId, images) => {
  const { data } = await api.post(`/gallery/${eventId}/images`, { images })
  return data
}

export const deleteImageFromEvent = async (eventId, imageId) => {
  const { data } = await api.delete(`/gallery/${eventId}/images/${imageId}`)
  return data
}

export const updateImageTitle = async (eventId, imageId, title) => {
  const { data } = await api.put(`/gallery/${eventId}/images/${imageId}`, { title })
  return data
}

// ==================== SYLLABUS ====================
export const getSyllabus = async (classNum = null, academicYear = null, stream = null, all = false) => {
  const params = {}
  if (classNum) params.class = classNum
  if (academicYear) params.academicYear = academicYear
  if (stream) params.stream = stream
  if (all) params.all = 'true'
  
  const { data } = await api.get('/syllabus', { params })
  return data
}

export const getSyllabusById = async (id) => {
  const { data } = await api.get(`/syllabus/${id}`)
  return data
}

export const getAcademicYears = async () => {
  const { data } = await api.get('/syllabus/academic-years')
  return data
}

export const getSyllabusClasses = async (academicYear = null) => {
  const params = academicYear ? { params: { academicYear } } : {}
  const { data } = await api.get('/syllabus/classes', params)
  return data
}

export const getSyllabusStreams = async (classNum = null) => {
  const params = classNum ? { params: { class: classNum } } : {}
  const { data } = await api.get('/syllabus/streams', params)
  return data
}

export const createSyllabus = async (syllabusData) => {
  const { data } = await api.post('/syllabus', syllabusData)
  return data
}

export const updateSyllabus = async (id, syllabusData) => {
  const { data } = await api.put(`/syllabus/${id}`, syllabusData)
  return data
}

export const deleteSyllabus = async (id) => {
  const { data } = await api.delete(`/syllabus/${id}`)
  return data
}

// ==================== DISCLOSURE ====================
export const getDisclosures = async (all = false) => {
  const records=[],seen=new Set()
  let before
  // The public component keeps its original array contract. Fetch bounded
  // cursor pages rather than silently dropping documents after the first page.
  for(let page=0;page<100;page++){
    const params={limit:100,...(all?{all:'true'}:{}),...(before?{before}:{})}
    const {data}=await api.get('/disclosure',{params})
    if(!Array.isArray(data?.disclosures))throw new Error('Invalid disclosure response')
    records.push(...data.disclosures)
    if(!data.nextBefore)return records
    if(typeof data.nextBefore!=='string'||seen.has(data.nextBefore))throw new Error('Invalid disclosure cursor')
    seen.add(data.nextBefore);before=data.nextBefore
  }
  throw new Error('Disclosure list exceeds the supported paging limit')
}
export const createDisclosure = async payload => (await api.post('/disclosure',payload)).data
export const updateDisclosure = async (id,payload) => (await api.put(`/disclosure/${encodeURIComponent(id)}`,payload)).data
export const deleteDisclosure = async (id,expectedVersion) => (await api.delete(`/disclosure/${encodeURIComponent(id)}`,{data:{expectedVersion}})).data

// ==================== UPLOAD ====================
export const uploadImage = async (file, folder = 'gallery') => {
  const formData = new FormData()
  formData.append('image', file)

  const response = await uploadRequest(`${API_URL}/upload/image?folder=${encodeURIComponent(folder)}`, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  })
  const data = await response.json()
  if (!response.ok) {
    const error = new Error(data.message || 'Image upload failed')
    error.response = { data, status: response.status }
    throw error
  }

  return data
}

export const uploadMultipleImages = async (files, folder = 'gallery') => {
  const formData = new FormData()
  files.forEach(file => {
    formData.append('images', file)
  })
  
  const response = await uploadRequest(`${API_URL}/upload/images?folder=${encodeURIComponent(folder)}`, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  })
  const data = await response.json()
  if (!response.ok) {
    const error = new Error(data.message || 'Image upload failed')
    error.response = { data, status: response.status }
    throw error
  }

  return data
}

export const uploadPDF = async (file, folder = 'syllabus') => {
  const formData = new FormData()
  formData.append('pdf', file)

  const response = await uploadRequest(`${API_URL}/upload/pdf?folder=${encodeURIComponent(folder)}`, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  })
  const data = await response.json()
  if (!response.ok) {
    const error = new Error(data.message || 'PDF upload failed')
    error.response = { data, status: response.status }
    throw error
  }

  return data
}

export const deleteFile = async (filePath) => {
  const { data } = await api.delete('/upload/file', { data: { filePath } })
  return data
}

// ==================== HELPER FUNCTIONS ====================
const normalizeLocalUploadUrl = (path) => {
  if (!path) return null

  if (/^https?:\/\//i.test(path)) {
    try {
      const url = new URL(path)
      if (url.pathname.startsWith('/api/uploads/')) {
        return `${url.pathname.slice('/api'.length)}${url.search}${url.hash}`
      }
      return null
    } catch {
      return null
    }
  }

  const normalizedPath = path.replace(/^\/?api(?=\/uploads(?:\/|$))/, '')
  if (normalizedPath.startsWith('/uploads/')) return normalizedPath
  if (normalizedPath.startsWith('uploads/')) return `/${normalizedPath}`
  return null
}

export const getImageUrl = (path) => {
  if (!path) return null
  const localUploadUrl = normalizeLocalUploadUrl(path)
  if (localUploadUrl) return localUploadUrl
  if (path.startsWith('http')) return path
  return `/uploads/${path.replace(/^\/+/, '')}`
}

export const getFileUrl = (path) => {
  if (!path) return null
  const localUploadUrl = normalizeLocalUploadUrl(path)
  if (localUploadUrl) return localUploadUrl
  if (path.startsWith('http')) return path
  return path.startsWith('/') ? path : `/${path}`
}

export const getFullImagePath = (path) => {
  if (!path) return null
  const localUploadUrl = normalizeLocalUploadUrl(path)
  if (localUploadUrl) return localUploadUrl
  if (path.startsWith('http')) return path
  return path.startsWith('/') ? path : `/uploads/${path}`
}

// ==================== WEBSITE CONTENT ====================
export const getWebsiteContent = async (path = '/') => {
  const { data } = await api.get('/website-content', { params: { path } })
  return data
}

export const getWebsiteContentCatalog = async (path = '/') => {
  const { data } = await api.get('/website-content/catalog', { params: { path } })
  return data
}

export const saveWebsiteContent = async (key, value, expectedRevision, contentType, { confirmDestination = false } = {}) => {
  const payload = { value, expectedRevision }
  if (contentType !== undefined) payload.contentType = contentType
  if (confirmDestination) payload.confirmDestination = true
  const { data } = await api.put(`/website-content/${encodeURIComponent(key)}`, payload)
  return data
}

export const getWebsiteContentHistory = async (key, { before, limit } = {}) => {
  const params = {}
  if (before !== undefined) params.before = before
  if (limit !== undefined) params.limit = limit
  const { data } = await api.get(`/website-content/history/${encodeURIComponent(key)}`, { params })
  return data
}

export const restoreWebsiteContent = async (key, revision, expectedRevision, { confirmDestination = false } = {}) => {
  const { data } = await api.post(`/website-content/${encodeURIComponent(key)}/restore`, { revision, expectedRevision, ...(confirmDestination ? { confirmDestination: true } : {}) })
  return data
}

export const resetWebsiteContent = async (key, expectedRevision, { confirmDestination = false } = {}) => {
  const { data } = await api.post(`/website-content/${encodeURIComponent(key)}/reset`, { expectedRevision, ...(confirmDestination ? { confirmDestination: true } : {}) })
  return data
}

export const uploadWebsiteImage = async (key, file) => {
  const body = new FormData()
  body.append('image', file)
  const response = await uploadRequest(`${API_URL}/website-content/images/${encodeURIComponent(key)}`, {method:'POST',body,credentials:'include'})
  const data = await response.json()
  if (!response.ok) { const error=new Error(data.message||'Image upload failed'); error.response={status:response.status,data}; throw error }
  return data
}

// ==================== DEFAULT EXPORT ====================
export default {
  // Auth
  login,
  logout,
  getSession,
  refreshToken,
  changePassword,
  
  // Circulars
  getCirculars,
  getCircularById,
  createCircular,
  updateCircular,
  deleteCircular,
  
  // Staff
  getStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  
  // Gallery
  getGallery,
  getGalleryEvents,
  getGalleryEventById,
  getGalleryEventBySlug,
  createGalleryEvent,
  updateGalleryEvent,
  deleteGalleryEvent,
  addImagesToEvent,
  deleteImageFromEvent,
  updateImageTitle,
  
  // Syllabus
  getSyllabus,
  getSyllabusById,
  getAcademicYears,
  getSyllabusClasses,
  getSyllabusStreams,
  createSyllabus,
  updateSyllabus,
  deleteSyllabus,

  // Disclosure
  getDisclosures,
  createDisclosure,
  updateDisclosure,
  deleteDisclosure,
  
  
  // Upload
  uploadImage,
  uploadMultipleImages,
  uploadPDF,
  deleteFile,
  
  // Website content
  getWebsiteContent,
  getWebsiteContentCatalog,
  saveWebsiteContent,
  getWebsiteContentHistory,
  restoreWebsiteContent,
  resetWebsiteContent,
  uploadWebsiteImage,

  // Helpers
  getImageUrl,
  getFileUrl,
  getFullImagePath
}
