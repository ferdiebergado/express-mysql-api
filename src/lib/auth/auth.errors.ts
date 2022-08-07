import { BadRequestHttpError, NotFoundHttpError } from '../http/errors'

export class UserAlreadyExistsError extends BadRequestHttpError {
  constructor(email: string) {
    super(`User with email: ${email} already exists.`)
  }
}

export class UserNotFoundError extends NotFoundHttpError {
  constructor() {
    super('User not found.')
  }
}
