import type { Config } from '@jest/types'

export default async (): Promise<Config.InitialOptions> => {
  return {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['tests'],
    setupFilesAfterEnv: ['<rootDir>setupTests.ts'],
    verbose: true,
  }
}
