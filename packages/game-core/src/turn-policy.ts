import type { TurnPolicy, TurnPolicyRegistry } from './game-types.js';

export const fixedTurnPolicy: TurnPolicy = {
  id: 'fixed',
  version: 1,
  beginTurn({ rules }) {
    if (rules.turn.quota.kind !== 'fixed')
      throw new TypeError('fixed@1 requires fixed quota');
    return rules.turn.quota.count;
  },
  afterShot({ rules, shotsRemaining }, outcome) {
    const remaining =
      shotsRemaining -
      1 +
      (rules.turn.extraShotOnHit && outcome !== 'miss' ? 1 : 0);
    return { switchPlayer: remaining === 0, shotsRemaining: remaining };
  },
};

export const turnPolicies: TurnPolicyRegistry = {
  get(id, version) {
    return id === fixedTurnPolicy.id && version === fixedTurnPolicy.version
      ? fixedTurnPolicy
      : undefined;
  },
};
