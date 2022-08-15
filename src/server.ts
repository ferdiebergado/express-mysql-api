import http from 'http'
import app from './app'
import { db } from './lib/db'

const HOST = app.get('host')
const PORT = app.get('port')

const server = http.createServer(app)
const pool = db.Pool

server.listen(PORT, HOST, () =>
  console.log('Server listening on http://%s:%d...', HOST, PORT)
)

const cleanuUp = async () => {
  // clean up allocated resources
  await pool.release()

  server.close(() => {
    console.log('Server closed.')
  })
}

const shutDown = () => {
  process.exit() // exit the process to avoid unknown state
}

process.on('uncaughtException', async (err) => {
  // log necessary error details to log files
  console.error('An uncaught error occurred!')
  console.error(err.stack)
  await cleanuUp()
  shutDown()
})

process.on('SIGTERM', async () => {
  await cleanuUp()
  shutDown()
})

process.on('SIGINT', async () => {
  await cleanuUp()
  shutDown()
})

if (process.env.NODE_ENV !== 'production') {
  process.once('SIGUSR2', async () => {
    await cleanuUp()
    process.kill(process.pid, 'SIGUSR2')
  })
}
