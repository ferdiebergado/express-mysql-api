import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import config from '../../config'
import { errors } from '../http'
import { UserSession } from '../users/user'

const { algorithm, expiresIn } = config.jwt

export const generateToken = (payload: UserSession) => {
  const privateKey = fs.readFileSync(
    path.join(__dirname, '../../../private.key')
  )

  return jwt.sign(payload, privateKey, { algorithm, expiresIn })
}

export const verifyToken = (token: string) => {
  const publicKey = fs.readFileSync(
    path.join(__dirname, '../../../private.key')
  )

  return new Promise((resolve, reject) => {
    jwt.verify(token, publicKey, (err, decoded) => {
      if (err) return reject(new errors.InvalidTokenError(err.message))

      resolve(decoded)
    })
  })
}
