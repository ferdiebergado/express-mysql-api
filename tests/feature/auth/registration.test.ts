import request from 'supertest'
import { faker } from '@faker-js/faker'
import app from '../../../src/app'
import { Message, StatusCode } from '../../../src/lib/http'
import { authDto, authMessages } from '../../../src/lib/auth'
import { db } from '../../../src/lib/db'

// test proper
describe('User Registration', () => {
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

  // test data
  const { email, password } = getData()
  const userData: authDto.RegisterDTO = {
    email,
    password,
    passwordConfirmation: password,
  }

  // endpoints to test
  const registerUrl = authUrl + '/register'

  beforeAll(async () => {
    await db.resetTable('users')
  })

  afterAll(async () => {
    await db.close()
  })

  it('should return the user id', async () => {
    const res = await postData(registerUrl, userData)

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
