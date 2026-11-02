import { mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const directory = resolve('.artifacts/retry-probe');
await mkdir(directory, { recursive: true });
await writeFile(
  `${directory}/probe.spec.ts`,
  `
import { test, expect } from '@playwright/test';
test('diagnostic retry cannot turn the first failure green', async ({ page }, testInfo) => {
  await page.goto('data:text/html,<title>Retry probe</title>');
  expect(testInfo.retry).toBe(1);
});
`,
);
await writeFile(
  `${directory}/playwright.config.ts`,
  `
import base from '../../playwright.config.ts';
export default {
  ...base,
  testDir: '.',
  testMatch: 'probe.spec.ts',
  webServer: [],
  projects: [{ name: 'retry-probe', use: { browserName: 'chromium' } }],
  retries: 1,
  workers: 1,
  outputDir: './results',
  reporter: [['json', { outputFile: './report.json' }]],
};
`,
);
await rm(`${directory}/report.json`, { force: true });
const result = spawnSync(
  'pnpm',
  [
    'exec',
    'playwright',
    'test',
    '--config',
    `${directory}/playwright.config.ts`,
  ],
  {
    cwd: process.cwd(),
    encoding: 'utf8',
  },
);
await writeFile(
  `${directory}/command.log`,
  `${result.stdout ?? ''}${result.stderr ?? ''}`,
);
const report = JSON.parse(await readFile(`${directory}/report.json`, 'utf8'));
const test = report.suites[0]?.specs[0]?.tests[0];
if (
  result.status !== 1 ||
  test?.status !== 'flaky' ||
  test.results.length !== 2 ||
  test.results[0].status !== 'failed' ||
  test.results[1].status !== 'passed'
) {
  throw new Error(`Retry policy probe failed; inspect ${directory}`);
}
if (
  !test.results[0].attachments.some((item) => item.name === 'screenshot') ||
  !test.results[1].attachments.some((item) => item.name === 'trace')
) {
  throw new Error('Retry diagnostics are missing screenshot or trace');
}
console.log(
  'Retry policy verified: first failure + passing retry exits 1, with screenshot and trace.',
);
