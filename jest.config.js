module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",

  // List of reporter names Jest uses when writing coverage reports
  coverageReporters: ["cobertura", "lcov", "text"],

  // The maximum amount of workers used to run your tests
  maxWorkers: "50%",

  // Paths to directories Jest should use to search for files
  roots: ["test"],

  // Test environment to use
  testEnvironment: "node",

  // Regex pattern Jest uses to detect test files
  testRegex: ["/test/.*\\.(test|spec)?\\.(ts|tsx|js|jsx)$"],

  // Transform files before testing
  transform: {
      "^.+\\.ts?$": ["babel-jest"], // Ensure babel-jest and babel are properly configured
  },

  // Additional options
  // testEnvironmentOptions: {}, // Uncomment and configure if needed
};
