import {
  cpSync,
  mkdtempSync,
  mkdirSync,
  rmSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { expect, test } from 'vitest';

test('AT-24-02: masterprompt guard rejects even a trailing byte change', () => {
  const directory = mkdtempSync(join(tmpdir(), 'sinktheship-prompt-'));
  try {
    mkdirSync(join(directory, 'scripts'));
    mkdirSync(join(directory, 'docs'));
    for (const path of [
      'scripts/check-masterprompt.mjs',
      'scripts/masterprompt.sha256',
      'docs/00-masterprompt.md',
    ]) {
      cpSync(path, join(directory, path));
    }
    const run = () =>
      spawnSync(process.execPath, ['scripts/check-masterprompt.mjs'], {
        cwd: directory,
        encoding: 'utf8',
      });
    const clean = run();
    expect(clean.error).toBeUndefined();
    expect(clean.status).toBe(0);
    const path = join(directory, 'docs/00-masterprompt.md');
    writeFileSync(path, readFileSync(path, 'utf8') + '\n');
    const changed = run();
    expect(changed.error).toBeUndefined();
    expect(changed.status).toBe(1);
    expect(changed.stderr).toContain('original masterprompt changed');
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
