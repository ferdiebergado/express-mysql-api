import express from 'express'
import { decodeToken } from '../auth/auth.middleware'
import userController from './user.controller'

export const userRouter = express.Router()

userRouter.all('/*', decodeToken)
userRouter.get('/:id', userController.getUser)
