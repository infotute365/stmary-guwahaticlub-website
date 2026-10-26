import { readAccessUser, sessionUser } from '../config/auth.js'
import { CatchError, TryError } from '../util/error.js'

export default async function AuthMiddleware(req, res, next) {
  try {
    if (!req.cookies.accessToken) throw TryError('Unauthorized access', 401)
    req.session = sessionUser(await readAccessUser(req.cookies.accessToken))
    next()
  } catch (err) { CatchError(err, res, 'Authentication failed') }
}
