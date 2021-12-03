export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  coveragePathIgnorePatterns: [
    'testingUtils.ts',
    'interfaces.ts',
    'inlineStyles.compressed.ts',
  ],
};
