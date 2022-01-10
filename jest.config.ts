export default {
    displayName: 'root-tests',
    testMatch: ['<rootDir>/src/**/*.spec.ts'],
    testEnvironment: 'node',
    bail: true,
    clearMocks: true,
    moduleNameMapper: {
        '@src/(.*)': '<rootDir>/src/$1',
        '@test/(.*)': '<rootDir>/test/$1',
    },
    preset: 'ts-jest',
};
