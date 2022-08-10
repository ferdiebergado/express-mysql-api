import { NextFunction, Request, Response } from 'express'
import { ResponsePayload } from '../http/response.interface'
import { HTTP_STATUS } from '../http/status'
import auth from './auth'
import { LoginDTO, RegisterDTO } from './auth.dto'

const authController = {
  register: async (
    req: Request<{}, {}, RegisterDTO>,
    res: Response<ResponsePayload>,
    next: NextFunction
  ) => {
    try {
      const { email, password, passwordConfirmation } = req.body

      const id = await auth.register({ email, password, passwordConfirmation })

      const payload: ResponsePayload = {
        status: 'ok',
        message: 'User registered',
        data: { id },
      }

      res.status(HTTP_STATUS.CREATED).json(payload)
    } catch (error) {
      next(error)
    }
  },

  login: async (
    req: Request<{}, {}, LoginDTO>,
    res: Response<ResponsePayload>,
    next: NextFunction
  ) => {
    try {
      const { email, password } = req.body

      const token = await auth.login({ email, password })

      const payload: ResponsePayload = {
        status: 'ok',
        message: 'Logged in',
        data: { token },
      }

      res.json(payload)
    } catch (error) {
      next(error)
    }
  },
}

export default authController
