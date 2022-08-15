import { Request, Response, NextFunction } from 'express'
import { httpErrors } from '../http'
import { verifyToken } from '../utils'

// TODO: Add access types
export const authorize = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) throw new httpErrors.UnauthorizedHttpError()

    const user = await verifyToken(token)

    req.user = user.id

    next()
  } catch (error) {
    next(error)
  }
}
