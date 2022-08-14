import { httpErrors } from '../http'
import { authMessages } from '.'

export class UserAlreadyExistsError extends httpErrors.UnprocessableEntityHttpError {
  constructor() {
    super(authMessages.USER_EXISTS)
  }
}

export class UserNotFoundError extends httpErrors.NotFoundHttpError {
  constructor() {
    super(authMessages.USER_NOTFOUND)
  }
}

export class InvalidTokenError extends httpErrors.UnauthorizedHttpError {
  constructor(message: string) {
    super(message)
  }
}
