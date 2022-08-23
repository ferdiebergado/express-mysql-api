import mysql, { Pool } from 'mysql2'
import config from '../../config'
import { Database } from './interfaces/database'

/**
 * MySqlDatabase class
 */
class MySqlDatabase implements Database {
  /* connection object */
  connection!: Pool

  /* Default constructor */
  constructor() {
    this.connect()
    this._attachListeners()
  }

  /* Connect to the database */
  connect() {
    const _pool = mysql.createPool(config.db)

    _pool.getConnection((err, connection) => {
      if (err) throw err

      console.log('Connected to the database')
      connection.release()
    })

    this.connection = _pool
  }

  /**
   * Get a promise-wrapped connection
   * @returns promise-wrapped connection
   */
  getPromisePool() {
    return this.connection.promise()
  }

  /**
   * Query the database
   * @param sql query string
   * @returns row(s)
   */
  async query(sql: string) {
    const [result] = await this.getPromisePool().query(sql)

    return result
  }

  /**
   * Query the database using prepared statement
   * @param sql query string
   * @param params query parameters
   * @returns row(s)
   */
  async execute(sql: string, params: any) {
    const [result] = await this.getPromisePool().execute(sql, params)

    return result
  }

  /**
   * Refresh a table
   * @param table name of the table
   */
  async resetTable(table: string) {
    await this.getPromisePool().query('SET FOREIGN_KEY_CHECKS = 0')
    await this.getPromisePool().query(`TRUNCATE TABLE ${table}`)
    await this.getPromisePool().query('SET FOREIGN_KEY_CHECKS = 1')
  }

  /**
   * Close the database
   * @returns error on failure or void on success
   */
  close(): Promise<void> {
    console.log('Closing database connection...')

    return new Promise((resolve, reject) => {
      this.connection.end((err) => {
        if (err) return reject(err)

        console.log('Database closed')

        resolve()
      })
    })
  }

  /* Attach event listeners to the connection pool */
  private _attachListeners() {
    this.connection.on('connection', (conn) => {
      console.log('Connection %d created', conn.threadId)
    })

    this.connection.on('acquire', function (connection) {
      console.log('Connection %d acquired', connection.threadId)
    })

    this.connection.on('enqueue', function () {
      console.log('Waiting for available connection slot...')
    })

    this.connection.on('release', function (connection) {
      console.log('Connection %d released', connection.threadId)
    })
  }
}

export default new MySqlDatabase()
