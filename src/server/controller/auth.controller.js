import AuthModel from '../model/auth.model.js'
import bcrypt from 'bcrypt'
import { CatchError, TryError } from '../util/error.js'
import { normalizeAdminEmail, validateStrongPassword } from '../util/validation.mjs'
import { isAdmin, safeUser, issueTokens, setAuthCookies, clearAuthCookies, hashRefreshToken, readAccessUser, REFRESH_SECONDS } from '../config/auth.js'

export const login = async (req, res) => {
  try {
    let email
    try { email = normalizeAdminEmail(req.body?.email) }
    catch { throw TryError('Invalid email address', 400) }
    const password = req.body?.password
    if (typeof password !== 'string' || !password || password.length > 4096) throw TryError('Email and password are required', 400)
    const user = await AuthModel.findOne({ email }).select('+password')
    // Do comparable bcrypt work for unknown addresses to reduce account enumeration.
    const hash = user?.password || '$2b$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW'
    const valid = await bcrypt.compare(password, hash)
    if (!valid || !isAdmin(user)) throw TryError('Invalid credentials', 401)
    // A new login replaces the previous session, including its access tokens.
    user.sessionVersion = (user.sessionVersion || 0) + 1
    const tokens = issueTokens(user)
    const updated = await AuthModel.updateOne({ _id: user._id, sessionVersion: { $in: [user.sessionVersion - 1, null] } }, {
      $set: { refreshToken: hashRefreshToken(tokens.refreshToken), refreshTokenHistory: [], expiry: new Date(Date.now() + REFRESH_SECONDS * 1000), lastLogin: new Date(), sessionVersion: user.sessionVersion }
    })
    if (!updated.modifiedCount) throw TryError('Please retry login', 409)
    setAuthCookies(res, tokens)
    res.json({ message: 'Login success', user: safeUser(user) })
  } catch (err) { CatchError(err, res, 'Login failed') }
}

export const logout = async (req, res) => {
  try {
    const access = req.cookies.accessToken
    let user
    if (access) {
      try { user = await readAccessUser(access) }
      catch (err) { if (err.status !== 401) throw err }
    }
    const token = req.cookies.refreshToken
    const filter = user ? { _id: user._id } : token ? { refreshToken: { $in: [hashRefreshToken(token), token] } } : null
    if (filter) await AuthModel.updateOne(filter, { $set: { refreshToken: null, refreshTokenHistory: [], expiry: null }, $inc: { sessionVersion: 1 } })
    clearAuthCookies(res)
    res.json({ message: 'Logout success' })
  } catch (err) {
    clearAuthCookies(res)
    CatchError(err, res, 'Logout failed')
  }
}

export const getSession = async (req, res) => {
  try {
    if (!req.cookies.accessToken) throw TryError('Invalid session', 401)
    res.json(safeUser(await readAccessUser(req.cookies.accessToken)))
  } catch (err) { CatchError(err, res, 'Invalid session') }
}

export const refreshToken = async (req, res) => {
  try {
    if (!req.refreshUser) throw TryError('Failed to refresh token', 401)
    const user = req.refreshUser
    const tokens = issueTokens(user)
    // Compare-and-swap: only one request can consume a particular refresh token.
    const updated = await AuthModel.updateOne({ _id: user._id, refreshToken: req.refreshStoredToken, expiry: { $gt: new Date() }, isActive: true, sessionVersion: { $in: [user.sessionVersion || 0, null] } }, {
      $set: { refreshToken: hashRefreshToken(tokens.refreshToken), expiry: new Date(Date.now() + REFRESH_SECONDS * 1000) },
      $push: { refreshTokenHistory: { $each: [hashRefreshToken(req.cookies.refreshToken)], $slice: -64 } }
    })
    if (!updated.modifiedCount) throw TryError('Invalid refresh token', 401)
    setAuthCookies(res, tokens)
    res.json({ message: 'Token refreshed' })
  } catch (err) { CatchError(err, res, 'Failed to refresh token') }
}

export const changePassword = async (req, res) => {
  try {
    if (!req.session) throw TryError('Unauthorized', 401)
    const { oldPassword, newPassword } = req.body
    if (typeof oldPassword !== 'string' || !oldPassword || oldPassword.length > 4096) throw TryError('Both old and new passwords are required', 400)
    try { validateStrongPassword(newPassword) }
    catch (err) { throw TryError(err.message, 400) }
    const user = await AuthModel.findById(req.session.id).select('+password')
    if (!isAdmin(user)) throw TryError('Unauthorized', 401)
    if (!await bcrypt.compare(oldPassword, user.password)) throw TryError('Current password is incorrect', 401)
    const tokensUser = { _id: user._id, fullname: user.fullname, email: user.email, role: user.role, sessionVersion: (user.sessionVersion || 0) + 1 }
    const tokens = issueTokens(tokensUser)
    const password = await bcrypt.hash(newPassword, 12)
    const updated = await AuthModel.updateOne({ _id: user._id, password: user.password, sessionVersion: { $in: [user.sessionVersion || 0, null] } }, {
      $set: { password, sessionVersion: tokensUser.sessionVersion, refreshToken: hashRefreshToken(tokens.refreshToken), refreshTokenHistory: [], expiry: new Date(Date.now() + REFRESH_SECONDS * 1000) }
    })
    if (!updated.modifiedCount) throw TryError('Session changed; please log in again', 401)
    setAuthCookies(res, tokens)
    res.json({ message: 'Password changed successfully' })
  } catch (err) { CatchError(err, res, 'Failed to change password') }
}
