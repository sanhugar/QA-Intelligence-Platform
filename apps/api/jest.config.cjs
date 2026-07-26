/** @type {import('jest').Config} */
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: 'src/.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  transformIgnorePatterns: ['/node_modules/(?!(.pnpm/)?jose)'],
  moduleNameMapper: {
    '^@ati/auth$': '<rootDir>/../../packages/auth/src',
    '^@ati/context$': '<rootDir>/../../packages/context/src',
    '^@ati/errors$': '<rootDir>/../../packages/errors/src',
    '^@ati/shared-types$': '<rootDir>/../../packages/shared-types/src',
    '^@ati/shared-constants$': '<rootDir>/../../packages/shared-constants/src',
    '^@ati/shared-utils$': '<rootDir>/../../packages/shared-utils/src',
    '^@ati/shared-validation$': '<rootDir>/../../packages/shared-validation/src',
    '^@ati/config$': '<rootDir>/../../packages/config/src',
    '^@ati/logger$': '<rootDir>/../../packages/logger/src',
    '^@ati/observability$': '<rootDir>/../../packages/observability/src',
    '^@ati/requirement-engine$': '<rootDir>/../../packages/requirement-engine/src',
    '^@ati/intake$': '<rootDir>/../../packages/intake/src',
    '^@ati/classification$': '<rootDir>/../../packages/classification/src',
  },
};
