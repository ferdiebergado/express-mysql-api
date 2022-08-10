import authController from './auth.controller'
import * as authDto from './auth.dto'
import * as authErrors from './auth.errors'
import { authMessages } from './auth.messages'
import { verifyToken } from './auth.middleware'
// TODO: change auth
import auth from './auth'

export { authController, authDto, authErrors, authMessages, verifyToken, auth }
