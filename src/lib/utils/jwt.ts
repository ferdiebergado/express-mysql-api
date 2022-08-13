import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import config from '../../config'
import { authErrors } from '../auth'
import { UserSession } from '../users'

const { algorithm } = config.jwt

export const generateToken = (payload: UserSession, backtime = 0) => {
  const { expiresIn } = config.jwt

  const privateKey = fs.readFileSync(
    path.join(__dirname, '../../../private.pem')
  )

  const iat = Math.floor(Date.now() / 1000) - backtime

  return jwt.sign({ ...payload, iat }, privateKey, { algorithm, expiresIn })
}

export const verifyToken = (token: string) => {
  const publicKey = fs.readFileSync(path.join(__dirname, '../../../public.pem'))

  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      publicKey,
      { algorithms: [algorithm] },
      (err, decoded) => {
        if (err) {
          const jwtErrors = [
            'TokenExpiredError',
            'JsonWebTokenError',
            'NotBeforeError',
          ]

          if (jwtErrors.includes(err.name))
            return reject(new authErrors.InvalidTokenError(err.message))

          return reject(err)
        }

        resolve(decoded)
      }
    )
  })
}
