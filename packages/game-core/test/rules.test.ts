import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import fc from 'fast-check';
import {
  createV1RuleSet,
  getRuleSignatures,
  validateRuleSetSchema,
} from '../src/index.js';
import type { RuleSet } from '../src/index.js';

// Mutable JSON is intentional at the untrusted-input boundary.
function input() {
  return JSON.parse(JSON.stringify(createV1RuleSet()));
}
function change(path: string, value: unknown) {
  const rules = input();
  const keys = path.split('.');
  let target = rules;
  for (const key of keys.slice(0, -1)) target = target[key];
  target[keys[keys.length - 1]!] = value;
  return rules;
}
const options = { numRuns: 1000, seed: 20261103 };

describe('AT-02-01 AT-02-02 AT-28-01 schema validation', () => {
  test.each([null, [], true, 'rules', 1, new Date(), undefined])(
    'rejects non-JSON-object input %s',
    (value) => {
      expect(validateRuleSetSchema(value)).toEqual({
        status: 'invalid',
        issues: [{ code: 'INVALID_SHAPE', path: '$' }],
      });
    },
  );
  test.each([
    undefined,
    null,
    '1',
    false,
    0,
    -1,
    1.5,
    NaN,
    Infinity,
    -Infinity,
  ])('rejects invalid version %s', (schemaVersion) => {
    expect(validateRuleSetSchema({ schemaVersion })).toMatchObject({
      status: 'invalid',
    });
  });
  test('recognizes future versions before v1 shape checks', () => {
    expect(
      validateRuleSetSchema({ schemaVersion: 2, futureField: true }),
    ).toEqual({ status: 'unsupported', reason: 'schema-version' });
    expect(validateRuleSetSchema({})).toMatchObject({ status: 'invalid' });
    expect(validateRuleSetSchema(Object.create(null))).toMatchObject({
      status: 'invalid',
    });
  });
  test.each(['', 'board', 'fleet.0', 'turn', 'turn.quota', 'information'])(
    'rejects unknown keys at %s',
    (path) => {
      const rules = input();
      let object = rules;
      for (const key of path ? path.split('.') : []) object = object[key];
      object.future = true;
      expect(validateRuleSetSchema(rules)).toEqual({
        status: 'invalid',
        issues: [
          {
            code: 'INVALID_SHAPE',
            path:
              '$' + (path ? '.' + path.replace('.0', '[0]') : '') + '.future',
          },
        ],
      });
    },
  );
  test.each([
    'board',
    'board.rows',
    'fleet.0.nameKey',
    'turn.quota.count',
    'information.hit',
    'startingPlayer',
  ])('rejects missing %s', (path) => {
    const rules = input();
    const keys = path.split('.');
    let object = rules;
    for (const key of keys.slice(0, -1)) object = object[key];
    delete object[keys[keys.length - 1]!];
    expect(validateRuleSetSchema(rules)).toMatchObject({
      status: 'invalid',
      issues: [{ code: 'INVALID_SHAPE' }],
    });
  });
  test.each([
    ['board', null],
    ['fleet', {}],
    ['fleet', [null]],
    ['fleet', new Array(1)],
    ['board.rows', '10'],
    ['turn.extraShotOnHit', 1],
    ['fleet.0.length', '5'],
    ['turn.quota', null],
    ['information', []],
    ['fleet.0.id', 2],
  ])('rejects wrong shape %s', (path, value) => {
    expect(validateRuleSetSchema(change(path as string, value))).toMatchObject({
      status: 'invalid',
      issues: [{ code: 'INVALID_SHAPE' }],
    });
  });
  test.each([
    ['board.rows', 1],
    ['board.cols', 27],
    ['board.rows', 2.5],
    ['board.rows', NaN],
    ['board.cols', Infinity],
    ['fleet', []],
    [
      'fleet',
      Array.from({ length: 33 }, (_, i) => ({
        id: `s${i}`,
        nameKey: 'ships.s',
        length: 1,
      })),
    ],
    ['fleet.0.id', 'A'],
    ['fleet.0.id', 'a'.repeat(33)],
    ['fleet.0.id', 'a\n'],
    ['fleet.0.nameKey', 'carrier'],
    ['fleet.0.nameKey', 'ships.a'.repeat(9)],
    ['fleet.0.length', 0],
    ['fleet.0.length', 1.1],
    ['fleet.0.length', Infinity],
    ['contactRule', 'none'],
    ['startingPlayer', 'player-3'],
    ['information.hit', 'ship-cells'],
    ['information.sunk', 'none'],
    ['turn.policyId', 'Fixed'],
    ['turn.policyVersion', 0],
    ['turn.policyVersion', 2147483648],
    ['turn.quota.kind', 'unknown'],
    ['turn.quota.count', 0],
    ['turn.quota.count', 101],
    ['turn.quota.count', 1.5],
  ])('rejects invalid value %s=%s', (path, value) => {
    const rules = change(path as string, value);
    if (path === 'turn.quota.kind') delete rules.turn.quota.count;
    expect(validateRuleSetSchema(rules)).toMatchObject({
      status: 'invalid',
      issues: [{ code: 'INVALID_VALUE' }],
    });
  });
  test.each([
    ['salvo', 1],
    ['fixed', 2],
    ['fixed', 2147483647],
  ])('reports unsupported %s@%s', (policyId, policyVersion) => {
    const rules = input();
    rules.turn.policyId = policyId;
    rules.turn.policyVersion = policyVersion;
    expect(validateRuleSetSchema(rules)).toEqual({
      status: 'unsupported',
      reason: 'turn-policy',
    });
  });
  test('distinguishes reserved quota, unknown policy, inconsistent known policy and bad input', () => {
    const rules = input();
    rules.turn.quota = { kind: 'own-afloat' };
    expect(validateRuleSetSchema(rules)).toEqual({
      status: 'invalid',
      issues: [{ code: 'INCONSISTENT_TURN_CONFIG', path: '$.turn.quota' }],
    });
    rules.turn.policyId = 'salvo';
    expect(validateRuleSetSchema(rules)).toEqual({
      status: 'unsupported',
      reason: 'turn-policy',
    });
    rules.turn.quota.count = 1;
    expect(validateRuleSetSchema(rules)).toMatchObject({
      status: 'invalid',
      issues: [{ code: 'INVALID_SHAPE' }],
    });
    delete rules.turn.quota.count;
    rules.fleet[0].id = '!';
    expect(validateRuleSetSchema(rules)).toMatchObject({
      status: 'invalid',
      issues: [{ code: 'INVALID_VALUE' }],
    });
  });
  test('reports duplicate IDs and necessary geometric bounds', () => {
    expect(validateRuleSetSchema(change('fleet.1.id', 'carrier'))).toEqual({
      status: 'invalid',
      issues: [{ code: 'DUPLICATE_SHIP_ID', path: '$.fleet[1].id' }],
    });
    expect(validateRuleSetSchema(change('fleet.0.length', 11))).toEqual({
      status: 'invalid',
      issues: [{ code: 'SHIP_TOO_LONG', path: '$.fleet[0].length' }],
    });
    expect(
      validateRuleSetSchema(change('board', { rows: 2, cols: 5 })),
    ).toEqual({
      status: 'invalid',
      issues: [{ code: 'FLEET_TOO_LARGE', path: '$.fleet' }],
    });
    const rules = change('fleet.0.length', 11);
    rules.turn.policyId = 'future';
    expect(validateRuleSetSchema(rules)).toMatchObject({
      status: 'unsupported',
    });
  });
  test.each([2, 26])(
    'accepts boundary board size %s without claiming placement',
    (size) => {
      const rules = input();
      rules.board = { rows: size, cols: size };
      rules.fleet = [
        {
          id: 'a'.repeat(32),
          nameKey: 'ships.' + 'a'.repeat(32),
          length: size,
        },
      ];
      rules.turn.quota.count = size * size;
      expect(validateRuleSetSchema(rules)).toMatchObject({
        status: 'schema-valid',
      });
    },
  );
  test('accepts 32 ships and all supported enum choices', () => {
    const rules = input();
    rules.fleet = Array.from({ length: 32 }, (_, i) => ({
      id: `s${i}`,
      nameKey: 'ships.s',
      length: 1,
    }));
    for (const contactRule of ['allow', 'no-orthogonal', 'no-touch'])
      for (const hit of ['hit-only', 'ship-type'])
        for (const sunk of ['sunk-only', 'ship-type', 'ship-cells'])
          for (const startingPlayer of ['random', 'player-1', 'player-2']) {
            Object.assign(rules, {
              contactRule,
              information: { hit, sunk },
              startingPlayer,
            });
            expect(validateRuleSetSchema(rules)).toMatchObject({
              status: 'schema-valid',
            });
          }
  });
  test('does not claim a witness for a geometrically impossible fleet', () => {
    const rules = input();
    rules.board = { rows: 2, cols: 2 };
    rules.contactRule = 'no-touch';
    rules.fleet = [
      { id: 'a', nameKey: 'ships.a', length: 2 },
      { id: 'b', nameKey: 'ships.b', length: 2 },
    ];
    const result = validateRuleSetSchema(rules);
    expect(result.status).toBe('schema-valid');
    expect(result).not.toHaveProperty('witness');
  });
  test('leaves frozen input unchanged and returns independent rule data', () => {
    const rules = input();
    const before = JSON.stringify(rules);
    function freeze(value: object) {
      Object.values(value)
        .filter((v) => typeof v === 'object' && v !== null)
        .forEach(freeze);
      Object.freeze(value);
    }
    freeze(rules);
    const result = validateRuleSetSchema(rules);
    expect(JSON.stringify(rules)).toBe(before);
    if (result.status !== 'schema-valid')
      throw new Error('Expected schema-valid');
    expect(result.rules).toEqual(rules);
    expect(result.rules.board).not.toBe(rules.board);
    expect(result.rules.fleet[0]).not.toBe(rules.fleet[0]);
    expect(result.rules.turn.quota).not.toBe(rules.turn.quota);
    expect(result.rules.information).not.toBe(rules.information);
  });
  test('rejects arbitrary JSON or produces a stable normalized schema result', () => {
    fc.assert(
      fc.property(fc.jsonValue(), (value) => {
        const result = validateRuleSetSchema(value);
        if (result.status === 'schema-valid')
          expect(validateRuleSetSchema(result.rules)).toEqual(result);
        else expect(['invalid', 'unsupported']).toContain(result.status);
      }),
      options,
    );
  });
});

describe('AT-02-03 signatures and v1 choices', () => {
  test('matches independently stored canonical classic strings', () => {
    const expected = JSON.parse(
      readFileSync(
        new URL('./fixtures/classic-signatures.json', import.meta.url),
        'utf8',
      ),
    );
    expect(getRuleSignatures(createV1RuleSet())).toEqual(expected);
  });
  test('produces exactly four rule and two strategy signatures', () => {
    const results = (['allow', 'no-touch'] as const).flatMap((contact) =>
      [false, true].map((extra) =>
        validateRuleSetSchema(createV1RuleSet(contact, extra)),
      ),
    );
    const signatures = results.map((result) => {
      if (result.status !== 'schema-valid')
        throw new Error('Expected schema-valid');
      return result.signatures;
    });
    expect(new Set(signatures.map((s) => s.rulesSignature)).size).toBe(4);
    expect(new Set(signatures.map((s) => s.strategySignature)).size).toBe(2);
    expect(createV1RuleSet()).toEqual(createV1RuleSet('allow', false));
    expect(createV1RuleSet().fleet).not.toBe(createV1RuleSet().fleet);
  });
  test('preserves signatures across fleet/key order and presentation changes (RULE-14)', () => {
    const original = createV1RuleSet();
    fc.assert(
      fc.property(
        fc.shuffledSubarray([...original.fleet], {
          minLength: 5,
          maxLength: 5,
        }),
        fc.integer({ min: 0, max: 999999 }),
        (fleet, suffix) => {
          const reordered = Object.fromEntries(
            Object.entries(original).reverse(),
          ) as unknown as RuleSet;
          const changed = {
            ...reordered,
            board: { cols: 10, rows: 10 },
            fleet: fleet.map((ship) => ({
              length: ship.length,
              nameKey: `ships.label-${suffix}`,
              id: ship.id,
            })),
          };
          expect(getRuleSignatures(changed)).toEqual(
            getRuleSignatures(original),
          );
          expect(changed.fleet.map((s) => s.id)).toEqual(
            fleet.map((s) => s.id),
          );
        },
      ),
      options,
    );
  });
  test('changes only the full signature for turn and starter choices (RULE-15)', () => {
    const original = createV1RuleSet();
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 100 }),
        fc.boolean(),
        fc.constantFrom('random', 'player-1', 'player-2'),
        (count, extraShotOnHit, startingPlayer) => {
          const changed = {
            ...original,
            startingPlayer,
            turn: {
              ...original.turn,
              extraShotOnHit,
              quota: { kind: 'fixed', count },
            },
          } as RuleSet;
          const signatures = getRuleSignatures(changed);
          expect(signatures.strategySignature).toBe(
            getRuleSignatures(original).strategySignature,
          );
          expect(signatures.rulesSignature).not.toBe(
            getRuleSignatures(original).rulesSignature,
          );
          expect(validateRuleSetSchema(changed).status).toBe('schema-valid');
        },
      ),
      options,
    );
  });
  test.each([
    ['board.rows', 11],
    ['board.cols', 11],
    ['fleet.0.id', 'aircraft-carrier'],
    ['fleet.0.length', 4],
    ['contactRule', 'no-touch'],
    ['contactRule', 'no-orthogonal'],
    ['information.hit', 'ship-type'],
    ['information.sunk', 'ship-cells'],
  ])(
    'changes both signatures for semantic field %s (RULE-16)',
    (path, value) => {
      const before = getRuleSignatures(createV1RuleSet());
      const after = getRuleSignatures(change(path as string, value));
      expect(after.rulesSignature).not.toBe(before.rulesSignature);
      expect(after.strategySignature).not.toBe(before.strategySignature);
    },
  );
  test('serializes reserved quota data deterministically without claiming support', () => {
    const rules = input();
    rules.turn = {
      policyId: 'salvo',
      policyVersion: 1,
      quota: { kind: 'own-afloat' },
      extraShotOnHit: false,
    };
    expect(getRuleSignatures(rules).rulesSignature).toContain(
      '"quota":{"kind":"own-afloat"}',
    );
    expect(validateRuleSetSchema(rules).status).toBe('unsupported');
  });
});
