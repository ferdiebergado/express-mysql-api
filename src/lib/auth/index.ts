import authController from './auth.controller'
import authRouter from './auth.router'
import * as authDto from './auth.dto'
import * as authErrors from './auth.errors'
import { authMessages } from './auth.messages'
import { authorize } from './auth.middleware'
// TODO: change auth
import auth from './auth'

export {
  authController,
  authRouter,
  authDto,
  authErrors,
  authMessages,
  authorize,
  auth,
}
