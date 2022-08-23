export interface Database {
  /* connection object */
  connection: any

  /* Connect to the database */
  connect: () => void

  /**
   * Query the database
   * @param sql query string
   * @returns row(s)
   */
  query: (sql: string) => any

  /**
   * Query the database using prepared statement
   * @param sql query string
   * @param params query parameters
   * @returns row(s)
   */
  execute: (sql: string, params: any) => any

  /**
   * Close the database
   * @returns error on failure or void on success
   */
  close: () => void
}
