import express, { Request, Response } from 'express'
import authRoutes from './lib/auth/auth.router'

const router = express.Router()

const rootHandler = (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Server is up.',
  })
}

router.get('/', rootHandler)
router.use('/auth', authRoutes)

export default router
