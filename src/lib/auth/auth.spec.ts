import request from 'supertest'
import app from '../../app'
import { faker } from '@faker-js/faker'
import { HTTP_STATUS } from '../http/status'

// app setup
const api = request(app)
const authUrl = '/auth'

// test data
const email = faker.internet.email()
const password = faker.random.alpha(10)
const userData = {
  email,
  password,
  password_confirmation: password,
}

// helper functions
const postData = (url: string, data: Record<string, any>) => {
  return api.post(url).set('content-type', 'application/json').send(data)
}

// test proper
describe('Authentication Test Suite', () => {
  const registerUrl = authUrl + '/register'

  it('should register a user', async () => {
    const res = await postData(registerUrl, userData)

    expect(res.status).toEqual(HTTP_STATUS.CREATED)
    // expect(res.body.id).toBeDefined()
  })

  it('registration should fail when email is empty', async () => {
    const res = await postData(registerUrl, { password })

    expect(res.status).toEqual(HTTP_STATUS.BAD_REQUEST)
    expect(res.body.errors[0].param).toEqual('email')
  })

  it('registration should fail when email is not an email', async () => {
    const res = await postData(registerUrl, { email: 'notanemail', password })

    expect(res.status).toEqual(HTTP_STATUS.BAD_REQUEST)
    expect(res.body.errors[0].param).toEqual('email')
  })

  it('registration should fail when password is empty', async () => {
    const res = await postData(registerUrl, { email })

    expect(res.status).toEqual(HTTP_STATUS.BAD_REQUEST)
    expect(res.body.errors[0].param).toEqual('password')
  })

  it('registration should fail when password confirmation is empty', async () => {
    const res = await postData(registerUrl, { email, password })

    expect(res.status).toEqual(HTTP_STATUS.BAD_REQUEST)
    expect(res.body.errors[0].param).toEqual('password_confirmation')
  })

  it('registration should fail when passwords do not match', async () => {
    const res = await postData(registerUrl, {
      email,
      password,
      password_confirmation: 'dontmatch',
    })

    expect(res.status).toEqual(HTTP_STATUS.BAD_REQUEST)
    expect(res.body.errors[0].msg).toEqual('Passwords do not match')
  })

  const loginUrl = authUrl + '/login'

  it('should login a user', async () => {
    const res = await postData(loginUrl, { email, password })

    expect(res.status).toEqual(HTTP_STATUS.OK)
    // expect(res.body.token).toBeDefined()
  })
})
