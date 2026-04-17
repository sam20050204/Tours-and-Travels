module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/client/'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  transform: {},
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/routes/**/__tests__/**/*.test.js',
    '**/models/**/__tests__/**/*.test.js'
  ]
};