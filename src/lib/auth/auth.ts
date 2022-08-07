import argon from 'argon2'
import { UserAlreadyExistsError, UserNotFoundError } from './auth.errors'
import { generateToken } from '../utils/jwt'
import userRepository from '../users/user.repository'

export default {
  register: async (email: string, password: string) => {
    const exists = await userRepository.findUserByEmail(email)

    if (exists) throw new UserAlreadyExistsError(email)

    const id = await userRepository.createUser(email, password)

    return id
  },

  login: async (email: string, password: string) => {
    const user = await userRepository.findUserByEmail(email)

    if (!user) throw new UserNotFoundError()

    const passwordsMatch = await argon.verify(user.password, password)

    if (!passwordsMatch) throw new UserNotFoundError()

    const token = await generateToken({ sub: user.id })

    return { token }
  },

  // TODO
  // forgotPassword: async (email: string) => {},

  // TODO
  // resetPassword: async (currentPassword: string, newPassword: string) => {},
}
