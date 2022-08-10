const config = {
  app: {
    host: process.env.HOST || 'localhost',
    port: Number(process.env.PORT) || 3000,
  },

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASS || '6y5k0yqtxm9l',
    database: process.env.DB_NAME || 'test',
  },

  cors: {
    origin: '*',
  },

  jwt: {
    algorithm: 'HS512' as const,
    secret: process.env.KEY || '8g63dl61ykdd',
    expiresIn: '30m',
  },
}

export default config
