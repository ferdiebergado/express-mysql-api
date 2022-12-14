import argon from 'argon2'
import { authDto, authErrors } from '.'
import { JwtPayload, generateToken } from '../utils'
import { User, userRepository } from '../users'

export default {
  register: async (registerDto: authDto.RegisterDTO) => {
    const { email, password } = registerDto

    const exists = await userRepository.findUserByEmail(email)

    if (exists) throw new authErrors.UserAlreadyExistsError()

    return await userRepository.createUser(email, password)
  },

  login: async (loginDto: authDto.LoginDTO) => {
    const { email, password } = loginDto

    const user = await userRepository.findUserByEmail(email)

    if (!user) throw new authErrors.UserNotFoundError()

    const passwordsMatch = await argon.verify(user.password, password)

    if (!passwordsMatch) throw new authErrors.UserNotFoundError()

    const payload: JwtPayload = {
      id: user.id,
    }

    return generateToken(payload)
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
