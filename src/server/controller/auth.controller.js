import AuthModel from '../model/auth.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v4 as uuid } from 'uuid'
import moment from 'moment'
import { CatchError, TryError } from '../util/error.js'
import { normalizeAdminEmail, requireServerEnv } from '../util/validation.mjs'

const accessTokenExpiry = '15m'
const refreshTokenExpiry = '7d'

const generateToken = (payload) => {
    const accessToken = jwt.sign(payload, requireServerEnv('AUTH_SECRET'), { expiresIn: accessTokenExpiry })
    const refreshToken = uuid()
    return { accessToken, refreshToken }
}

const getOptions = () => ({
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production' || process.env.COOKIE_SECURE === 'true',
    sameSite: 'lax',
    path: '/'
})

const safeUser = (user) => ({
    id: user._id.toString(),
    fullname: user.fullname,
    email: user.email,
    role: user.role,
    isActive: Boolean(user.isActive)
})

export const login = async (req, res) => {
  try {
    let email
    try {
      email = normalizeAdminEmail(req.body?.email)
    } catch {
      throw TryError('Invalid email address', 400)
    }

    const password = typeof req.body?.password === 'string' ? req.body.password : ''

    if (!email || !password) {
      throw TryError('Email and password are required', 400)
    }

    const user = await AuthModel.findOne({ email }).select('+password')

    if (!user) {
      throw TryError('Invalid credentials', 401)
    }

    if (!user.isActive) {
      throw TryError('Account is disabled', 401)
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      throw TryError('Invalid credentials', 401)
    }

    const payload = {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      role: user.role
    }

    const { accessToken, refreshToken } = generateToken(payload)

    await AuthModel.updateOne(
      { _id: user._id },
      {
        $set: {
          refreshToken,
          expiry: moment().add(7, 'days').toDate(),
          lastLogin: new Date()
        }
      }
    )

    res.cookie('accessToken', accessToken, getOptions())
    res.cookie('refreshToken', refreshToken, getOptions())

    res.json({
      message: 'Login success',
      user: safeUser(user)
    })
  } catch (err) {
    CatchError(err, res, 'Login failed')
  }
}

export const logout = async (req, res) => {
  const options = getOptions()
  try {
    if (req.session?.id) {
      await AuthModel.updateOne(
        { _id: req.session.id },
        { $set: { refreshToken: null, expiry: null } }
      )
    }

    res.clearCookie('accessToken', options)
    res.clearCookie('refreshToken', options)
    res.json({ message: 'Logout success' })
  } catch (err) {
    res.clearCookie('accessToken', options)
    res.clearCookie('refreshToken', options)
    res.json({ message: 'Logout success' })
  }
}

export const getSession = async (req, res) => {
    try {
        const accessToken = req.cookies.accessToken

        if (!accessToken) {
            throw TryError('Invalid session', 401)
        }

            let payload
        try {
            payload = jwt.verify(accessToken, requireServerEnv('AUTH_SECRET'))
        } catch {
            throw TryError('Invalid session', 401)
        }

        const user = await AuthModel.findById(payload.id)

        if (!user || !user.isActive) {
            throw TryError('Invalid session', 401)
        }

        res.json(safeUser(user))
    }
    catch (err) {
        CatchError(err, res, 'Invalid session')
    }
}

export const refreshToken = async (req, res) => {
    try {
        if (!req.session) {
            throw TryError('Failed to refresh token', 401)
        }

        const { accessToken, refreshToken } = generateToken(req.session)

        await AuthModel.updateOne(
            { _id: req.session.id },
            {
                $set: {
                    refreshToken,
                    expiry: moment().add(7, 'days').toDate()
                }
            }
        )

        res.cookie('accessToken', accessToken, getOptions())
        res.cookie('refreshToken', refreshToken, getOptions())
        res.json({ message: 'Token refreshed' })
    }
    catch (err) {
        CatchError(err, res, 'Failed to refresh token')
    }
}

export const changePassword = async (req, res) => {
    try {
        if (!req.session) {
            throw TryError('Unauthorized', 401)
        }

        const { oldPassword, newPassword } = req.body

        if (!oldPassword || !newPassword) {
            throw TryError('Both old and new passwords are required', 400)
        }

        if (newPassword.length < 6) {
            throw TryError('New password must be at least 6 characters', 400)
        }

        const user = await AuthModel.findById(req.session.id).select('+password')
        if (!user || !user.isActive) {
            throw TryError('Unauthorized', 401)
        }

        const isValid = await bcrypt.compare(oldPassword, user.password)
        if (!isValid) {
            throw TryError('Current password is incorrect', 401)
        }

        user.password = newPassword
        await user.save()

        res.json({ message: 'Password changed successfully' })
    }
    catch (err) {
        CatchError(err, res, 'Failed to change password')
    }
}