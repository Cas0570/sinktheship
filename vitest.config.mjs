import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    passWithNoTests: false,
    coverage: {
      enabled: true,
      provider: 'v8',
      include: ['packages/game-core/src/**/*.ts'],
      exclude: [
        'packages/game-core/src/rules.ts',
        'packages/game-core/src/index.ts',
      ],
      reportsDirectory: '.artifacts/coverage',
      reporter: ['text', 'json-summary', 'html'],
      thresholds: { statements: 90, lines: 90, functions: 90, branches: 85 },
    },
    allowOnly: false,
    reporters: ['default', 'junit'],
    outputFile: { junit: '.artifacts/vitest.xml' },
    projects: [
      {
        test: {
          name: 'component',
          environment: 'jsdom',
          include: ['tests/component/**/*.test.mjs'],
          setupFiles: ['tests/component/setup.mjs'],
        },
      },
      {
        test: {
          name: 'node',
          environment: 'node',
          include: [
            'packages/*/test/**/*.test.{ts,mjs}',
            'scripts/test/**/*.test.{ts,mjs}',
          ],
        },
      },
    ],
  },
});
