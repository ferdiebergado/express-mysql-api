import express, { Request, Response } from 'express'
import { authRouter } from './lib/auth'
import { ResponsePayload } from './lib/http'

const router = express.Router()

const rootHandler = (_req: Request, res: Response<ResponsePayload>) => {
  const payload: ResponsePayload = {
    status: 'ok',
    message: 'Server is up.',
  }

  res.json(payload)
}

router.get('/', rootHandler)
router.use('/auth', authRouter)

export default router
