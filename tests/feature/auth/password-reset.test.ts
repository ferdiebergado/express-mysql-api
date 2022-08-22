import request from 'supertest'
import { faker } from '@faker-js/faker'
import app from '../../../src/app'
import { db } from '../../../src/lib/db'

// test proper
describe('Password Reset', () => {
  // app setup
  const api = request(app)
  const authUrl = '/auth'

  // helper functions
  const postData = async (url: string, data: Record<string, any>) => {
    return await api
      .post(url)
      .set('content-type', 'application/json')
      .send(data)
  }

  const getData = () => {
    const email = faker.internet.email().toLowerCase()
    const password = faker.random.alpha(10)

    return { email, password }
  }

  beforeAll(async () => {
    await db.resetTable('users')
  })

  afterAll(async () => {
    await db.close()
  })

  it.todo('sends a password reset link')
  it.todo('user can reset the password')
})
