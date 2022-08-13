import { httpErrors } from '../http'

export class UserAlreadyExistsError extends httpErrors.BadRequestHttpError {
  constructor(email: string) {
    super(`User with email: ${email} already exists.`)
  }
}

export class UserNotFoundError extends httpErrors.NotFoundHttpError {
  constructor() {
    super('User not found.')
  }
}

export class InvalidTokenError extends httpErrors.UnauthorizedHttpError {
  constructor(message: string) {
    super(message)
  }
}
