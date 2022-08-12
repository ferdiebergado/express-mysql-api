import mysql, { ResultSetHeader } from 'mysql2'
import { BaseEntity } from '.'
import config from '../../config'

export const pool = mysql.createPool(config.db)

export interface QueryResult<T> {
  data: T[]
  id: number
}

export const query = async <T extends BaseEntity>(
  sql: string,
  ...params: (string | number)[]
) => {
  const [rows, _] = await pool.promise().execute(sql, params)

  const result: QueryResult<T> = {
    data: [],
    id: 0,
  }

  if (rows.constructor.name === 'ResultSetHeader') {
    const info = rows as ResultSetHeader

    result.id = info.insertId
  } else {
    result.data = rows as T[]
  }

  return result
}
