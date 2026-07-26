/** @type {import('jest').Config} */
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@ati/shared-constants$': '<rootDir>/../../shared-constants/src',
    '^@ati/shared-types$': '<rootDir>/../../shared-types/src',
  },
};
