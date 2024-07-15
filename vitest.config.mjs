import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 10000,
    environment: 'node',
    include: ['src/**/*.test.{js,mjs,ts}']
  },
});
