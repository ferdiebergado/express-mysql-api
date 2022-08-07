import { HTTP_STATUS } from './status'

export class HttpError extends Error {
  statusCode: number
  isOperational: boolean

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}

export class BadRequestHttpError extends HttpError {
  constructor(message: string) {
    super(HTTP_STATUS.BAD_REQUEST, message)
  }
}

export class UnprocessableEntityHttpError extends HttpError {
  constructor(message: string) {
    super(HTTP_STATUS.UNPROCESSABLE_ENTITY, message)
  }
}

export class NotFoundHttpError extends HttpError {
  constructor(message = 'Not found') {
    super(HTTP_STATUS.NOT_FOUND, message)
  }
}

export class UnauthorizedHttpError extends HttpError {
  constructor(message = 'Unauthorized') {
    super(HTTP_STATUS.UNAUTHORIZED, message)
  }
}
