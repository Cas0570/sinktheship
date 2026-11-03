import type {
  Coord,
  Placement,
  RuleSet,
  RuleValidationResult,
  ShipPlacement,
  ShipSpec,
} from './rules.js';
import { cellsConflict, getShipCells } from './geometry.js';
import { validatePlacement } from './placement.js';
import { createV1RuleSet } from './presets.js';
import { validateRuleSetSchema } from './validate-rules.js';

function presetWitness(rules: RuleSet): Placement | undefined {
  // Only the four released configurations use this shortcut; name keys and fleet order are presentation.
  const base = createV1RuleSet();
  if (
    rules.board.rows !== 10 ||
    rules.board.cols !== 10 ||
    rules.contactRule === 'no-orthogonal' ||
    rules.fleet.length !== base.fleet.length ||
    !base.fleet.every((spec) =>
      rules.fleet.some(
        (ship) => ship.id === spec.id && ship.length === spec.length,
      ),
    ) ||
    rules.startingPlayer !== base.startingPlayer ||
    rules.information.hit !== base.information.hit ||
    rules.information.sunk !== base.information.sunk ||
    rules.turn.quota.kind !== 'fixed' ||
    rules.turn.quota.count !== 1
  )
    return undefined;
  const witness: Placement = {
    ships: base.fleet.map((ship, index) => ({
      shipId: ship.id,
      start: { row: index * 2, col: 0 },
      orientation: 'horizontal',
    })),
  };
  const checked = validatePlacement(rules, witness);
  return checked.status === 'valid' ? checked.placement : undefined;
}

function* candidates(rules: RuleSet, spec: ShipSpec): Generator<ShipPlacement> {
  const orientations =
    spec.length === 1
      ? (['horizontal'] as const)
      : (['horizontal', 'vertical'] as const);
  for (const orientation of orientations) {
    const rows =
      rules.board.rows - (orientation === 'vertical' ? spec.length - 1 : 0);
    const cols =
      rules.board.cols - (orientation === 'horizontal' ? spec.length - 1 : 0);
    for (let row = 0; row < rows; row++)
      for (let col = 0; col < cols; col++)
        yield { shipId: spec.id, start: { row, col }, orientation };
  }
}

/** The budget counts every in-board candidate examined, including rejected candidates. */
export function validateRuleSet(
  input: unknown,
  limits: { readonly maxSearchNodes: number },
): RuleValidationResult {
  if (
    !Number.isSafeInteger(limits.maxSearchNodes) ||
    limits.maxSearchNodes <= 0
  )
    throw new RangeError('maxSearchNodes must be a positive safe integer');
  const schema = validateRuleSetSchema(input);
  if (schema.status !== 'schema-valid') return schema;
  const { rules, signatures } = schema;
  const preset = presetWitness(rules);
  if (preset) return { status: 'valid', rules, signatures, witness: preset };
  const fleet = [...rules.fleet].sort(
    (a, b) => b.length - a.length || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
  );
  const ships: ShipPlacement[] = [];
  const occupied: Coord[] = [];
  let nodes = 0;
  function search(depth: number): 'found' | 'exhausted' | 'budget' {
    const spec = fleet[depth];
    if (!spec) return 'found';
    for (const ship of candidates(rules, spec)) {
      if (nodes === limits.maxSearchNodes) return 'budget';
      nodes++;
      const cells = getShipCells(ship, spec.length);
      if (
        cells.some((cell) =>
          occupied.some((other) =>
            cellsConflict(cell, other, rules.contactRule),
          ),
        )
      )
        continue;
      ships.push(ship);
      occupied.push(...cells);
      const result = search(depth + 1);
      if (result !== 'exhausted') return result;
      ships.pop();
      occupied.length -= cells.length;
    }
    return 'exhausted';
  }
  const result = search(0);
  if (result === 'budget')
    return { status: 'inconclusive', reason: 'search-budget' };
  if (result === 'exhausted')
    return {
      status: 'invalid',
      issues: [{ code: 'NO_VALID_PLACEMENT', path: '$.fleet' }],
    };
  return { status: 'valid', rules, signatures, witness: { ships } };
}
