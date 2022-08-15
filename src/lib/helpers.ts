import fs from 'fs/promises'

export const parsePackageJson = async () => {
  const buffer = await fs.readFile(process.cwd() + '/package.json')

  return JSON.parse(buffer.toString())
}
