import { Entity } from '../db/entity.interface'

export interface User extends Entity {
  email: string
  password: string
}

export type UserSession = Pick<User, 'id' | 'email' | 'createdAt'>
