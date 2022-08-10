import argon from 'argon2'
import { UserAlreadyExistsError, UserNotFoundError } from './auth.errors'
import { generateToken } from '../utils/jwt'
import userRepository from '../users/user.repository'
import type { LoginDTO, RegisterDTO } from './auth.dto'

export default {
  register: async (registerDto: RegisterDTO) => {
    const { email, password } = registerDto

    const exists = await userRepository.findUserByEmail(email)

    if (exists) throw new UserAlreadyExistsError(email)

    const id = await userRepository.createUser(email, password)

    return id
  },

  login: async (loginDto: LoginDTO) => {
    const { email, password } = loginDto

    const user = await userRepository.findUserByEmail(email)

    if (!user) throw new UserNotFoundError()

    const passwordsMatch = await argon.verify(user.password, password)

    if (!passwordsMatch) throw new UserNotFoundError()

    const token = await generateToken({ sub: user.id })

    return token
  },

  // TODO
  // forgotPassword: async (email: string) => {},

  // TODO
  // resetPassword: async (currentPassword: string, newPassword: string) => {},
}