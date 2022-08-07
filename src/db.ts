import mysql, { FieldPacket, ResultSetHeader, RowDataPacket } from 'mysql2'
import config from './config'

const pool = mysql.createPool(config.db)

export const db = pool.promise()

export const query = async (sql: string, params: any[]) => {
  const [rows, _]: [RowDataPacket[] | ResultSetHeader, FieldPacket[]] =
    await db.query(sql, params)

  return rows
}
