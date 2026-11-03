import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import fc from 'fast-check';
import {
  createV1RuleSet,
  getShipCells,
  isWithinBoard,
  rotateShip,
  validatePlacement,
  validateRuleSet,
} from '../src/index.js';
import type { ContactRule, RuleSet, ShipPlacement } from '../src/index.js';

const options = { seed: 20261103, numRuns: 1000 };
const limits = { maxSearchNodes: 10000 };
function rules(
  lengths = [1, 1],
  size = 2,
  contactRule: ContactRule = 'allow',
): RuleSet {
  return {
    ...createV1RuleSet(),
    board: { rows: size, cols: size },
    contactRule,
    fleet: lengths.map((length, i) => ({
      id: String.fromCharCode(97 + i),
      nameKey: 'ships.test',
      length,
    })),
  };
}
function ship(
  shipId: string,
  row = 0,
  col = 0,
  orientation: ShipPlacement['orientation'] = 'horizontal',
): ShipPlacement {
  return { shipId, start: { row, col }, orientation };
}
const fixtures = JSON.parse(
  readFileSync(
    new URL('../../../fixtures/rules/placement.json', import.meta.url),
    'utf8',
  ),
) as {
  contacts: ContactRule[];
  cases: {
    id: string;
    lengths: number[];
    ids: string[];
    board: RuleSet['board'];
    ships: ShipPlacement[];
    expected: string[];
  }[];
};
for (const fixture of fixtures.cases) {
  test(`AT-02-02 AT-04-02 ${fixture.id}`, () => {
    fixtures.contacts.forEach((contactRule, index) => {
      const config = {
        ...rules(fixture.lengths),
        board: fixture.board,
        contactRule,
        fleet: fixture.lengths.map((length, i) => ({
          id: fixture.ids[i]!,
          nameKey: 'ships.test',
          length,
        })),
      };
      const result = validatePlacement(config, { ships: fixture.ships });
      expect(result.status === 'valid' ? 'valid' : result.issues[0]!.code).toBe(
        fixture.expected[index],
      );
    });
  });
}

test('RULE-01 all four released presets have independent checked witnesses at budget 1', () => {
  for (const contact of ['allow', 'no-touch'] as const)
    for (const extra of [false, true]) {
      const result = validateRuleSet(createV1RuleSet(contact, extra), {
        maxSearchNodes: 1,
      });
      expect(result.status).toBe('valid');
      if (result.status !== 'valid') throw new Error('Expected witness');
      expect(result.witness.ships).toEqual(fixtures.cases[0]!.ships);
      expect(validatePlacement(result.rules, result.witness).status).toBe(
        'valid',
      );
      expect(
        new Set(
          result.witness.ships
            .flatMap((s) =>
              getShipCells(
                s,
                result.rules.fleet.find((f) => f.id === s.shipId)!.length,
              ),
            )
            .map((c) => `${c.row},${c.col}`),
        ).size,
      ).toBe(17);
    }
});

test('partial drafts allow missing ships but still reject bad geometry', () => {
  expect(validatePlacement(rules(), { ships: [] }, false).status).toBe('valid');
  expect(validatePlacement(rules(), { ships: [ship('a')] }, false).status).toBe(
    'valid',
  );
  expect(
    validatePlacement(rules(), { ships: [ship('a'), ship('b')] }, false).status,
  ).toBe('invalid');
});

test.each([
  null,
  [],
  {},
  { ships: null },
  { ships: [], extra: 1 },
  { ships: [null] },
  { ships: [1] },
  { ships: [{ ...ship('a'), extra: 1 }] },
  { ships: [{ ...ship('a'), shipId: 1 }] },
  { ships: [{ ...ship('a'), start: null }] },
  { ships: [{ ...ship('a'), start: { row: 0 } }] },
])('rejects malformed placements %j', (value) => {
  expect(validatePlacement(rules(), value)).toMatchObject({
    status: 'invalid',
    issues: [{ code: 'INVALID_SHAPE' }],
  });
});
test.each([NaN, Infinity, -Infinity, 0.5, '0', null])(
  'rejects invalid coordinate %s',
  (value) => {
    for (const field of ['row', 'col'])
      expect(
        validatePlacement(rules([1]), {
          ships: [{ ...ship('a'), start: { row: 0, col: 0, [field]: value } }],
        }),
      ).toMatchObject({
        status: 'invalid',
        issues: [{ code: 'INVALID_COORDINATE' }],
      });
  },
);
test.each([-1, 2])('rejects out-of-board coordinate %s', (value) => {
  for (const field of ['row', 'col'])
    expect(
      validatePlacement(rules([1]), {
        ships: [{ ...ship('a'), start: { row: 0, col: 0, [field]: value } }],
      }),
    ).toMatchObject({ status: 'invalid', issues: [{ code: 'OUT_OF_BOUNDS' }] });
});
test('rejects invalid orientation and crossing ships', () => {
  expect(
    validatePlacement(rules([1]), {
      ships: [{ ...ship('a'), orientation: 'diagonal' }],
    }),
  ).toMatchObject({
    status: 'invalid',
    issues: [{ code: 'INVALID_ORIENTATION' }],
  });
  expect(
    validatePlacement(rules([3, 3], 3), {
      ships: [ship('a', 1, 0), ship('b', 0, 1, 'vertical')],
    }),
  ).toMatchObject({ status: 'invalid', issues: [{ code: 'OVERLAP' }] });
});
test('rotation at the edge fails without changing the accepted placement (RULE-02)', () => {
  const old = { ships: [ship('a', 1, 0)] };
  Object.freeze(old.ships[0]!.start);
  Object.freeze(old.ships[0]);
  Object.freeze(old.ships);
  Object.freeze(old);
  const config = rules([2]);
  expect(validatePlacement(config, old).status).toBe('valid');
  const proposal = { ships: [rotateShip(old.ships[0]!)] };
  expect(validatePlacement(config, proposal).status).toBe('invalid');
  expect(old).toEqual({ ships: [ship('a', 1, 0)] });
  const accepted = validatePlacement(config, old);
  if (accepted.status !== 'valid') throw new Error('Expected valid');
  expect(accepted.placement.ships[0]!.start).not.toBe(old.ships[0]!.start);
});
test.each([2, 26])('boundary %s and rectangular vertical-only fit', (size) => {
  const result = validateRuleSet(rules([size], size), limits);
  expect(result.status).toBe('valid');
  expect(
    validatePlacement(rules([size], size), {
      ships: [ship('a', 0, size - 1, 'vertical')],
    }).status,
  ).toBe('valid');
  const narrow = { ...rules([size], size), board: { rows: size, cols: 2 } };
  expect(validateRuleSet(narrow, limits).status).toBe('valid');
});
test('candidate accounting counts rejected nodes and exhaustion wins exactly at boundary (RULE-17/18)', () => {
  const impossible = rules([2, 2], 2, 'no-touch');
  expect(validateRuleSet(impossible, { maxSearchNodes: 19 }).status).toBe(
    'inconclusive',
  );
  expect(validateRuleSet(impossible, { maxSearchNodes: 20 })).toMatchObject({
    status: 'invalid',
    issues: [{ code: 'NO_VALID_PLACEMENT', path: '$.fleet' }],
  });
  // a at A1; b's A1 rejected; b's B1 accepted: three candidates.
  expect(validateRuleSet(rules(), { maxSearchNodes: 2 }).status).toBe(
    'inconclusive',
  );
  expect(validateRuleSet(rules(), { maxSearchNodes: 3 })).toMatchObject({
    status: 'valid',
    witness: { ships: [ship('a'), ship('b', 0, 1)] },
  });
  expect(validateRuleSet(rules([1]), { maxSearchNodes: 1 }).status).toBe(
    'valid',
  );
});
test('length then ASCII ordering is stable across fleet permutation', () => {
  const config = rules([1, 2, 1], 3);
  const a = validateRuleSet(config, limits);
  const b = validateRuleSet(
    { ...config, fleet: [...config.fleet].reverse() },
    limits,
  );
  expect(a.status).toBe('valid');
  expect(b.status).toBe('valid');
  if (a.status === 'valid' && b.status === 'valid') {
    expect(a.witness).toEqual(b.witness);
    expect(a.witness.ships.map((s) => s.shipId)).toEqual(['b', 'a', 'c']);
  }
});
test('schema errors remain distinct and invalid limits fail explicitly', () => {
  expect(validateRuleSet(null, limits).status).toBe('invalid');
  expect(validateRuleSet({ schemaVersion: 2 }, limits).status).toBe(
    'unsupported',
  );
  for (const maxSearchNodes of [
    0,
    -1,
    0.5,
    NaN,
    Infinity,
    Number.MAX_SAFE_INTEGER + 1,
  ])
    expect(() => validateRuleSet(rules(), { maxSearchNodes })).toThrow(
      RangeError,
    );
});
test('changed preset geometry cannot reuse the shortcut', () => {
  const base = createV1RuleSet();
  for (const changed of [
    { ...base, board: { rows: 11, cols: 10 } },
    { ...base, board: { rows: 10, cols: 11 } },
    { ...base, contactRule: 'no-orthogonal' as const },
    { ...base, fleet: base.fleet.slice(1) },
    { ...base, fleet: base.fleet.map((s) => ({ ...s, length: 1 })) },
    { ...base, startingPlayer: 'player-1' as const },
    {
      ...base,
      information: { ...base.information, hit: 'ship-type' as const },
    },
    {
      ...base,
      information: { ...base.information, sunk: 'ship-cells' as const },
    },
    {
      ...base,
      turn: { ...base.turn, quota: { kind: 'fixed' as const, count: 2 } },
    },
  ])
    expect(validateRuleSet(changed, { maxSearchNodes: 1 }).status).toBe(
      'inconclusive',
    );
});
test('double rotation and transposition preserve geometry', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 2, max: 26 }),
      fc.integer({ min: 1, max: 26 }),
      fc.boolean(),
      (size, length, vertical) => {
        const s = ship('a', 0, 0, vertical ? 'vertical' : 'horizontal');
        expect(rotateShip(rotateShip(s))).toEqual(s);
        const cells = getShipCells(s, length);
        const rotated = getShipCells(rotateShip(s), length);
        expect(rotated).toEqual(
          cells.map(({ row, col }) => ({ row: col, col: row })),
        );
        expect(
          validatePlacement(rules([length], size), { ships: [s] }).status,
        ).toBe(length <= size ? 'valid' : 'invalid');
        expect(
          cells.every((c) => isWithinBoard(c, { rows: size, cols: size })),
        ).toBe(length <= size);
      },
    ),
    options,
  );
});
test('small-board results agree with an independent exhaustive domino oracle', () => {
  // Enumerate cell pairs by adjacency, not by the production start/orientation generator.
  fc.assert(
    fc.property(
      fc.integer({ min: 2, max: 4 }),
      fc.constantFrom<ContactRule>('allow', 'no-orthogonal', 'no-touch'),
      (size, contact) => {
        const coords = Array.from({ length: size * size }, (_, i) => ({
          row: Math.floor(i / size),
          col: i % size,
        }));
        const pairs = coords.flatMap((a, i) =>
          coords
            .slice(i + 1)
            .filter(
              (b) => Math.abs(a.row - b.row) + Math.abs(a.col - b.col) === 1,
            )
            .map((b) => [a, b]),
        );
        const exists = pairs.some((a) =>
          pairs.some((b) =>
            a.every((x) =>
              b.every((y) => {
                const dr = Math.abs(x.row - y.row),
                  dc = Math.abs(x.col - y.col);
                if (contact === 'no-touch') return Math.max(dr, dc) > 1;
                return dr + dc > (contact === 'allow' ? 0 : 1);
              }),
            ),
          ),
        );
        const config = rules([2, 2], size, contact);
        const before = JSON.stringify(config);
        const result = validateRuleSet(config, limits);
        expect(result.status).toBe(exists ? 'valid' : 'invalid');
        expect(validateRuleSet(config, limits)).toEqual(result);
        expect(JSON.stringify(config)).toBe(before);
        if (result.status === 'valid')
          expect(validatePlacement(config, result.witness).status).toBe(
            'valid',
          );
      },
    ),
    options,
  );
});
