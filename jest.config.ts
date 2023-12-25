import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'ts', 'json'],
  moduleNameMapper: {
    '^common/(.*)': '<rootDir>/common/$1',
    '^decorators/(.*)': '<rootDir>/decorators/$1',
    '^guards/(.*)': '<rootDir>/guards/$1',
  },
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};

module.exports = config;
