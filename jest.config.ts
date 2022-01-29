/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  clearMocks: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',

  // A list of reporter names that Jest uses when writing coverage reports
  // coverageReporters: [
  //   "json",
  //   "text",
  //   "lcov",
  //   "clover"
  // ],

  // A path to a module which exports an async function that is triggered once before all test suites
  // globalSetup: undefined,

  // A set of global variables that need to be available in all test environments
  // globals: {},

  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  // moduleNameMapper: {},

  // An array of regexp pattern strings, matched against all module paths before considered 'visible' to the module loader
  // modulePathIgnorePatterns: [],

  // A preset that is used as a base for Jest's configuration
  preset: 'ts-jest',

  testMatch: ['**/src/**/?(*.)+(spec|test).[jt]s?(x)'],

  collectCoverageFrom: ['**/*.{ts,tsx}', '!**/node_modules/**', '!**/dist/**'],

  // coveragePathIgnorePatterns: [
  //   '**/engineInstance.*',
  // ],

  // testPathIgnorePatterns: [
  //   '/node_modules/',
  //   '**/node_modules/',
  //   '**/engineInstance.ts',
  // ],

  // Use this configuration option to add custom reporters to Jest
  // reporters: undefined,

  // The root directory that Jest should scan for tests and modules within
  // rootDir: undefined,

  // A list of paths to directories that Jest should use to search for files in
  // roots: [
  //   "<rootDir>"
  // ],

  // The paths to modules that run some code to configure or set up the testing environment before each test
  // setupFiles: [],

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  // setupFilesAfterEnv: [],

  // The test environment that will be used for testing
  // testEnvironment: "jest-environment-node",

  // Options that will be passed to the testEnvironment
  // testEnvironmentOptions: {},

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  // testPathIgnorePatterns: [
  //   "/node_modules/"
  // ],

  // A map from regular expressions to paths to transformers
  // transform: undefined,

  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  // transformIgnorePatterns: [
  //   "/node_modules/",
  //   "\\.pnp\\.[^\\/]+$"
  // ],
};
