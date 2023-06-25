// Add any custom config to be passed to Jest
const customJestConfig = {
    setupFilesAfterEnv: ['./jest.setup.js'],
    testEnvironment: 'jest-environment-jsdom',
    modulePathIgnorePatterns: ['utils.ts'],
};

module.exports = customJestConfig;
