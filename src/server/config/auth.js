import { createHash, randomBytes } from 'node:crypto'
import jwt from 'jsonwebtoken'
import AuthModel from '../model/auth.model.js'
import { TryError } from '../util/error.js'
import { requireServerEnv } from '../util/validation.mjs'

export const ACCESS_SECONDS = 15 * 60
export const REFRESH_SECONDS = 7 * 24 * 60 * 60
export const isAdmin = user => Boolean(user?.isActive && ['admin', 'super-admin'].includes(user.role))
export const safeUser = user => ({ id: user._id.toString(), fullname: user.fullname, email: user.email, role: user.role, isActive: Boolean(user.isActive) })
export const sessionUser = user => ({ id: user._id.toString(), fullname: user.fullname, email: user.email, role: user.role, version: user.sessionVersion || 0 })
export const hashRefreshToken = token => `sha256:${createHash('sha256').update(token).digest('hex')}`
export const jwtSecret = () => {
  const secret = requireServerEnv('JWT_SECRET')
  if (Buffer.byteLength(secret) < 32 || /replace[_ -]|your[_ -].*secret/i.test(secret)) throw new Error('JWT_SECRET must contain at least 32 bytes of private random data')
  return secret
}
export const cookieOptions = maxAge => ({ httpOnly: true, maxAge, secure: process.env.NODE_ENV === 'production' || process.env.COOKIE_SECURE === 'true', sameSite: 'lax', path: '/' })
export const issueTokens = user => ({
  accessToken: jwt.sign(sessionUser(user), jwtSecret(), { algorithm: 'HS256', expiresIn: ACCESS_SECONDS }),
  refreshToken: randomBytes(32).toString('base64url'),
})
export const setAuthCookies = (res, tokens) => {
  res.cookie('accessToken', tokens.accessToken, cookieOptions(ACCESS_SECONDS * 1000))
  res.cookie('refreshToken', tokens.refreshToken, cookieOptions(REFRESH_SECONDS * 1000))
}
export const clearAuthCookies = res => {
  res.clearCookie('accessToken', cookieOptions(0))
  res.clearCookie('refreshToken', cookieOptions(0))
}
export async function readAccessUser(token) {
  const secret = jwtSecret()
  let payload
  try { payload = jwt.verify(token, secret, { algorithms: ['HS256'] }) }
  catch { throw TryError('Invalid session', 401) }
  if (typeof payload.id !== 'string' || !/^[a-f\d]{24}$/i.test(payload.id)) throw TryError('Invalid session', 401)
  const user = await AuthModel.findById(payload.id)
  if (!isAdmin(user) || (payload.version ?? 0) !== (user.sessionVersion || 0)) throw TryError('Invalid session', 401)
  return user
}
