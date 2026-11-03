import type {
  RuleIssue,
  RuleSchemaValidationResult,
  RuleSet,
} from './rules.js';
import { getRuleSignatures } from './signatures.js';

type Shape = 'number' | 'string' | 'boolean' | { [key: string]: Shape };
const idPattern = /^[a-z][a-z0-9-]{0,31}$/;
const namePattern = /^ships\.[a-z][a-z0-9-]{0,31}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    (Object.getPrototypeOf(value) === Object.prototype ||
      Object.getPrototypeOf(value) === null)
  );
}

function shapeIssue(
  value: unknown,
  shape: Shape,
  path: string,
): RuleIssue | undefined {
  if (typeof shape === 'string') {
    return typeof value === shape ? undefined : { code: 'INVALID_SHAPE', path };
  }
  if (!isRecord(value)) return { code: 'INVALID_SHAPE', path };
  for (const key of Object.keys(value).sort()) {
    if (!Object.hasOwn(shape, key))
      return { code: 'INVALID_SHAPE', path: `${path}.${key}` };
  }
  for (const [key, childShape] of Object.entries(shape).sort(([a], [b]) =>
    a < b ? -1 : a > b ? 1 : 0,
  )) {
    if (!Object.hasOwn(value, key))
      return { code: 'INVALID_SHAPE', path: `${path}.${key}` };
    const issue = shapeIssue(value[key], childShape, `${path}.${key}`);
    if (issue) return issue;
  }
  return undefined;
}

function integer(value: number, min: number, max: number): boolean {
  return Number.isInteger(value) && value >= min && value <= max;
}

function invalid(
  code: RuleIssue['code'],
  path: string,
): RuleSchemaValidationResult {
  return { status: 'invalid', issues: [{ code, path }] };
}

/** Checks shape, capabilities and necessary size bounds, never placement existence. */
export function validateRuleSetSchema(
  input: unknown,
): RuleSchemaValidationResult {
  if (!isRecord(input)) return invalid('INVALID_SHAPE', '$');
  if (
    !Object.hasOwn(input, 'schemaVersion') ||
    typeof input.schemaVersion !== 'number'
  ) {
    return invalid('INVALID_SHAPE', '$.schemaVersion');
  }
  if (!integer(input.schemaVersion, 1, Number.MAX_VALUE))
    return invalid('INVALID_VALUE', '$.schemaVersion');
  if (input.schemaVersion !== 1)
    return { status: 'unsupported', reason: 'schema-version' };

  // Fleet is checked separately so array indices remain stable in error paths.
  if (!Array.isArray(input.fleet)) return invalid('INVALID_SHAPE', '$.fleet');
  const shape: Shape = {
    schemaVersion: 'number',
    board: { rows: 'number', cols: 'number' },
    contactRule: 'string',
    startingPlayer: 'string',
    information: { hit: 'string', sunk: 'string' },
    turn: {
      policyId: 'string',
      policyVersion: 'number',
      extraShotOnHit: 'boolean',
      quota: { kind: 'string' },
    },
  };
  const { fleet, ...rest } = input;
  // The quota discriminator determines its exact fields without coercion.
  if (
    isRecord(rest.turn) &&
    isRecord(rest.turn.quota) &&
    rest.turn.quota.kind === 'fixed'
  ) {
    shape.turn = {
      policyId: 'string',
      policyVersion: 'number',
      extraShotOnHit: 'boolean',
      quota: { kind: 'string', count: 'number' },
    };
  }
  const issue = shapeIssue(rest, shape, '$');
  if (issue) return { status: 'invalid', issues: [issue] };
  for (let index = 0; index < fleet.length; index++) {
    const issue = shapeIssue(
      fleet[index],
      { id: 'string', nameKey: 'string', length: 'number' },
      `$.fleet[${index}]`,
    );
    if (issue) return { status: 'invalid', issues: [issue] };
  }
  // Shape checks above establish the data layout; enums and ranges follow.
  const rules = input as unknown as RuleSet;
  const { board, turn, information } = rules;
  const checks: readonly (readonly [boolean, string])[] = [
    [integer(board.rows, 2, 26), '$.board.rows'],
    [integer(board.cols, 2, 26), '$.board.cols'],
    [integer(fleet.length, 1, 32), '$.fleet'],
    [
      ['allow', 'no-orthogonal', 'no-touch'].includes(rules.contactRule),
      '$.contactRule',
    ],
    [
      ['random', 'player-1', 'player-2'].includes(rules.startingPlayer),
      '$.startingPlayer',
    ],
    [['hit-only', 'ship-type'].includes(information.hit), '$.information.hit'],
    [
      ['sunk-only', 'ship-type', 'ship-cells'].includes(information.sunk),
      '$.information.sunk',
    ],
    [idPattern.test(turn.policyId), '$.turn.policyId'],
    [integer(turn.policyVersion, 1, 2147483647), '$.turn.policyVersion'],
    [['fixed', 'own-afloat'].includes(turn.quota.kind), '$.turn.quota.kind'],
  ];
  for (const [ok, path] of checks)
    if (!ok) return invalid('INVALID_VALUE', path);
  if (
    turn.quota.kind === 'fixed' &&
    !integer(turn.quota.count, 1, board.rows * board.cols)
  ) {
    return invalid('INVALID_VALUE', '$.turn.quota.count');
  }
  const ids = new Set<string>();
  for (const [index, ship] of rules.fleet.entries()) {
    const path = `$.fleet[${index}]`;
    if (!idPattern.test(ship.id)) return invalid('INVALID_VALUE', `${path}.id`);
    if (!namePattern.test(ship.nameKey))
      return invalid('INVALID_VALUE', `${path}.nameKey`);
    if (!integer(ship.length, 1, Number.MAX_VALUE))
      return invalid('INVALID_VALUE', `${path}.length`);
    if (ids.has(ship.id)) return invalid('DUPLICATE_SHIP_ID', `${path}.id`);
    ids.add(ship.id);
  }
  if (turn.policyId !== 'fixed' || turn.policyVersion !== 1)
    return { status: 'unsupported', reason: 'turn-policy' };
  if (turn.quota.kind !== 'fixed')
    return invalid('INCONSISTENT_TURN_CONFIG', '$.turn.quota');
  for (const [index, ship] of rules.fleet.entries()) {
    if (ship.length > Math.max(board.rows, board.cols))
      return invalid('SHIP_TOO_LONG', `$.fleet[${index}].length`);
  }
  if (
    rules.fleet.reduce((total, ship) => total + ship.length, 0) >
    board.rows * board.cols
  ) {
    return invalid('FLEET_TOO_LARGE', '$.fleet');
  }
  // Return an independent data tree: later caller edits cannot invalidate this result.
  const copy: RuleSet = {
    schemaVersion: 1,
    board: { ...board },
    fleet: rules.fleet.map((ship) => ({ ...ship })),
    contactRule: rules.contactRule,
    information: { ...information },
    startingPlayer: rules.startingPlayer,
    turn: { ...turn, quota: { ...turn.quota } },
  };
  return {
    status: 'schema-valid',
    rules: copy,
    signatures: getRuleSignatures(copy),
  };
}
