import jwt from 'jsonwebtoken'
import config from '../../config'

const { secret, expiresIn } = config.jwt

export const generateToken = (
  payload: Record<string, any>
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // TODO: Specify algorithm in options
    jwt.sign(payload, secret, { expiresIn }, (err, token) => {
      if (err) reject(err)

      if (token) resolve(token)
    })
  })
}

export const decodeToken = (token: string): Promise<jwt.JwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) reject(err)

      // TODO: resolve as jwtPayload or custom jwt interface
      if (decoded) resolve(decoded as jwt.JwtPayload)
    })
  })
}
