import argon from 'argon2'
import { ResultSetHeader } from 'mysql2'
import { db } from '../db'
import { User } from './user.entity'

const userRepository = {
  findUserByEmail: async (email: string) => {
    const sqlFindUserByEmail =
      'SELECT * FROM users WHERE email = :email LIMIT 1'

    const result = await db.execute(sqlFindUserByEmail, { email })

    const users = result as User[]

    if (users.length === 0) return null

    return users[0]
  },

  findUserById: async (id: number) => {
    const sqlFindUserById = 'SELECT * FROM users WHERE id = :id LIMIT 1'

    const result = await db.execute(sqlFindUserById, { id })

    const users = result as User[]

    if (users.length === 0) return null

    return users[0]
  },

  createUser: async (email: string, password: string) => {
    const sqlCreateUser =
      'INSERT INTO users (email, password) VALUES (:email, :password)'

    const hashed = await argon.hash(password)

    const result = await db.execute(sqlCreateUser, { email, password: hashed })

    const { insertId } = result as ResultSetHeader

    return insertId
  },
}

export default userRepository
