import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    passWithNoTests: false,
    allowOnly: false,
    reporters: ['default', 'junit'],
    outputFile: { junit: '.artifacts/vitest.xml' },
    projects: [
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
