import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, test } from 'vitest';
import { build } from 'vite';
import { inspectProduction, productionGuard } from '../production-guard.mjs';

test('artifact inspection rejects leaked fixture markers', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'sts-artifact-'));
  try {
    await expect(inspectProduction(dir)).rejects.toThrow('empty');
    await writeFile(join(dir, 'index.html'), '<main>Production</main>');
    expect(await inspectProduction(dir)).toBe(1);
    await writeFile(
      join(dir, 'bundle.js'),
      'const id = "STS_TEST_ONLY_TRANSCRIPT_V1";',
    );
    await expect(inspectProduction(dir)).rejects.toThrow('marker');
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('production bundler rejects fixture imports even when tree-shaken', async () => {
  await expect(
    build({
      configFile: false,
      logLevel: 'silent',
      plugins: [productionGuard()],
      build: {
        write: false,
        lib: { entry: 'tests/fixtures/session.mjs', formats: ['es'] },
      },
    }),
  ).rejects.toThrow('Test module in production graph');
});
