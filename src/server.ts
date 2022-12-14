import http from 'http'
import app from './app'
import { db } from './lib/db'

const PORT = app.get('port')

const httpServer = http.createServer(app)

httpServer.listen(PORT, () =>
  console.log('Server listening on port %d...', PORT)
)

const cleanuUp = async () => {
  // clean up allocated resources
  await db.close()

  httpServer.close(() => {
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

// nodemon shutdown hook
if (process.env.NODE_ENV !== 'production') {
  process.once('SIGUSR2', async () => {
    await cleanuUp()
    process.kill(process.pid, 'SIGUSR2')
  })
}
