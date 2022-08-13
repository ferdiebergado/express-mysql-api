import express, { NextFunction, Request, Response } from 'express'
import { authRouter } from './lib/auth'
import { db } from './lib/db'
import { ResponsePayload } from './lib/http'
import { userRouter } from './lib/users'

const router = express.Router()

const rootHandler = (_req: Request, res: Response<ResponsePayload>) => {
  const payload: ResponsePayload = {
    status: 'ok',
    message: 'Server is up.',
  }

  res.json(payload)
}

const healthHandler = async (
  _req: Request,
  res: Response<ResponsePayload>,
  next: NextFunction
) => {
  try {
    await db.query('SELECT 1')

    const payload: ResponsePayload = {
      status: 'ok',
      message: 'Healthy',
    }

    res.json(payload)
  } catch (error) {
    next(error)
  }
}

// TODO: Add versioned routes
router.get('/', rootHandler)
router.get('/health', healthHandler)
router.use('/auth', authRouter)
router.use('/users', userRouter)

export default router
