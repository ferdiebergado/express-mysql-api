import jwt from 'jsonwebtoken'
import config from '../../config'

const { algorithm, secret, expiresIn } = config.jwt

export const generateToken = (
  payload: Record<string, any>
): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, { algorithm, expiresIn }, (err, token) => {
      if (err) reject(err)

      if (token) resolve(token)
    })
  })
}

export const decodeToken = (token: string): Promise<jwt.JwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      // TODO: respond with appropriate type based on error
      if (err) reject(err)

      // TODO: resolve as jwtPayload or custom jwt interface
      if (decoded) resolve(decoded as jwt.JwtPayload)
    })
  })
}
