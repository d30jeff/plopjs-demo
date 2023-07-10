/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
  preset: 'ts-jest',
  moduleNameMapper: {
    '^@controllers/(.*)': '<rootDir>/src/controllers/$1',
    '^@dtos/(.*)': '<rootDir>/src/dtos/$1',
    '^@enums/(.*)': '<rootDir>/src/enums/$1',
    '^@exceptions/(.*)': '<rootDir>/src/exceptions/$1',
    '^@interfaces/(.*)': '<rootDir>/src/interfaces/$1',
    '^@middlewares/(.*)': '<rootDir>/src/middlewares/$1',
    '^@providers/(.*)': '<rootDir>/src/providers/$1',
    '^@queues/(.*)': '<rootDir>/src/queues/$1',
    '^@responses/(.*)': '<rootDir>/src/responses/$1',
    '^@repositories/(.*)': '<rootDir>/src/repositories/$1',
    '^@selects/(.*)': '<rootDir>/src/selects/$1',
    '^@shared/(.*)': '<rootDir>/src/shared/$1',
    '^@servers/(.*)': '<rootDir>/src/servers/$1',
    '^@services/(.*)': '<rootDir>/src/services/$1',
    '^@test/(.*)': '<rootDir>/src/test/$1',
    '^@utils/(.*)': '<rootDir>/src/utils/$1',
  },
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  testTimeout: 15000,
};
