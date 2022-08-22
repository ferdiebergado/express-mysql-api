import request from 'supertest'
import { faker } from '@faker-js/faker'
import app from '../../../src/app'
import { StatusCode } from '../../../src/lib/http'
import { authDto, authMessages } from '../../../src/lib/auth'
import { generateToken, JwtPayload } from '../../../src/lib/utils'
import { db } from '../../../src/lib/db'

// test proper
describe('User Authorization', () => {
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

  // endpoints to test
  const registerUrl = authUrl + '/register'
  const loginUrl = authUrl + '/login'

  beforeAll(async () => {
    await db.resetTable('users')
  })

  afterAll(async () => {
    await db.close()
  })

  const usersUrl = '/users'

  let loginData: authDto.LoginDTO
  let email: string
  let password: string
  let id: number

  beforeAll(async () => {
    loginData = getData()
    email = loginData.email
    password = loginData.password

    const newUserData: authDto.RegisterDTO = {
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
    const response = await api.get(usersUrl + '/' + id)

    expect(response.status).toEqual(StatusCode.UNAUTHORIZED)
    expect(response.body.status).toEqual('failed')
  })

  it('fails if token is missing in authorization header', async () => {
    const token = ''

    const response = await api
      .get(usersUrl + '/' + id)
      .set('Authorization', 'Bearer ' + token)

    expect(response.status).toEqual(StatusCode.UNAUTHORIZED)
    expect(response.body.status).toEqual('failed')
  })

  it('fails if token is not a proper jwt', async () => {
    const token = Buffer.from('u5lmxxar38orrpi9sug5t97sqnfu1xc4').toString(
      'base64'
    )

    const response = await api
      .get(usersUrl + '/' + id)
      .set('Authorization', 'Bearer ' + token)

    expect(response.status).toEqual(StatusCode.UNAUTHORIZED)
    expect(response.body.status).toEqual('failed')
    expect(response.body.message).toEqual(authMessages.JWT_MALFORMED)
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
    expect(response.body.message).toEqual(authMessages.JWT_EXPIRED)
  })

  it.todo('fails if token is malformed')
})
