import argon from 'argon2'
import { db } from '../db'
import { User } from './user.entity'

const userRepository = {
  findUserByEmail: async (email: string) => {
    const sqlFindUserByEmail = 'SELECT * FROM users WHERE email = ? LIMIT 1'

    const result = await db.query<User>(sqlFindUserByEmail, email)

    if (result.data.length === 0) return null

    const user = result.data[0]

    return user
  },

  findUserById: async (id: number) => {
    const sqlFindUserById = 'SELECT * FROM users WHERE id = ? LIMIT 1'

    const result = await db.query<User>(sqlFindUserById, id)

    if (result.data.length === 0) return null

    const user = result.data[0]

    return user
  },

  createUser: async (email: string, password: string) => {
    const sqlCreateUser = 'INSERT INTO users (email, password) VALUES (?, ?)'

    const hashed = await argon.hash(password)

    const result = await db.query(sqlCreateUser, email, hashed)

    return result.id
  },
}

export default userRepository
