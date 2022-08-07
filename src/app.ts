import 'dotenv/config'
import express from 'express'
import config from './config'
import routes from './routes'
import { requestLogger, errorHandler, notFoundHandler } from './lib/middlewares'

const app = express()

app.set('port', config.app.port)

app.disable('x-powered-by')
app.disable('etag')

app.use(requestLogger)
app.use(express.json())

app.use(routes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
