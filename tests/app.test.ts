import request from 'supertest'
import app from '../src/app'
import { StatusCode } from '../src/lib/http/status'
import { db } from '../src/lib/db'

// app setup
const api = request(app)

// test proper
describe('App Test Suite', () => {
  afterAll(async () => {
    await db.close()
  })

  test('GET / returns the status is up', async () => {
    const res = await api.get('/')

    expect(res.status).toEqual(StatusCode.OK)
    expect(res.body.status).toEqual('ok')
    expect(res.body.message).toEqual('Server is up.')
  })

  test('GET /unknown returns not found', async () => {
    const res = await api.get('/unknown')

    expect(res.status).toEqual(StatusCode.NOT_FOUND)
  })

  test('GET /health returns healthy', async () => {
    const res = await api.get('/health')

    expect(res.status).toEqual(StatusCode.OK)
    expect(res.body.status).toEqual('ok')
    expect(res.body.message).toEqual('Healthy')
  })
})
