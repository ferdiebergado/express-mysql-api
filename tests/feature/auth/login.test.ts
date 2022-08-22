import request from 'supertest'
import { faker } from '@faker-js/faker'
import app from '../../../src/app'
import { Message, StatusCode } from '../../../src/lib/http'
import { authDto, authMessages } from '../../../src/lib/auth'
import { db } from '../../../src/lib/db'

// test proper
describe('User Login', () => {
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

  // endpoints
  const registerUrl = authUrl + '/register'
  const loginUrl = authUrl + '/login'

  let loginData: authDto.LoginDTO
  let email: string
  let password: string

  beforeAll(async () => {
    await db.resetTable('users')
  })

  beforeEach(async () => {
    loginData = getData()
    email = loginData.email
    password = loginData.password

    const newUserData: authDto.RegisterDTO = {
      ...loginData,
      passwordConfirmation: loginData.password,
    }

    await postData(registerUrl, newUserData)
  })

  afterAll(async () => {
    await db.close()
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
