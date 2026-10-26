export const normalizeAdminEmail = (value) => {
  if (typeof value !== 'string') {
    throw new Error('Invalid email address')
  }

  const normalized = value.trim().toLowerCase()
  if (normalized.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    throw new Error('Invalid email address')
  }

  return normalized
}

export const requireServerEnv = (name, fallbackValue = undefined) => {
  const rawValue = typeof process.env[name] === 'string' ? process.env[name].trim() : ''

  if (!rawValue) {
    if (fallbackValue !== undefined) return fallbackValue
    throw new Error(`Missing required environment variable: ${name}`)
  }

  const sanitized = rawValue.toLowerCase()
  if ([
    'changeme',
    'change-me',
    'example',
    'replace-me',
    'your-secret-here',
    'test',
    'todo'
  ].includes(sanitized)) {
    throw new Error(`Invalid environment value for ${name}`)
  }

  return rawValue
}

const FILE_SIGNATURES = {
  'application/pdf': {
    label: 'PDF',
    signatures: [0x25, 0x50, 0x44, 0x46],
    extensions: ['.pdf']
  },
  'image/png': {
    label: 'PNG',
    signatures: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
    extensions: ['.png']
  },
  'image/jpeg': {
    label: 'JPEG',
    signatures: [0xff, 0xd8, 0xff],
    extensions: ['.jpg', '.jpeg']
  },
  'image/webp': {
    label: 'WebP',
    signatures: [0x52, 0x49, 0x46, 0x46, 0x57, 0x45, 0x42, 0x50],
    extensions: ['.webp']
  }
}

export const validateUploadBuffer = (buffer, mimeType, fileName, options = {}) => {
  if (!Buffer.isBuffer(buffer)) {
    throw new Error('Invalid file upload')
  }

  const maxSize = Number(options.maxSize ?? Number.MAX_SAFE_INTEGER)
  if (!Number.isFinite(maxSize)) {
    throw new Error('Invalid upload size limit')
  }

  if (buffer.length === 0) {
    throw new Error('Empty file upload')
  }

  if (buffer.length > maxSize) {
    throw new Error('File too large')
  }

  const normalizedMime = String(mimeType || '').toLowerCase()
  const config = FILE_SIGNATURES[normalizedMime]
  if (!config) {
    throw new Error(`Unsupported file type: ${normalizedMime || 'unknown'}`)
  }

  const lowerName = String(fileName || '').toLowerCase()
  if (lowerName && !config.extensions.some((extension) => lowerName.endsWith(extension))) {
    throw new Error(`Invalid ${config.label} file name`)
  }

  if (buffer.length < config.signatures.length) {
    throw new Error(`Invalid ${config.label} file upload`)
  }

  for (let index = 0; index < config.signatures.length; index += 1) {
    const offset = normalizedMime === 'image/webp' && index >= 4 ? index + 4 : index
    if (buffer[offset] !== config.signatures[index]) {
      throw new Error(`Invalid ${config.label} file upload`)
    }
  }

  return true
}

export const validateStrongPassword = value => {
  if (typeof value !== 'string' || value.length < 12 || Buffer.byteLength(value, 'utf8') > 72 || !/[a-z]/.test(value) || !/[A-Z]/.test(value) || !/\d/.test(value) || !/[^a-zA-Z0-9]/.test(value)) {
    throw new Error('Password must have at least 12 characters, uppercase, lowercase, a number and a symbol, and at most 72 UTF-8 bytes')
  }
  return value
}
