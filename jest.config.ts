import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'ts', 'json'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^user/(.*)$': '<rootDir>/src/user/$1',
    '^common/(.*)': '<rootDir>/src/common/$1',
    '^decorators/(.*)': '<rootDir>/src/decorators/$1',
    '^guards/(.*)': '<rootDir>/src/guards/$1',
  },
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: './coverage',
  // collectCoverage: true,
  collectCoverageFrom: ['src/**/*.(t|j)s'],
  // coveragePathIgnorePatterns: ['src/migrations'],
  testEnvironment: 'node',
};

export default config;
