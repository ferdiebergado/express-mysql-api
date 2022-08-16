import { Request, Response, NextFunction } from 'express'
import { httpErrors, ResponsePayload, StatusCode } from '../http'

export const errorHandler = (
  err: httpErrors.HttpError,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err)
  }

  console.error(err.stack)

  const statusCode = err.statusCode || StatusCode.INTERNAL_SERVER_ERROR

  res.status(statusCode)

  const payload: ResponsePayload = {
    status: 'failed',
    message: err.isOperational ? err.message : 'Something went wrong.',
  }

  if (err instanceof httpErrors.ValidationError) payload.errors = err.errors

  res.json(payload)
}
