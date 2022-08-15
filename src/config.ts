import { PoolOptions } from 'mysql2'
import cors from 'cors'

const config = {
  app: {
    host: process.env.HOST || 'localhost',
    port: Number(process.env.PORT) || 3000,
  },

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME || 'test',
    supportBigNumbers: true,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    namedPlaceholders: true,
  } as PoolOptions,

  cors: {
    origin: '*',
  } as cors.CorsOptions,

  jwt: {
    algorithm: 'ES256' as const,
    privateKey: process.env.PRIVATE_KEY || 'private.key',
    publicKey: process.env.PUBLIC_KEY || 'public.key',
    expiresIn: '1h',
  },
}

export default config
