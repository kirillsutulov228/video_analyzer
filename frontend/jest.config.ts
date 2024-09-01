/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest'

import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: '.'
})

const config: Config = {
  clearMocks: true,
  collectCoverage: false,
  coverageDirectory: '../coverage',
  coverageProvider: 'v8',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  setupFiles: ['jest-canvas-mock'],
  testEnvironment: 'jsdom',
  transform: {
    '\\.[jt]sx?$': [
      'babel-jest',
      {
        babelrc: true
      }
    ]
  }
}

export default createJestConfig(config)
