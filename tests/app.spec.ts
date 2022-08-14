import request from 'supertest'
import app from '../src/app'
import { HTTP_STATUS } from '../src/lib/http/status'
import { db } from '../src/lib/db'

// app setup
const api = request(app)
const pool = db.Pool

// test proper
describe('App Test Suite', () => {
  afterAll(async () => {
    await pool.release()
  })

  test('GET / returns the status is up', async () => {
    const res = await api.get('/')

    expect(res.status).toEqual(HTTP_STATUS.OK)
    expect(res.body.status).toEqual('ok')
    expect(res.body.message).toEqual('Server is up.')
  })

  test('GET /unknown returns not found', async () => {
    const res = await api.get('/unknown')

    expect(res.status).toEqual(HTTP_STATUS.NOT_FOUND)
  })

  test('GET /health returns healthy', async () => {
    const res = await api.get('/health')

    expect(res.status).toEqual(HTTP_STATUS.OK)
    expect(res.body.status).toEqual('ok')
    expect(res.body.message).toEqual('Healthy')
  })
})
