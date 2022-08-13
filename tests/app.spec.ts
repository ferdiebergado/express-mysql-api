import request from 'supertest'
import app from '../src/app'
import { HTTP_STATUS } from '../src/lib/http/status'

// app setup
const api = request(app)

// test proper
describe('App Test Suite', () => {
  it('GET / returns the status is up', async () => {
    const res = await api.get('/')

    expect(res.status).toEqual(HTTP_STATUS.OK)
    expect(res.body.status).toEqual('ok')
    expect(res.body.message).toEqual('Server is up.')
  })

  it('GET /unknown returns not found', async () => {
    const res = await api.get('/unknown')

    expect(res.status).toEqual(HTTP_STATUS.NOT_FOUND)
  })

  it('GET /health returns healthy', async () => {
    const res = await api.get('/health')

    expect(res.status).toEqual(HTTP_STATUS.OK)
    expect(res.body.status).toEqual('ok')
    expect(res.body.message).toEqual('Healthy')
  })
})
