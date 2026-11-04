/**
 * PCG transition and seeding adapted from pcg-c-basic (Apache-2.0).
 * Copyright 2014 Melissa O'Neill <oneill@pcg-random.org>.
 * Source: bc39cd76ac3d541e618606bcc6e1e5ba5e5e6aa3/pcg_basic.c.
 * Modified for TypeScript, isolated instances, checked JSON state and upper-tail
 * bounded rejection. License: ../../../licenses/pcg-apache-2.0.txt.
 */
export interface RngState {
  readonly algorithm: 'pcg32-xsh-rr-v1';
  readonly stateHex: string;
  readonly incrementHex: string;
}

export interface Rng {
  nextUint32(): number;
  int(maxExclusive: number): number;
  exportState(): RngState;
}

export interface RngFactory {
  fromState(state: RngState): Rng;
}

export interface RngSeed {
  readonly initStateHex: string;
  readonly initSequenceHex: string;
}

const mask64 = (1n << 64n) - 1n;
const uint32Range = 2 ** 32;

function readWord(value: unknown): bigint {
  if (typeof value !== 'string' || !/^[0-9a-f]{16}$/.test(value)) {
    throw new TypeError('Expected a 16-character lowercase hexadecimal word');
  }
  return BigInt(`0x${value}`);
}

function instance(initialState: bigint, increment: bigint): Rng {
  let state = initialState;
  const nextUint32 = (): number => {
    const oldState = state;
    state = (oldState * 6364136223846793005n + increment) & mask64;
    const shifted = Number(
      (((oldState >> 18n) ^ oldState) >> 27n) & 0xffffffffn,
    );
    const rotation = Number(oldState >> 59n);
    return ((shifted >>> rotation) | (shifted << (-rotation & 31))) >>> 0;
  };
  return {
    nextUint32,
    int(maxExclusive) {
      if (
        !Number.isInteger(maxExclusive) ||
        maxExclusive < 1 ||
        maxExclusive > uint32Range
      ) {
        throw new RangeError('Expected an integer bound from 1 through 2^32');
      }
      const limit = Math.floor(uint32Range / maxExclusive) * maxExclusive;
      let value: number;
      do {
        value = nextUint32();
      } while (value >= limit);
      return value % maxExclusive;
    },
    exportState: () => ({
      algorithm: 'pcg32-xsh-rr-v1',
      stateHex: state.toString(16).padStart(16, '0'),
      incrementHex: increment.toString(16).padStart(16, '0'),
    }),
  };
}

/** Seed words are inputs to PCG seeding, never a ready-to-use snapshot. */
export function createRng(seed: RngSeed): Rng {
  const initState = readWord(seed?.initStateHex);
  const initSequence = readWord(seed?.initSequenceHex);
  const increment = ((initSequence << 1n) | 1n) & mask64;
  // First advance from zero yields increment; add the seed and advance again.
  const rng = instance((increment + initState) & mask64, increment);
  rng.nextUint32();
  return rng;
}

/** Import validates untrusted snapshot fields without advancing the stream. */
export const rngFactory: RngFactory = {
  fromState(snapshot) {
    if (snapshot?.algorithm !== 'pcg32-xsh-rr-v1') {
      throw new TypeError('Unsupported RNG algorithm');
    }
    const state = readWord(snapshot.stateHex);
    const increment = readWord(snapshot.incrementHex);
    if ((increment & 1n) === 0n)
      throw new TypeError('RNG increment must be odd');
    return instance(state, increment);
  },
};
