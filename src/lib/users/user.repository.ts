import { ResultSetHeader } from 'mysql2'
import argon from 'argon2'
import { query } from '../../db'
import { User } from './user'

const userRepository = {
  findUserByEmail: async (email: string) => {
    const sqlFindUserByEmail =
      'SELECT id, email, password FROM users WHERE email = ? LIMIT 1'

    const users = (await query(sqlFindUserByEmail, [email])) as User[]

    if (users.length === 0) return null

    return users[0]
  },

  findUserById: async (id: number) => {
    const sqlFindUserById = 'SELECT id, email FROM users WHERE id = ? LIMIT 1'

    const users = (await query(sqlFindUserById, [id])) as User[]

    if (users.length === 0) return null

    return users[0]
  },

  createUser: async (email: string, password: string) => {
    const sqlCreateUser = 'INSERT INTO users (email, password) VALUES (?, ?)'

    const hashed = await argon.hash(password)

    const row = (await query(sqlCreateUser, [email, hashed])) as ResultSetHeader

    return row.insertId
  },
}

export default userRepository
