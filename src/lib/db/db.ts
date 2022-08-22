import mysql, { Pool } from 'mysql2'
import config from '../../config'

class Database {
  pool!: Pool

  constructor() {
    this.init()
    this._attachListeners()
  }

  /**
   * Initialize the database
   */
  init() {
    const _pool = mysql.createPool(config.db)

    _pool.getConnection((err, connection) => {
      if (err) throw err
      console.log('Connected to the database')
      connection.release()
    })

    this.pool = _pool
  }

  /**
   * Get a promise-wrapped connection
   * @returns Pool
   */
  getPromisePool() {
    return this.pool.promise()
  }

  async query(sql: string) {
    const [result] = await this.getPromisePool().query(sql)

    return result
  }

  async execute(sql: string, params: any) {
    const [result] = await this.getPromisePool().execute(sql, params)

    return result
  }

  async resetTable(table: string) {
    await this.getPromisePool().query('SET FOREIGN_KEY_CHECKS = 0')
    await this.getPromisePool().query(`TRUNCATE TABLE ${table}`)
    await this.getPromisePool().query('SET FOREIGN_KEY_CHECKS = 1')
  }

  close(): Promise<void> {
    console.log('Closing database connection...')

    return new Promise((resolve, reject) => {
      this.pool.end((err) => {
        if (err) return reject(err)

        console.log('Database closed')

        resolve()
      })
    })
  }

  private _attachListeners() {
    this.pool.on('connection', (conn) => {
      console.log('Connection %d created', conn.threadId)
    })

    this.pool.on('acquire', function (connection) {
      console.log('Connection %d acquired', connection.threadId)
    })

    this.pool.on('enqueue', function () {
      console.log('Waiting for available connection slot...')
    })

    this.pool.on('release', function (connection) {
      console.log('Connection %d released', connection.threadId)
    })
  }
}

export default new Database()
