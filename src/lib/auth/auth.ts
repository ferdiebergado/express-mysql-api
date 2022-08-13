import argon from 'argon2'
import { authErrors } from '.'
import { generateToken } from '../utils/jwt'
import { authDto } from '.'
import { User, UserSession, userRepository } from '../users'

export default {
  register: async (registerDto: authDto.RegisterDTO) => {
    const { email, password } = registerDto

    const exists = await userRepository.findUserByEmail(email)

    if (exists) throw new authErrors.UserAlreadyExistsError(email)

    const id = await userRepository.createUser(email, password)

    return id
  },

  login: async (loginDto: authDto.LoginDTO) => {
    const { email, password } = loginDto

    const user = await userRepository.findUserByEmail(email)

    if (!user) throw new authErrors.UserNotFoundError()

    const passwordsMatch = await argon.verify(user.password, password)

    if (!passwordsMatch) throw new authErrors.UserNotFoundError()

    const payload: UserSession = {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    }

    const token = generateToken(payload)

    return token
  },

  transformUser: (user: User) => {
    const { password, ...transformed } = user
    return transformed
  },

  // TODO
  // forgotPassword: async (email: string) => {},

  // TODO
  // resetPassword: async (currentPassword: string, newPassword: string) => {},
}
