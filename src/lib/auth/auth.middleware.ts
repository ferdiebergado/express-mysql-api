import { Request, Response, NextFunction } from 'express'
import { UnauthorizedHttpError } from '../http/errors'
import { decodeToken } from '../utils/jwt'

export const verifyToken = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) throw new UnauthorizedHttpError()

    await decodeToken(token)

    // TODO: fix type of user id
    // req.user = sub

    next()
  } catch (error) {
    // TODO: return response type based on jwt error
    next(error)
  }
}
