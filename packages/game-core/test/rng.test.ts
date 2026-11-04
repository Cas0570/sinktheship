import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { createRng, rngFactory, createRandomStreams } from '../src/index.js';
import type { Rng, RngSeed, RngState } from '../src/index.js';

const vector = JSON.parse(
  readFileSync(
    new URL('../../../fixtures/rng/pcg32.json', import.meta.url),
    'utf8',
  ),
) as RngSeed & {
  initialStateHex: string;
  incrementHex: string;
  outputsHex: string[];
  finalStateHex: string;
};
const seed: RngSeed = {
  initStateHex: vector.initStateHex,
  initSequenceHex: vector.initSequenceHex,
};
const draws = (rng: Rng, count = 100) =>
  Array.from({ length: count }, () => rng.nextUint32());

test('AT-28-01 PCG reference seeding, six unsigned outputs and state', () => {
  const rng = createRng(seed);
  expect(rng.exportState()).toEqual({
    algorithm: 'pcg32-xsh-rr-v1',
    stateHex: vector.initialStateHex,
    incrementHex: vector.incrementHex,
  });
  expect(draws(rng, 6).map((n) => n.toString(16).padStart(8, '0'))).toEqual(
    vector.outputsHex,
  );
  expect(rng.exportState().stateHex).toBe(vector.finalStateHex);
});

test('AT-28-02 JSON restore continues exactly and snapshots do not alias', () => {
  const rng = createRng(seed);
  draws(rng, 13);
  const saved = rng.exportState();
  const restored = rngFactory.fromState(
    JSON.parse(JSON.stringify(saved)) as RngState,
  );
  expect(draws(restored, 1000)).toEqual(draws(rng, 1000));
  expect(saved.stateHex).not.toBe(rng.exportState().stateHex);
  const a = rngFactory.fromState(saved);
  const b = rngFactory.fromState(saved);
  draws(a);
  expect(b.exportState()).toEqual(saved);
});

test('bounded draws reject the upper tail and consume exactly the accepted prefix', () => {
  const rng = createRng(seed);
  // a15c02b7 is rejected at this bound; 7b47f409 is accepted.
  expect(rng.int(0x80000001)).toBe(0x7b47f409);
  expect(rng.nextUint32()).toBe(0xba1d3330);
  const full = createRng(seed);
  expect(full.int(2 ** 32)).toBe(0xa15c02b7);
  expect(full.int(1)).toBe(0);
  expect(full.nextUint32()).toBe(0xba1d3330);
});

test.each([0, -1, 1.5, NaN, Infinity, 2 ** 32 + 1])(
  'invalid bound %s consumes no state',
  (bound) => {
    const rng = createRng(seed);
    const before = rng.exportState();
    expect(() => rng.int(bound)).toThrow(RangeError);
    expect(rng.exportState()).toEqual(before);
  },
);

test.each([1, 2, 3, 100, 65537, 2 ** 31 + 1, 2 ** 32])(
  'bounded sequence stays in [0, %s)',
  (bound) => {
    const rng = createRng(seed);
    for (let i = 0; i < 1000; i++) {
      const n = rng.int(bound);
      expect(Number.isInteger(n) && n >= 0 && n < bound).toBe(true);
    }
  },
);

test.each([
  '',
  'A000000000000000',
  '000000000000000',
  '00000000000000000',
  '-000000000000001',
  '000000000000000g',
  42,
  null,
])('malformed seed word %s is rejected', (word) => {
  expect(() => createRng({ ...seed, initStateHex: word } as RngSeed)).toThrow(
    TypeError,
  );
  expect(() =>
    createRng({ ...seed, initSequenceHex: word } as RngSeed),
  ).toThrow(TypeError);
});

test('unsigned 64-bit seeding wraps and sequence high bit follows PCG semantics', () => {
  const high = {
    initStateHex: 'ffffffffffffffff',
    initSequenceHex: 'ffffffffffffffff',
  };
  const low = { ...high, initSequenceHex: '7fffffffffffffff' };
  expect(draws(createRng(high))).toEqual(draws(createRng(low)));
  expect(createRng(high).exportState().incrementHex).toBe('ffffffffffffffff');
  const zero = createRng({
    initStateHex: '0000000000000000',
    initSequenceHex: '0000000000000000',
  });
  expect(zero.exportState().incrementHex).toBe('0000000000000001');
});

test.each([
  null,
  {},
  { algorithm: 'future' },
  {
    algorithm: 'pcg32-xsh-rr-v1',
    stateHex: '0',
    incrementHex: '0000000000000001',
  },
  {
    algorithm: 'pcg32-xsh-rr-v1',
    stateHex: '0000000000000000',
    incrementHex: '1',
  },
  {
    algorithm: 'pcg32-xsh-rr-v1',
    stateHex: '0000000000000000',
    incrementHex: '0000000000000000',
  },
  {
    algorithm: 'pcg32-xsh-rr-v1',
    stateHex: '0000000000000000',
    incrementHex: 'fffffffffffffffe',
  },
])('invalid snapshot is rejected: %j', (snapshot) => {
  expect(() => rngFactory.fromState(snapshot as RngState)).toThrow(TypeError);
});

test('all five streams are independent even with equal seed inputs', () => {
  const streams = createRandomStreams({
    starter: seed,
    placement: { 'player-1': seed, 'player-2': seed },
    strategy: { 'player-1': seed, 'player-2': seed },
  });
  const all = [
    streams.starter,
    ...Object.values(streams.placement),
    ...Object.values(streams.strategy),
  ];
  expect(new Set(all).size).toBe(5);
  for (const rng of all) {
    expect(draws(rng)).toEqual(draws(createRng(seed)));
  }
});

test('AT-28-03 discarded candidate draws, clock and cancellation leave committed RNG unchanged', async () => {
  const committed = createRng(seed);
  const before = committed.exportState();
  for (let i = 0; i < 10; i++) {
    const candidate = rngFactory.fromState(committed.exportState());
    draws(candidate, i + 1);
    const controller = new AbortController();
    controller.abort();
    Date.now();
    await Promise.resolve();
    expect(controller.signal.aborted).toBe(true);
    expect(committed.exportState()).toEqual(before);
  }
  expect(draws(committed)).toEqual(draws(createRng(seed)));
});
