import rootConfig from '../jest.config';

export default {
  ...rootConfig,
  ...{
    displayName: 'end2end-tests',
    setupFilesAfterEnv: ['<rootDir>/jestSetup.ts'],
    moduleNameMapper: {
      '@src/(.*)': '<rootDir>/../src/$1',
      '@test/(.*)': '<rootDir>/$1',
    },
    testMatch: ['<rootDir>/**/*.spec.ts'],
  },
};
