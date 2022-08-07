import express, { Request } from 'express'
import { CustomValidator, body } from 'express-validator'
import { validate } from '../middlewares'
import authController from './auth.controller'

const router = express.Router()

const passwordsMatch: CustomValidator = (passwordConfirmation, { req }) => {
  if (passwordConfirmation !== req.body.password)
    throw new Error('Passwords do not match')

  return true
}

router.post(
  '/register',
  validate([
    body('email').notEmpty().isEmail().normalizeEmail(),
    body('password').notEmpty().trim().escape(),
    body('password_confirmation')
      .notEmpty()
      .trim()
      .escape()
      .custom(passwordsMatch),
  ]),
  authController.register
)
router.post('/login', authController.login)

export default router
