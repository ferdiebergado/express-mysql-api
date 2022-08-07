import { Request, Response, NextFunction } from 'express'
import { NotFoundHttpError } from '../http/errors'

export const notFoundHandler = (
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  next(new NotFoundHttpError())
}
