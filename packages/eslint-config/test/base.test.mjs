import { ESLint } from 'eslint';
import { describe, expect, test } from 'vitest';

const eslint = new ESLint();
async function rules(source, filePath) {
  const [result] = await eslint.lintText(source, { filePath });
  expect(result.fatalErrorCount).toBe(0);
  return result.messages.map((message) => message.ruleId);
}

const core = 'packages/game-core/src/policy-fixture.ts';
const bot = 'packages/opponents/src/policy-fixture.ts';

describe('AT-20-03 / AT-24-02: shared lint policy', () => {
  test.each([
    ['Math.random()', 'no-restricted-properties'],
    ['Math["random"]()', 'no-restricted-syntax'],
    [
      '(() => { const math = Math; return math.random(); })()',
      'no-restricted-syntax',
    ],
    [
      '(() => { const { random } = Math; return random(); })()',
      'no-restricted-syntax',
    ],
    ['Date.now()', 'no-restricted-globals'],
    ['new Date()', 'no-restricted-globals'],
    ['globalThis.Math.random()', 'no-restricted-globals'],
    ['setTimeout(() => {}, 1)', 'no-restricted-globals'],
    ['fetch("https://example.invalid")', 'no-restricted-globals'],
    ['localStorage.getItem("game")', 'no-restricted-globals'],
    ['process.env', 'no-restricted-globals'],
  ])('rejects ambient core operation %s', async (expression, rule) => {
    expect(await rules(`export const value = ${expression};`, core)).toContain(
      rule,
    );
  });

  test('allows deterministic geometry and an injected random source', async () => {
    expect(
      await rules(
        'export const choose = (next: () => number) => Math.floor(next() * 10);',
        core,
      ),
    ).toEqual([]);
  });
  test('allows platform time at the composition boundary', async () => {
    expect(
      await rules(
        'export const now = () => Date.now();',
        'apps/web/src/adapters/clock.ts',
      ),
    ).toEqual([]);
  });

  test.each([
    [
      'export type { GameState } from "@sinktheship/game-core";',
      'no-restricted-imports',
    ],
    [
      'import type { GameState as State } from "@sinktheship/game-core"; export type { State };',
      'no-restricted-imports',
    ],
    [
      'export { applyCommand } from "@sinktheship/game-core";',
      'no-restricted-imports',
    ],
    [
      'import * as core from "@sinktheship/game-core"; export { core };',
      'no-restricted-syntax',
    ],
    ['export * from "@sinktheship/game-core";', 'no-restricted-syntax'],
    ['export * as core from "@sinktheship/game-core";', 'no-restricted-syntax'],
    [
      'export const load = () => import("@sinktheship/game-core");',
      'no-restricted-syntax',
    ],
    [
      'export type State = import("@sinktheship/game-core").GameState;',
      'no-restricted-syntax',
    ],
  ])('blocks private core access: %s', async (source, rule) => {
    expect(await rules(source, bot)).toContain(rule);
  });
  test('allows named public view types', async () => {
    expect(
      await rules(
        'export type { PlayerView, Coord } from "@sinktheship/game-core";',
        bot,
      ),
    ).toEqual([]);
  });
  test('also protects screen containers', async () => {
    expect(
      await rules(
        'export type { GameState } from "@sinktheship/game-core";',
        'apps/web/src/routes/game/index.ts',
      ),
    ).toContain('no-restricted-imports');
  });
  test('keeps session authority available to the session package', async () => {
    expect(
      await rules(
        'export type { GameState } from "@sinktheship/game-core";',
        'packages/game-session/src/session.ts',
      ),
    ).toEqual([]);
  });
  test('rejects explicit any in TypeScript', async () => {
    expect(
      await rules('export const identity = (value: any) => value;', core),
    ).toContain('@typescript-eslint/no-explicit-any');
  });
  test('rejects checkpoint imports in screens', async () => {
    expect(
      await rules(
        'export type { SessionCheckpoint } from "@sinktheship/game-session";',
        'apps/web/src/routes/game/index.ts',
      ),
    ).toContain('no-restricted-imports');
  });
  test('ignores generated assets globally', async () => {
    expect(
      await eslint.isPathIgnored('apps/web/dist/assets/generated.js'),
    ).toBe(true);
    expect(await eslint.isPathIgnored('.artifacts/example.js')).toBe(true);
  });
  test('reports unused suppressions', async () => {
    expect(
      await rules(
        '// eslint-disable-next-line no-debugger\nexport const value = 1;',
        core,
      ),
    ).toContain(null);
  });
});
