import { NextFunction, Request, Response } from 'express'
import { StatusCode, ResponsePayload } from '../http'
import { authDto, auth, authMessages } from '.'

const authController = {
  register: async (
    req: Request<
      {
        [key: string]: string
      },
      any,
      authDto.RegisterDTO
    >,
    res: Response<ResponsePayload>,
    next: NextFunction
  ) => {
    try {
      const { email, password, passwordConfirmation } = req.body

      const id = await auth.register({ email, password, passwordConfirmation })

      const payload: ResponsePayload = {
        status: 'ok',
        message: authMessages.REGISTRATION_SUCCESS,
        data: { id },
      }

      res.status(StatusCode.CREATED).json(payload)
    } catch (error) {
      next(error)
    }
  },

  login: async (
    req: Request<
      {
        [key: string]: string
      },
      any,
      authDto.LoginDTO
    >,
    res: Response<ResponsePayload>,
    next: NextFunction
  ) => {
    try {
      const { email, password } = req.body

      const token = await auth.login({ email, password })

      const payload: ResponsePayload = {
        status: 'ok',
        message: authMessages.LOGIN_SUCCESS,
        data: { token },
      }

      res.json(payload)
    } catch (error) {
      next(error)
    }
  },
}

export default authController
