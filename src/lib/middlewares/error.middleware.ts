import { Request, Response, NextFunction } from 'express'
import { HttpError } from '../http/errors'
import { HTTP_STATUS } from '../http/status'

export const errorHandler = (
  err: HttpError,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err)
  }

  console.error(err.stack)

  const statusCode = err.statusCode || HTTP_STATUS.SERVER_ERROR

  res.status(statusCode)

  res.json({
    message: err.isOperational ? err.message : 'Something went wrong.',
  })
}
