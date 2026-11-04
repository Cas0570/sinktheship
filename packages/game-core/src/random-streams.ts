import { createRng } from './rng.js';
import type { Rng, RngSeed } from './rng.js';
import type { PlayerId } from './rules.js';

/** Private explicit seed pairs; browser entropy is supplied outside the core. */
export interface RandomSeedPlan {
  readonly starter: RngSeed;
  readonly placement: Readonly<Record<PlayerId, RngSeed>>;
  readonly strategy: Readonly<Record<PlayerId, RngSeed>>;
}

export interface RandomStreams {
  readonly starter: Rng;
  readonly placement: Readonly<Record<PlayerId, Rng>>;
  readonly strategy: Readonly<Record<PlayerId, Rng>>;
}

/** Each role owns a fresh instance, even when test seed pairs are equal. */
export function createRandomStreams(plan: RandomSeedPlan): RandomStreams {
  return {
    starter: createRng(plan.starter),
    placement: {
      'player-1': createRng(plan.placement['player-1']),
      'player-2': createRng(plan.placement['player-2']),
    },
    strategy: {
      'player-1': createRng(plan.strategy['player-1']),
      'player-2': createRng(plan.strategy['player-2']),
    },
  };
}
