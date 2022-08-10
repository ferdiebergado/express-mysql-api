import { Request, Response, NextFunction } from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import { ValidationError } from '../http/errors'

export const validate = <T>(validations: ValidationChain[]) => {
  return async (
    req: Request<{}, {}, T>,
    _res: Response,
    next: NextFunction
  ) => {
    await Promise.all(validations.map((validation) => validation.run(req)))

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return next(new ValidationError(errors.array()))
    }

    next()
  }
}
