const config = {
  verbose: true,
  testEnvironment: 'node',
  testMatch: ['<rootDir>/../backend_tests/*.test.js'],
  testTimeout: 10000,
  extensionsToTreatAsEsm: ['.js'],
  moduleNameMapper: {
    '^(\.{1,2}/.*)\.js$': '$1',
  },
  testEnvironmentOptions: {
    NODE_ENV: 'test'
  }
};

export default config;
