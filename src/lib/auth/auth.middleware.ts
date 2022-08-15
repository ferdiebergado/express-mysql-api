import { Request, Response, NextFunction } from 'express'
import { UnauthorizedHttpError } from '../http/errors'
import { verifyToken } from '../utils/jwt'

// TODO: Add access types
export const authorize = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) throw new UnauthorizedHttpError()

    const user = await verifyToken(token)

    res.locals.user = user

    next()
  } catch (error) {
    next(error)
  }
}
