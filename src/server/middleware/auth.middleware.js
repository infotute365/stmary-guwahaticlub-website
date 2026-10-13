import jwt from 'jsonwebtoken'
import AuthModel from '../model/auth.model.js'
import { CatchError, TryError } from '../util/error.js'
import { requireServerEnv } from '../util/validation.mjs'

const AuthMiddleware = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken
        if (!accessToken) {
            throw TryError('Unauthorized access', 401)
        }

        let payload
        try {
            payload = jwt.verify(accessToken, requireServerEnv('AUTH_SECRET'))
        } catch {
            throw TryError('Unauthorized access', 401)
        }

        const user = await AuthModel.findById(payload.id)

        if (!user || !user.isActive) {
            throw TryError('Unauthorized access', 401)
        }

        req.session = {
            id: user._id.toString(),
            fullname: user.fullname,
            email: user.email,
            role: user.role
        }

        next()
    }
    catch (err) {
        CatchError(err, res, 'Authentication failed')
    }
}

export default AuthMiddleware
