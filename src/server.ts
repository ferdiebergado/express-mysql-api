import http from 'http'
import app from './app'
import { db } from './lib/db'

const PORT = app.get('port')
const server = http.createServer(app)
const pool = db.Pool

server.listen(PORT, () => console.log('Server listening on port %d...', PORT))

const cleanuUp = async () => {
  // clean up allocated resources
  await pool.release()
  server.close()
  console.log('Server closed.')
}

const shutDown = () => {
  process.exit() // exit the process to avoid unknown state
}

process.on('uncaughtException', async (err) => {
  // log necessary error details to log files
  console.error(err)
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
