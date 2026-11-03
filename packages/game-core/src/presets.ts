import type { RuleSet } from './rules.js';

/** Returns fresh data for one of the four released v1 combinations. */
export function createV1RuleSet(
  contactRule: 'allow' | 'no-touch' = 'allow',
  extraShotOnHit = false,
): RuleSet {
  return {
    schemaVersion: 1,
    board: { rows: 10, cols: 10 },
    fleet: [
      { id: 'carrier', nameKey: 'ships.carrier', length: 5 },
      { id: 'battleship', nameKey: 'ships.battleship', length: 4 },
      { id: 'cruiser', nameKey: 'ships.cruiser', length: 3 },
      { id: 'submarine', nameKey: 'ships.submarine', length: 3 },
      { id: 'destroyer', nameKey: 'ships.destroyer', length: 2 },
    ],
    contactRule,
    turn: {
      policyId: 'fixed',
      policyVersion: 1,
      quota: { kind: 'fixed', count: 1 },
      extraShotOnHit,
    },
    information: { hit: 'hit-only', sunk: 'ship-type' },
    startingPlayer: 'random',
  };
}
