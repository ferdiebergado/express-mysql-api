import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import config from './config'
import routes from './routes'
import { requestLogger, errorHandler, notFoundHandler } from './lib/middlewares'

const app = express()
const PORT = config.app.port
const corsOptions = {
  origin: config.cors.origin,
}

app.set('port', PORT)

app.disable('x-powered-by')
app.disable('etag')

app.use(cors(corsOptions))
app.use(requestLogger)
app.use(express.urlencoded({ extended: true, limit: '1kb' }))
app.use(express.json({ limit: '1kb' }))

app.use(routes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
