module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  transformIgnorePatterns: ['node_modules/(?!(uuid)/)'],
  // Mock uuid for tests
  moduleNameMapper: {
    '^uuid$': '<rootDir>/tests/__mocks__/uuid.js'
  }
};
