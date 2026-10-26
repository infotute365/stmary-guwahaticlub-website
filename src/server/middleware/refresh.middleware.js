import AuthModel from '../model/auth.model.js'
import { isAdmin, hashRefreshToken, sessionUser } from '../config/auth.js'
import { CatchError, TryError } from '../util/error.js'

export default async function RefreshMiddleware(req, res, next) {
  try {
    const token = req.cookies.refreshToken
    if (typeof token !== 'string' || !/^[A-Za-z0-9_-]{32,128}$/.test(token)) throw TryError('Invalid refresh token', 401)
    const hash = hashRefreshToken(token)
    // Existing UUID refresh sessions migrate to a hash on their first rotation.
    // Their existing expiry still applies; new sessions never store plaintext.
    const legacy = /^[a-f\d-]{36}$/i.test(token) ? token : hash
    const user = await AuthModel.findOne({ $or: [{ refreshToken: { $in: [hash, legacy] } }, { refreshTokenHistory: hash }] }).select('+refreshToken')
    if (!isAdmin(user) || !user.expiry || new Date(user.expiry) <= new Date()) throw TryError('Invalid refresh token', 401)
    if (![hash, legacy].includes(user.refreshToken)) {
      await AuthModel.updateOne({ _id: user._id, refreshToken: user.refreshToken }, { $set: { refreshToken: null, expiry: null, refreshTokenHistory: [] }, $inc: { sessionVersion: 1 } })
      throw TryError('Invalid refresh token', 401)
    }
    req.session = sessionUser(user)
    req.refreshUser = user
    req.refreshStoredToken = user.refreshToken
    next()
  } catch (err) { CatchError(err, res, 'Failed to refresh session') }
}
