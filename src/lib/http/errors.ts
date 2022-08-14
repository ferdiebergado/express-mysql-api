import { StatusCode, StatusPhrase, Message } from '.'

export class HttpError extends Error {
  statusCode: number
  isOperational: boolean

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    Error.captureStackTrace(this, HttpError)
  }
}

export class BadRequestHttpError extends HttpError {
  constructor(message: string = StatusPhrase.BAD_REQUEST) {
    super(StatusCode.BAD_REQUEST, message)
  }
}

export class UnprocessableEntityHttpError extends HttpError {
  constructor(message: string = StatusPhrase.UNPROCESSABLE_ENTITY) {
    super(StatusCode.UNPROCESSABLE_ENTITY, message)
  }
}

export class NotFoundHttpError extends HttpError {
  constructor(message: string = StatusPhrase.NOT_FOUND) {
    super(StatusCode.NOT_FOUND, message)
  }
}

export class UnauthorizedHttpError extends HttpError {
  constructor(message: string = StatusPhrase.UNAUTHORIZED) {
    super(StatusCode.UNAUTHORIZED, message)
  }
}

export class ValidationError extends UnprocessableEntityHttpError {
  errors: any

  constructor(errors: any) {
    super(Message.INVALID_INPUT)
    this.errors = errors
  }
}
