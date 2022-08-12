import express from 'express'
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
    body('passwordConfirmation').custom(passwordsMatch).trim().escape(),
  ]),
  authController.register
)

router.post(
  '/login',
  validate([
    body('email').notEmpty().isEmail().normalizeEmail(),
    body('password').notEmpty().trim().escape(),
  ]),
  authController.login
)

export default router
