import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: true,
  retries: process.env.CI ? 1 : 0,
  failOnFlakyTests: true,
  workers: process.env.CI ? 2 : undefined,
  outputDir: '.artifacts/e2e/results',
  reporter: [
    ['list'],
    ['html', { outputFolder: '.artifacts/e2e/html', open: 'never' }],
    ['junit', { outputFile: '.artifacts/e2e/junit.xml' }],
  ],
  use: {
    baseURL: 'http://127.0.0.1:4174',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: (['chromium', 'firefox', 'webkit'] as const).flatMap(
    (browserName) =>
      [390, 1440].flatMap((width) =>
        ['en', 'nl'].map((locale) => ({
          name: `${browserName}-${width}-${locale}`,
          use: { browserName, viewport: { width, height: 900 }, locale },
        })),
      ),
  ),
  webServer: [
    {
      command:
        'pnpm build:test && pnpm exec vite preview --config tests/browser-app/vite.config.mjs --host 127.0.0.1 --port 4174 --strictPort',
      url: 'http://127.0.0.1:4174',
      reuseExistingServer: false,
    },
    {
      command:
        'pnpm build && pnpm --filter @sinktheship/web exec vite preview --host 127.0.0.1 --port 4173 --strictPort',
      url: 'http://127.0.0.1:4173',
      reuseExistingServer: false,
    },
  ],
});
