module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  globals: {
    transform: {
      tsconfig: './tsconfig.json',
    },
  },
};
