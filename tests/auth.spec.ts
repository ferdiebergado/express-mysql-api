import request from 'supertest'
import { faker } from '@faker-js/faker'
import app from '../src/app'
import { Message, StatusCode } from '../src/lib/http'
import { authDto, authMessages } from '../src/lib/auth'
import { generateToken, JwtPayload } from '../src/lib/utils'
import { db } from '../src/lib/db'

// test proper
describe('User Authentication', () => {
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

  const pool = db.Pool

  beforeAll(async () => {
    await db.resetDb()
  })

  afterAll(async () => {
    await pool.release()
  })

  describe('User Registration', () => {
    it('should return the user id', async () => {
      const res = await postData(registerUrl, userData)

      console.log(userData)

      expect(res.status).toEqual(StatusCode.CREATED)
      expect(res.body.status).toEqual('ok')
      expect(res.body.message).toEqual(authMessages.REGISTRATION_SUCCESS)
      expect(res.body.data.id).toBeDefined()
    })

    it('should fail when email is empty', async () => {
      const res = await postData(registerUrl, { password })

      expect(res.status).toEqual(StatusCode.UNPROCESSABLE_ENTITY)
      expect(res.body.status).toEqual('failed')
      expect(res.body.message).toEqual(Message.INVALID_INPUT)
      expect(res.body.errors[0].param).toEqual('email')
    })

    it('should fail when email is not an email', async () => {
      const res = await postData(registerUrl, { email: 'notanemail', password })

      expect(res.status).toEqual(StatusCode.UNPROCESSABLE_ENTITY)
      expect(res.body.status).toEqual('failed')
      expect(res.body.message).toEqual(Message.INVALID_INPUT)
      expect(res.body.errors[0].param).toEqual('email')
    })

    it('should fail when password is empty', async () => {
      const res = await postData(registerUrl, { email })

      expect(res.status).toEqual(StatusCode.UNPROCESSABLE_ENTITY)
      expect(res.body.status).toEqual('failed')
      expect(res.body.message).toEqual(Message.INVALID_INPUT)
      expect(res.body.errors[0].param).toEqual('password')
    })

    it('should fail when password confirmation is empty', async () => {
      const res = await postData(registerUrl, { email, password })

      expect(res.status).toEqual(StatusCode.UNPROCESSABLE_ENTITY)
      expect(res.body.status).toEqual('failed')
      expect(res.body.message).toEqual(Message.INVALID_INPUT)
      expect(res.body.errors[0].param).toEqual('passwordConfirmation')
    })

    it('should fail when passwords do not match', async () => {
      const res = await postData(registerUrl, {
        email,
        password,
        passwordConfirmation: 'dontmatch',
      })

      expect(res.status).toEqual(StatusCode.UNPROCESSABLE_ENTITY)
      expect(res.body.status).toEqual('failed')
      expect(res.body.message).toEqual(Message.INVALID_INPUT)
      expect(res.body.errors[0].msg).toEqual(authMessages.PASSWORD_MISMATCH)
    })

    it.todo('should fail when password is too short')
    it.todo('should fail when password is too long')

    it('should fail when user already exists', async () => {
      const data = getData()

      const user: authDto.RegisterDTO = {
        ...data,
        passwordConfirmation: data.password,
      }

      await postData(registerUrl, user)

      const res = await postData(registerUrl, user)

      expect(res.status).toEqual(StatusCode.UNPROCESSABLE_ENTITY)
      expect(res.body.status).toEqual('failed')
      expect(res.body.message).toEqual(authMessages.USER_EXISTS)
    })
  })

  describe('User Login', () => {
    let loginData: authDto.LoginDTO
    let email: string
    let password: string
    let id: number

    beforeAll(async () => {
      loginData = getData()
      email = loginData.email
      password = loginData.password

      const newUserData = {
        ...loginData,
        passwordConfirmation: loginData.password,
      }

      const response = await postData(registerUrl, newUserData)
      id = response.body.data.id
    })

    it('should return a token', async () => {
      const res = await postData(loginUrl, loginData)

      expect(res.status).toEqual(StatusCode.OK)
      expect(res.body.status).toEqual('ok')
      expect(res.body.message).toEqual(authMessages.LOGIN_SUCCESS)
      expect(res.body.data.token).toBeDefined()
    })

    it('should fail when email is empty', async () => {
      const res = await postData(loginUrl, { password })

      expect(res.status).toEqual(StatusCode.UNPROCESSABLE_ENTITY)
      expect(res.body.status).toEqual('failed')
      expect(res.body.message).toEqual(Message.INVALID_INPUT)
      expect(res.body.errors[0].param).toEqual('email')
    })

    it('should fail when email is not an email', async () => {
      const res = await postData(loginUrl, { email: 'notanemail', password })

      expect(res.status).toEqual(StatusCode.UNPROCESSABLE_ENTITY)
      expect(res.body.errors[0].param).toEqual('email')
    })

    it('should fail when password is empty', async () => {
      const res = await postData(loginUrl, { email })

      expect(res.status).toEqual(StatusCode.UNPROCESSABLE_ENTITY)
      expect(res.body.status).toEqual('failed')
      expect(res.body.message).toEqual(Message.INVALID_INPUT)
      expect(res.body.errors[0].param).toEqual('password')
    })
  })

  describe('Password Reset', () => {
    it.todo('sends a password reset link')
    it.todo('user can reset the password')
  })

  describe('User Authorization', () => {
    const usersUrl = '/users'

    let loginData: authDto.LoginDTO
    let email: string
    let password: string
    let id: number

    beforeAll(async () => {
      loginData = getData()
      email = loginData.email
      password = loginData.password

      const newUserData = {
        ...loginData,
        passwordConfirmation: password,
      }

      const response = await postData(registerUrl, newUserData)
      id = response.body.data.id
    })

    it('allows request with valid token', async () => {
      let response = await postData(loginUrl, loginData)

      const token = response.body.data.token

      response = await api
        .get(usersUrl + '/' + id)
        .set('Authorization', 'Bearer ' + token)

      expect(response.status).toEqual(StatusCode.OK)
      expect(response.body.data.user.id).toEqual(id)
      expect(response.body.data.user.email).toEqual(email)
    })

    it('fails if there is no authorization header', async () => {
      let response = await api.get(usersUrl + '/' + id)

      expect(response.status).toEqual(StatusCode.UNAUTHORIZED)
      // TODO: use message constants
      expect(response.body.status).toEqual('failed')
    })

    it('fails if token is missing in authorization header', async () => {
      const token = ''

      const response = await api
        .get(usersUrl + '/' + id)
        .set('Authorization', 'Bearer ' + token)

      expect(response.status).toEqual(StatusCode.UNAUTHORIZED)
      // TODO: use message constants
      expect(response.body.status).toEqual('failed')
      // expect(response.body.message).toEqual(user.email)
    })

    it('fails if token is not a proper jwt', async () => {
      const token = Buffer.from('u5lmxxar38orrpi9sug5t97sqnfu1xc4').toString(
        'base64'
      )

      let response = await api
        .get(usersUrl + '/' + id)
        .set('Authorization', 'Bearer ' + token)

      expect(response.status).toEqual(StatusCode.UNAUTHORIZED)
      // TODO: use message constants
      expect(response.body.status).toEqual('failed')
      expect(response.body.message).toEqual('jwt malformed')
    })

    it('fails if token is expired', async () => {
      const payload: JwtPayload = {
        id,
        email: loginData.email,
        createdAt: new Date(),
      }
      const token = generateToken(payload, 60 * 1000 * 60)

      const response = await api
        .get(usersUrl + '/' + id)
        .set('Authorization', 'Bearer ' + token)

      expect(response.status).toEqual(StatusCode.UNAUTHORIZED)
      // TODO: use message constants
      expect(response.body.status).toEqual('failed')
      expect(response.body.message).toEqual('jwt expired')
    })

    it.todo('fails if token is malformed')
  })
})
