import type { Coord, RuleSet, ShipPlacement } from './rules.js';
import { cellsConflict, getShipCells, isWithinBoard } from './geometry.js';

// The engine contract permits incomplete drafts during placement.
export interface PlacementDraft {
  readonly ships: readonly ShipPlacement[];
}

export interface PlacementIssue {
  readonly code:
    | 'INVALID_SHAPE'
    | 'UNKNOWN_SHIP_ID'
    | 'DUPLICATE_SHIP_ID'
    | 'MISSING_SHIP'
    | 'INVALID_COORDINATE'
    | 'INVALID_ORIENTATION'
    | 'OUT_OF_BOUNDS'
    | 'OVERLAP'
    | 'FORBIDDEN_CONTACT';
  readonly path: string;
}
export type PlacementValidationResult =
  | { readonly status: 'valid'; readonly placement: PlacementDraft }
  | { readonly status: 'invalid'; readonly issues: readonly PlacementIssue[] };

function record(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    (Object.getPrototypeOf(value) === Object.prototype ||
      Object.getPrototypeOf(value) === null)
  );
}
function keys(
  value: Record<string, unknown>,
  names: readonly string[],
): boolean {
  return (
    Object.keys(value).length === names.length &&
    names.every((name) => Object.hasOwn(value, name))
  );
}

/** Rules must have passed schema validation. Partial drafts require complete=false. */
export function validatePlacement(
  rules: RuleSet,
  input: unknown,
  complete = true,
): PlacementValidationResult {
  const fail = (
    code: PlacementIssue['code'],
    path: string,
  ): PlacementValidationResult => ({
    status: 'invalid',
    issues: [{ code, path }],
  });
  if (!record(input) || !keys(input, ['ships']) || !Array.isArray(input.ships))
    return fail('INVALID_SHAPE', '$');
  const ships: ShipPlacement[] = [];
  const occupied: Coord[] = [];
  const ids = new Set<string>();
  for (const [index, value] of input.ships.entries()) {
    const path = `$.ships[${index}]`;
    if (
      !record(value) ||
      !keys(value, ['shipId', 'start', 'orientation']) ||
      typeof value.shipId !== 'string'
    )
      return fail('INVALID_SHAPE', path);
    const spec = rules.fleet.find((ship) => ship.id === value.shipId);
    if (!spec) return fail('UNKNOWN_SHIP_ID', `${path}.shipId`);
    if (ids.has(spec.id)) return fail('DUPLICATE_SHIP_ID', `${path}.shipId`);
    if (!record(value.start) || !keys(value.start, ['row', 'col']))
      return fail('INVALID_SHAPE', `${path}.start`);
    const { row, col } = value.start;
    if (
      typeof row !== 'number' ||
      typeof col !== 'number' ||
      !Number.isInteger(row) ||
      !Number.isInteger(col)
    )
      return fail('INVALID_COORDINATE', `${path}.start`);
    if (value.orientation !== 'horizontal' && value.orientation !== 'vertical')
      return fail('INVALID_ORIENTATION', `${path}.orientation`);
    const ship: ShipPlacement = {
      shipId: spec.id,
      start: { row, col },
      orientation: value.orientation,
    };
    const cells = getShipCells(ship, spec.length);
    if (cells.some((cell) => !isWithinBoard(cell, rules.board)))
      return fail('OUT_OF_BOUNDS', `${path}.start`);
    if (
      cells.some((cell) =>
        occupied.some(
          (other) => cell.row === other.row && cell.col === other.col,
        ),
      )
    )
      return fail('OVERLAP', path);
    if (
      cells.some((cell) =>
        occupied.some((other) => cellsConflict(cell, other, rules.contactRule)),
      )
    )
      return fail('FORBIDDEN_CONTACT', path);
    ids.add(spec.id);
    occupied.push(...cells);
    ships.push(ship);
  }
  if (complete && ids.size !== rules.fleet.length)
    return fail('MISSING_SHIP', '$.ships');
  return { status: 'valid', placement: { ships } };
}
