import request from 'supertest'
import app from '../src/app'
import { faker } from '@faker-js/faker'
import { HTTP_MESSAGE, HTTP_STATUS } from '../src/lib/http'
import { authDto, authMessages } from '../src/lib/auth'
import { generateToken } from '../src/lib/utils/jwt'
import { UserSession } from '../src/lib/users'

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

  const getData = () => {
    const email = faker.internet.email().toLowerCase()
    const password = faker.random.alpha(10)

    return { email, password }
  }

  // test data
  const { email, password } = getData()
  const userData: authDto.RegisterDTO = {
    email,
    password,
    passwordConfirmation: password,
  }

  // endpoints to test
  const registerUrl = authUrl + '/register'
  const loginUrl = authUrl + '/login'

  describe('User Registration', () => {
    it('should return the user id', async () => {
      const res = await postData(registerUrl, userData)

      expect(res.status).toEqual(HTTP_STATUS.CREATED)
      expect(res.body.status).toEqual('ok')
      expect(res.body.message).toEqual(authMessages.REGISTRATION_SUCCESS)
      expect(res.body.data.id).toBeDefined()
    })

    it('registration should fail when email is empty', async () => {
      const res = await postData(registerUrl, { password })

      expect(res.status).toEqual(HTTP_STATUS.UNPROCESSABLE_ENTITY)
      expect(res.body.status).toEqual('failed')
      expect(res.body.message).toEqual(HTTP_MESSAGE.INVALID_INPUT)
      expect(res.body.errors[0].param).toEqual('email')
    })

    it('registration should fail when email is not an email', async () => {
      const res = await postData(registerUrl, { email: 'notanemail', password })

      expect(res.status).toEqual(HTTP_STATUS.UNPROCESSABLE_ENTITY)
      expect(res.body.status).toEqual('failed')
      expect(res.body.message).toEqual(HTTP_MESSAGE.INVALID_INPUT)
      expect(res.body.errors[0].param).toEqual('email')
    })

    it('registration should fail when password is empty', async () => {
      const res = await postData(registerUrl, { email })

      expect(res.status).toEqual(HTTP_STATUS.UNPROCESSABLE_ENTITY)
      expect(res.body.status).toEqual('failed')
      expect(res.body.message).toEqual(HTTP_MESSAGE.INVALID_INPUT)
      expect(res.body.errors[0].param).toEqual('password')
    })

    it('registration should fail when password confirmation is empty', async () => {
      const res = await postData(registerUrl, { email, password })

      expect(res.status).toEqual(HTTP_STATUS.UNPROCESSABLE_ENTITY)
      expect(res.body.status).toEqual('failed')
      expect(res.body.message).toEqual(HTTP_MESSAGE.INVALID_INPUT)
      expect(res.body.errors[0].param).toEqual('passwordConfirmation')
    })

    it('registration should fail when passwords do not match', async () => {
      const res = await postData(registerUrl, {
        email,
        password,
        passwordConfirmation: 'dontmatch',
      })

      expect(res.status).toEqual(HTTP_STATUS.UNPROCESSABLE_ENTITY)
      expect(res.body.status).toEqual('failed')
      expect(res.body.message).toEqual(HTTP_MESSAGE.INVALID_INPUT)
      expect(res.body.errors[0].msg).toEqual('Passwords do not match')
    })

    it.todo('registration should fail when password is too short')
    it.todo('registration should fail when password is too long')
  })

  describe('User Login', () => {
    it('should return a token', async () => {
      const res = await postData(loginUrl, { email, password })

      expect(res.status).toEqual(HTTP_STATUS.OK)
      expect(res.body.status).toEqual('ok')
      expect(res.body.message).toEqual(authMessages.LOGIN_SUCCESS)
      expect(res.body.data.token).toBeDefined()
    })

    it('login should fail when email is empty', async () => {
      const res = await postData(loginUrl, { password })

      expect(res.status).toEqual(HTTP_STATUS.UNPROCESSABLE_ENTITY)
      expect(res.body.status).toEqual('failed')
      expect(res.body.message).toEqual(HTTP_MESSAGE.INVALID_INPUT)
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
      expect(res.body.status).toEqual('failed')
      expect(res.body.message).toEqual(HTTP_MESSAGE.INVALID_INPUT)
      expect(res.body.errors[0].param).toEqual('password')
    })
  })

  describe('Password Reset', () => {
    it.todo('sends a password reset link')
    it.todo('user can reset the password')
  })

  describe('User Authorization', () => {
    const usersUrl = '/users'

    it('request with valid token is allowed', async () => {
      const user = getData()

      const newUserData = {
        ...user,
        passwordConfirmation: user.password,
      }

      let response = await postData(registerUrl, newUserData)
      const id = response.body.data.id

      response = await postData(loginUrl, user)

      const token = response.body.data.token

      response = await api
        .get(usersUrl + '/' + id)
        .set('Authorization', 'Bearer ' + token)
        .send()

      expect(response.status).toEqual(HTTP_STATUS.OK)
      expect(response.body.data.user.id).toEqual(id)
      expect(response.body.data.user.email).toEqual(user.email)
    })

    it('request fails if there is no authorization header', async () => {
      const user = getData()

      const newUserData = {
        ...user,
        passwordConfirmation: user.password,
      }

      let response = await postData(registerUrl, newUserData)
      const id = response.body.data.id

      response = await api.get(usersUrl + '/' + id).send()

      expect(response.status).toEqual(HTTP_STATUS.UNAUTHORIZED)
      expect(response.body.status).toEqual('failed')
    })

    it('request fails if token is missing in authorization header', async () => {
      const user = getData()

      const newUserData = {
        ...user,
        passwordConfirmation: user.password,
      }

      let response = await postData(registerUrl, newUserData)
      const id = response.body.data.id
      const token = ''

      response = await api
        .get(usersUrl + '/' + id)
        .set('Authorization', 'Bearer ' + token)
        .send()

      expect(response.status).toEqual(HTTP_STATUS.UNAUTHORIZED)
      expect(response.body.status).toEqual('failed')
      // expect(response.body.message).toEqual(user.email)
    })

    it('request fails if token is not a proper jwt', async () => {
      const user = getData()

      const newUserData = {
        ...user,
        passwordConfirmation: user.password,
      }

      let response = await postData(registerUrl, newUserData)
      const id = response.body.data.id
      const token = Buffer.from('u5lmxxar38orrpi9sug5t97sqnfu1xc4').toString(
        'base64'
      )

      response = await api
        .get(usersUrl + '/' + id)
        .set('Authorization', 'Bearer ' + token)
        .send()

      expect(response.status).toEqual(HTTP_STATUS.UNAUTHORIZED)
      expect(response.body.status).toEqual('failed')
    })

    it('request fails if token is expired', async () => {
      const user = getData()

      const newUserData = {
        ...user,
        passwordConfirmation: user.password,
      }

      let response = await postData(registerUrl, newUserData)
      const id = response.body.data.id
      const payload: UserSession = {
        id,
        email: user.email,
        createdAt: new Date(),
      }
      const token = generateToken(payload, 60 * 1000 * 60)

      response = await api
        .get(usersUrl + '/' + id)
        .set('Authorization', 'Bearer ' + token)
        .send()

      expect(response.status).toEqual(HTTP_STATUS.UNAUTHORIZED)
      expect(response.body.status).toEqual('failed')
    })

    it.todo('request fails if token is malformed')
  })
})
