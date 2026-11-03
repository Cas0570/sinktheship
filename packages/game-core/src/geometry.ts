import type { Coord, RuleSet, ShipPlacement } from './rules.js';

/** Requires a schema-validated board. */
export function isWithinBoard(coord: Coord, board: RuleSet['board']): boolean {
  return (
    Number.isInteger(coord.row) &&
    Number.isInteger(coord.col) &&
    coord.row >= 0 &&
    coord.col >= 0 &&
    coord.row < board.rows &&
    coord.col < board.cols
  );
}

/** Requires a validated ship and positive integer length; does not clip at edges. */
export function getShipCells(
  ship: ShipPlacement,
  length: number,
): readonly Coord[] {
  return Array.from({ length }, (_, offset) => ({
    row: ship.start.row + (ship.orientation === 'vertical' ? offset : 0),
    col: ship.start.col + (ship.orientation === 'horizontal' ? offset : 0),
  }));
}

/** Rotates around the start cell. Validate the proposed draft before accepting it. */
export function rotateShip(ship: ShipPlacement): ShipPlacement {
  return {
    ...ship,
    start: { ...ship.start },
    orientation: ship.orientation === 'horizontal' ? 'vertical' : 'horizontal',
  };
}

export function cellsConflict(
  a: Coord,
  b: Coord,
  contact: RuleSet['contactRule'],
): boolean {
  const rows = Math.abs(a.row - b.row);
  const cols = Math.abs(a.col - b.col);
  if (rows === 0 && cols === 0) return true;
  if (contact === 'allow') return false;
  return contact === 'no-orthogonal'
    ? rows + cols === 1
    : rows <= 1 && cols <= 1;
}
