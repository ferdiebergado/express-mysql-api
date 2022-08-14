import { Entity } from '../db/entity.interface'

export interface User extends Entity {
  email: string
  password: string
}
