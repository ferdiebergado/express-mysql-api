import mysql from 'mysql2'
import fs from 'fs/promises'
import path from 'path'
import config from '../../config'

const _pool = () => {
  let pool: mysql.Pool | undefined

  return {
    get: () => {
      if (pool) return pool

      pool = mysql.createPool(config.db)

      console.log('Connected to the database')

      pool.on('connection', (conn) => {
        console.log('Connection %d created', conn.threadId)
      })

      pool.on('acquire', function (connection) {
        console.log('Connection %d acquired', connection.threadId)
      })

      pool.on('enqueue', function () {
        console.log('Waiting for available connection slot...')
      })

      pool.on('release', function (connection) {
        console.log('Connection %d released', connection.threadId)
      })

      return pool
    },

    release: (): Promise<void> => {
      console.log('Closing database connection...')

      if (!pool) return Promise.resolve()

      return new Promise((resolve, reject) => {
        pool?.end((err) => {
          if (err) return reject(err)

          pool = undefined

          console.log('Database closed')

          resolve()
        })
      })
    },
  }
}

export const Pool = _pool()

export const pool = Pool.get()

const promisePool = pool.promise()

export const execute = async (
  sql: string,
  params: any | any[] | { [param: string]: any }
) => {
  const [result] = await promisePool.execute(sql, params)

  return result
}

export const query = async (sql: string) => {
  const [result] = await promisePool.query(sql)

  return result
}

export const resetDb = async () => {
  const conn = await promisePool.getConnection()

  try {
    await conn.beginTransaction()
    await conn.query('SET FOREIGN_KEY_CHECKS = 0')

    const schema = config.db.database
    const [rows] = await conn.execute(
      'SELECT table_name FROM information_schema.tables WHERE table_schema = :schema',
      { schema }
    )

    const tables = rows as any[]

    tables.forEach(async (table: Record<string, any>) => {
      await conn.execute('DROP TABLE IF EXISTS `:table`', {
        table: table.TABLE_NAME,
      })
    })

    const sqlDir = path.join(__dirname, 'sql')
    const files = await fs.readdir(sqlDir)

    files.forEach(async (file) => {
      const sqlFile = path.join(sqlDir, file)

      const sql = await fs.readFile(sqlFile, { encoding: 'utf-8' })

      await conn.query(sql)
    })

    await conn.query('SET FOREIGN_KEY_CHECKS = 1')
    await conn.commit()
  } catch (error) {
    await conn.rollback()
    console.error(error)
    throw error
  }
}
