import request from 'supertest'
import app from '../src/app'
import { faker } from '@faker-js/faker'
import { HTTP_STATUS } from '../src/lib/http'
import { authDto, authMessages } from '../src/lib/auth'

// test proper
describe('Authentication Test Suite', () => {
  // app setup
  const api = request(app)
  const authUrl = '/auth'

  // helper functions
  const postData = async (url: string, data: Record<string, any>) => {
    const response = await api
      .post(url)
      .set('content-type', 'application/json')
      .send(data)

    return response
  }

  // test data
  const email = faker.internet.email()
  const password = faker.random.alpha(10)
  const userData: authDto.RegisterDTO = {
    email,
    password,
    passwordConfirmation: password,
  }

  describe('User Registration', () => {
    const registerUrl = authUrl + '/register'

    it('should register a user', async () => {
      console.log('USERDATA:', userData)

      const res = await postData(registerUrl, userData)

      expect(res.status).toEqual(HTTP_STATUS.CREATED)
      expect(res.body.status).toEqual('ok')
      expect(res.body.message).toEqual(authMessages.REGISTRATION_SUCCESS)
      expect(res.body.data.id).toBeDefined()
    })

    // TODO: Add expectations for ResponsePayload

    it('registration should fail when email is empty', async () => {
      const res = await postData(registerUrl, { password })

      expect(res.status).toEqual(HTTP_STATUS.UNPROCESSABLE_ENTITY)
      expect(res.body.status).toEqual('failed')
      expect(res.body.message).toEqual('Invalid input')
      expect(res.body.errors[0].param).toEqual('email')
    })

    it('registration should fail when email is not an email', async () => {
      const res = await postData(registerUrl, { email: 'notanemail', password })

      expect(res.status).toEqual(HTTP_STATUS.UNPROCESSABLE_ENTITY)
      expect(res.body.errors[0].param).toEqual('email')
    })

    it('registration should fail when password is empty', async () => {
      const res = await postData(registerUrl, { email })

      expect(res.status).toEqual(HTTP_STATUS.UNPROCESSABLE_ENTITY)
      expect(res.body.errors[0].param).toEqual('password')
    })

    it('registration should fail when password confirmation is empty', async () => {
      const res = await postData(registerUrl, { email, password })

      expect(res.status).toEqual(HTTP_STATUS.UNPROCESSABLE_ENTITY)
      expect(res.body.errors[0].param).toEqual('passwordConfirmation')
    })

    it('registration should fail when passwords do not match', async () => {
      const res = await postData(registerUrl, {
        email,
        password,
        passwordConfirmation: 'dontmatch',
      })

      expect(res.status).toEqual(HTTP_STATUS.UNPROCESSABLE_ENTITY)
      expect(res.body.errors[0].msg).toEqual('Passwords do not match')
    })

    it.todo('registration should fail when password is too short')
    it.todo('registration should fail when password is too long')
  })

  describe('User Login', () => {
    const loginUrl = authUrl + '/login'

    it('should login a user', async () => {
      const res = await postData(loginUrl, { email, password })

      expect(res.status).toEqual(HTTP_STATUS.OK)
      expect(res.body.status).toEqual('ok')
      expect(res.body.message).toEqual(authMessages.LOGIN_SUCCESS)
      expect(res.body.data.token).toBeDefined()
    })

    it('login should fail when email is empty', async () => {
      const res = await postData(loginUrl, { password })

      expect(res.status).toEqual(HTTP_STATUS.UNPROCESSABLE_ENTITY)
      expect(res.body.errors[0].param).toEqual('email')
    })

    it('login should fail when email is not an email', async () => {
      const res = await postData(loginUrl, { email: 'notanemail', password })

      expect(res.status).toEqual(HTTP_STATUS.UNPROCESSABLE_ENTITY)
      expect(res.body.errors[0].param).toEqual('email')
    })

    it('login should fail when password is empty', async () => {
      const res = await postData(loginUrl, { email })

      expect(res.status).toEqual(HTTP_STATUS.UNPROCESSABLE_ENTITY)
      expect(res.body.errors[0].param).toEqual('password')
    })
  })

  describe('Password Reset', () => {
    it.todo('sends a password reset link')
    it.todo('user can reset the password')
  })

  describe('User Authorization', () => {
    it.todo('request with valid token is processed')
    it.todo('request fails if token is missing')
    it.todo('request fails if token is expired')
    it.todo('request fails if token is malformed')
  })
})
