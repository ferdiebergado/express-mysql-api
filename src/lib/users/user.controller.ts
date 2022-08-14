import { Request, Response, NextFunction } from 'express'
import { ResponsePayload } from '../http'
import userRepository from './user.repository'
import { auth, authErrors } from '../auth'

export default {
  getUser: async (
    req: Request<{ id: number }>,
    res: Response<ResponsePayload>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params

      const user = await userRepository.findUserById(Number(id))

      if (!user) throw new authErrors.UserNotFoundError()

      const transformed = auth.transformUser(user)

      const payload: ResponsePayload = {
        status: 'ok',
        message: 'User found',
        data: { user: transformed },
      }

      res.json(payload)
    } catch (error) {
      next(error)
    }
  },
}
