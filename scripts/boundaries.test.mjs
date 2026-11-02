import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  cpSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
  rmSync,
  existsSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join, basename } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const graph = JSON.parse(
  readFileSync(join(root, 'scripts/package-graph.json')),
);
const packageRoot = (name) =>
  name === 'web' ? 'apps/web' : `packages/${name}`;

test('AT-20-03 / AT-24-01: isolated workspace boundary fixtures', async (t) => {
  const sandbox = mkdtempSync(join(tmpdir(), 'sinktheship-boundaries-'));
  const run = (command, args, directory = sandbox) => {
    const result = spawnSync(command, args, {
      cwd: directory,
      encoding: 'utf8',
      timeout: 120_000,
    });
    assert.ifError(result.error);
    return { status: result.status, output: result.stdout + result.stderr };
  };
  const success = (command, args, directory) => {
    const result = run(command, args, directory);
    assert.equal(result.status, 0, result.output);
    return result;
  };
  const edit = (changes, action) => {
    const originals = Object.keys(changes).map((path) => [
      path,
      existsSync(join(sandbox, path))
        ? readFileSync(join(sandbox, path))
        : null,
    ]);
    try {
      for (const [path, content] of Object.entries(changes))
        writeFileSync(join(sandbox, path), content);
      action();
    } finally {
      for (const [path, content] of originals) {
        if (content === null) rmSync(join(sandbox, path));
        else writeFileSync(join(sandbox, path), content);
      }
    }
  };
  const rejected = (changes, command, args, diagnostic) =>
    edit(changes, () => {
      const result = run(command, args);
      assert.notEqual(result.status, 0, result.output);
      assert.match(result.output, diagnostic);
    });
  const probe = (name, source, diagnostic) => {
    const directory = packageRoot(name);
    const changes = {
      [`${directory}/src/probe.ts`]: source,
      [`${directory}/tsconfig.probe.json`]: JSON.stringify({
        extends: './tsconfig.json',
        compilerOptions: {
          composite: false,
          incremental: false,
          declaration: false,
          declarationMap: false,
          emitDeclarationOnly: false,
          noEmit: true,
        },
        files: ['src/probe.ts'],
        include: [],
        references: [],
      }),
    };
    const args = ['exec', 'tsc', '-p', `${directory}/tsconfig.probe.json`];
    if (diagnostic) rejected(changes, 'pnpm', args, diagnostic);
    else edit(changes, () => success('pnpm', args));
  };
  try {
    for (const path of [
      'package.json',
      'pnpm-lock.yaml',
      'pnpm-workspace.yaml',
      'tsconfig.json',
      '.dependency-cruiser.cjs',
      'scripts',
      'packages',
      'apps',
    ]) {
      cpSync(join(root, path), join(sandbox, path), {
        recursive: true,
        filter: (path) =>
          !['node_modules', 'dist', '.artifacts'].includes(basename(path)),
      });
    }
    // Abort immediately if setup fails; negative tests need a working compiler.
    success('pnpm', ['install', '--frozen-lockfile']);
    success('pnpm', ['build']);
    await t.test('every public package root loads at runtime', () => {
      for (const name of Object.keys(graph).filter((name) => name !== 'web')) {
        success(
          'node',
          [
            '--input-type=module',
            '-e',
            `await import(${JSON.stringify('@sinktheship/' + name)})`,
          ],
          join(sandbox, packageRoot(name)),
        );
      }
    });
    await t.test('all permitted edges compile through package exports', () => {
      for (const [name, targets] of Object.entries(graph)) {
        probe(
          name,
          targets
            .map((target) => `import {} from '@sinktheship/${target}';`)
            .join('\n') + '\nexport {};',
        );
      }
    });
    await t.test('all permitted edges pass graph validation', () => {
      const changes = Object.fromEntries(
        Object.entries(graph).map(([name, targets]) => [
          packageRoot(name) + '/src/probe.ts',
          targets
            .map((target) => `import {} from '@sinktheship/${target}';`)
            .join('\n') + '\nexport {};',
        ]),
      );
      edit(changes, () => success('pnpm', ['check:boundaries']));
    });
    await t.test('configuration exports load', () => {
      success('node', [
        '--input-type=module',
        '-e',
        `import {createRequire} from 'node:module'; const require=createRequire(new URL('./packages/eslint-config/package.json',import.meta.url)); for(const name of ['base','pure','node','browser']) require('@sinktheship/tsconfig/'+name+'.json'); await import('./packages/eslint-config/base.js');`,
      ]);
    });
    for (const specifier of [
      '@sinktheship/game-core/src/index.js',
      '@sinktheship/game-core/dist/index.js',
    ]) {
      await t.test(`compiler rejects ${specifier}`, () =>
        probe('opponents', `import {} from '${specifier}';`, /TS2307/),
      );
    }
    await t.test('runtime rejects deep package imports', () => {
      const result = run('node', [
        '--input-type=module',
        '-e',
        `import {createRequire} from 'node:module'; const require=createRequire(new URL('./packages/opponents/package.json',import.meta.url)); require.resolve('@sinktheship/game-core/dist/index.js');`,
      ]);
      assert.notEqual(result.status, 0);
      assert.match(result.output, /ERR_PACKAGE_PATH_NOT_EXPORTED/);
    });
    for (const [label, name, source, diagnostic] of [
      [
        'pure core has no DOM',
        'game-core',
        'document.createElement("div");',
        /TS2584/,
      ],
      ['pure core has no Node', 'game-core', 'process.cwd();', /TS2591/],
      [
        'pure core has no timers',
        'game-core',
        'setTimeout(() => {}, 1);',
        /TS2304/,
      ],
      [
        'strict null checks',
        'game-core',
        'const value: string = null; export { value };',
        /TS2322/,
      ],
      ['browser has DOM', 'ui', 'document.createElement("div");'],
      ['browser has no ambient Node', 'ui', 'process.cwd();', /TS2591/],
      ['Node has process', 'benchmark', 'process.cwd();'],
      [
        'Node has no DOM',
        'benchmark',
        'document.createElement("div");',
        /TS2584/,
      ],
    ])
      await t.test(label, () => probe(name, source, diagnostic));

    for (const [label, path, source, diagnostic] of [
      [
        'relative import',
        'packages/opponents/src/probe.ts',
        'import {} from "../../game-core/src/index.js";',
        /cross-package-relative/,
      ],
      [
        'deep import',
        'packages/opponents/src/probe.ts',
        'import {} from "@sinktheship/game-core/dist/index.js";',
        /deep-import/,
      ],
      [
        'type import expression',
        'packages/opponents/src/probe.ts',
        'type X = typeof import("@sinktheship/game-core/dist/index.js");',
        /deep-import/,
      ],
      [
        'reverse edge',
        'packages/opponents/src/probe.ts',
        'import {} from "@sinktheship/game-session";',
        /package-dag/,
      ],
      [
        'UI domain import',
        'packages/ui/src/probe.ts',
        'import {} from "@sinktheship/game-core";',
        /package-dag/,
      ],
      [
        'React in core',
        'packages/game-core/src/probe.ts',
        'import {} from "react";',
        /core-runtime-import/,
      ],
      [
        'Node import in core',
        'packages/game-core/src/probe.ts',
        'import {} from "node:fs";',
        /core-runtime-import/,
      ],
      [
        'nonliteral import',
        'packages/opponents/src/probe.ts',
        'const name="x"; import(name);',
        /dynamic-import/,
      ],
    ])
      await t.test(label, () =>
        rejected(
          { [path]: source },
          'node',
          ['scripts/check-boundaries.mjs'],
          diagnostic,
        ),
      );

    for (const field of [
      'dependencies',
      'peerDependencies',
      'optionalDependencies',
    ]) {
      await t.test(`core rejects ${field}`, () => {
        const path = 'packages/game-core/package.json';
        const manifest = JSON.parse(readFileSync(join(sandbox, path)));
        manifest[field] = { react: '19.3.1' };
        rejected(
          { [path]: JSON.stringify(manifest) },
          'node',
          ['scripts/check-boundaries.mjs'],
          /core-runtime-dependency/,
        );
      });
    }
    await t.test('type-only cycles are rejected', () =>
      rejected(
        {
          'packages/game-core/src/cycle-a.ts':
            'import type { B } from "./cycle-b.js"; export interface A { b: B }',
          'packages/game-core/src/cycle-b.ts':
            'import type { A } from "./cycle-a.js"; export interface B { a: A }',
        },
        'pnpm',
        [
          'exec',
          'depcruise',
          '--config',
          '.dependency-cruiser.cjs',
          'packages/game-core/src',
        ],
        /no-cycles-including-types/,
      ),
    );
    await t.test('valid graph still passes after negative fixtures', () =>
      success('pnpm', ['check:boundaries']),
    );
  } finally {
    rmSync(sandbox, { recursive: true, force: true });
  }
});
