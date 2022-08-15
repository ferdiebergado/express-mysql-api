export const validateEnv = () => {
  const { DB_USER, DB_PASS } = process.env

  if (!DB_USER || !DB_PASS) {
    console.error(
      'Configuration error.\nPlease check the environment variables.'
    )

    process.exit(1)
  }
}
