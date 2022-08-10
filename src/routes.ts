import express, { Request, Response } from 'express'
import authRoutes from './lib/auth/auth.router'
import { ResponsePayload } from './lib/http/response.interface'

const router = express.Router()

const rootHandler = (_req: Request, res: Response) => {
  const payload: ResponsePayload = {
    status: 'ok',
    message: 'Server is up.',
  }

  res.json(payload)
}

router.get('/', rootHandler)
router.use('/auth', authRoutes)

export default router
