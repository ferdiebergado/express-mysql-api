import express from 'express'
import { authorize } from '../auth'
import userController from './user.controller'

const userRouter = express.Router()

userRouter.all('/*', authorize)
userRouter.get('/:id', userController.getUser)

export default userRouter
