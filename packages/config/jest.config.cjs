/** @type {import('jest').Config} */
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@ati/errors$': '<rootDir>/../../errors/src',
    '^@ati/shared-constants$': '<rootDir>/../../shared-constants/src',
    '^@ati/shared-types$': '<rootDir>/../../shared-types/src',
    '^@ati/shared-utils$': '<rootDir>/../../shared-utils/src',
    '^@ati/shared-validation$': '<rootDir>/../../shared-validation/src',
  },
};
