import { Request, Response, NextFunction } from 'express'
import { UnauthorizedHttpError } from '../http/errors'
import { verifyToken } from '../utils/jwt'

export const decodeToken = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) throw new UnauthorizedHttpError()

    await verifyToken(token)

    next()
  } catch (error) {
    next(error)
  }
}
