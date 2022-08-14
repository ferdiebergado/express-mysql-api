import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import config from '../../config'
import { authErrors } from '../auth'

// standard claims https://datatracker.ietf.org/doc/html/rfc7519#section-4.1
export interface JwtPayload {
  [key: string]: any
  iss?: string | undefined
  sub?: string | undefined
  aud?: string | string[] | undefined
  exp?: number | undefined
  nbf?: number | undefined
  iat?: number | undefined
  jti?: string | undefined
}

const { algorithm } = config.jwt

const readKeyFile = (keyFile: string) => {
  return fs.readFileSync(path.join(__dirname, '../../../', keyFile))
}

export const generateToken = (payload: JwtPayload, moveBackMs = 0) => {
  const { privateKey, expiresIn } = config.jwt

  const iat = Math.floor(Date.now() / 1000) - moveBackMs

  return jwt.sign({ ...payload, iat }, readKeyFile(privateKey), {
    algorithm,
    expiresIn,
  })
}

export const verifyToken = (token: string) => {
  const { publicKey } = config.jwt

  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      readKeyFile(publicKey),
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
