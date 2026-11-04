import type { GameCommand } from './game-types.js';

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

/** Geometry and actor membership are checked after game/revision validation. */
export function isCommand(input: unknown): input is GameCommand {
  if (
    !record(input) ||
    !keys(input, [
      'gameId',
      'commandId',
      'expectedRevision',
      'actor',
      'action',
    ]) ||
    typeof input.gameId !== 'string' ||
    input.gameId.length === 0 ||
    typeof input.commandId !== 'string' ||
    input.commandId.length === 0 ||
    typeof input.expectedRevision !== 'number' ||
    !Number.isSafeInteger(input.expectedRevision) ||
    input.expectedRevision < 0 ||
    typeof input.actor !== 'string' ||
    !record(input.action)
  )
    return false;
  const action = input.action;
  switch (action.type) {
    case 'set-placement':
      return keys(action, ['type', 'placement']);
    case 'confirm-placement':
      return keys(action, ['type']);
    case 'fire':
      return (
        keys(action, ['type', 'coord']) &&
        record(action.coord) &&
        keys(action.coord, ['row', 'col']) &&
        typeof action.coord.row === 'number' &&
        typeof action.coord.col === 'number'
      );
    default:
      return false;
  }
}
