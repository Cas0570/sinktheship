import { expect, test, vi } from 'vitest';
import fc from 'fast-check';
import {
  applyCommand,
  createGame,
  createRng,
  createV1RuleSet,
  fixedTurnPolicy,
  rngFactory,
  turnPolicies,
  validatePlacement,
  validateRuleSet,
} from '../src/index.js';
import type {
  Coord,
  GameAction,
  GameCommand,
  GameState,
  Placement,
  PlayerId,
  PlayingState,
  RuleSet,
} from '../src/index.js';

const seed = {
  initStateHex: '000000000000002a',
  initSequenceHex: '0000000000000036',
};
const snapshot = () => createRng(seed).exportState();
const dependencies = { rngFactory, turnPolicies };
const fleet: Placement = {
  ships: [
    { shipId: 'long', start: { row: 0, col: 0 }, orientation: 'horizontal' },
    { shipId: 'short', start: { row: 2, col: 2 }, orientation: 'vertical' },
  ],
};
function rules(count = 1, extraShotOnHit = false): RuleSet {
  return {
    ...createV1RuleSet(),
    board: { rows: 3, cols: 3 },
    fleet: [
      { id: 'long', nameKey: 'ships.long', length: 2 },
      { id: 'short', nameKey: 'ships.short', length: 1 },
    ],
    startingPlayer: 'player-1',
    turn: {
      policyId: 'fixed',
      policyVersion: 1,
      quota: { kind: 'fixed', count },
      extraShotOnHit,
    },
  };
}
function validated(input = rules()) {
  const result = validateRuleSet(input, { maxSearchNodes: 10000 });
  if (result.status !== 'valid') throw new Error('Invalid test rules');
  return result;
}
function game(input = rules()) {
  return createGame(validated(input), 'game-1', 'test-1', snapshot());
}
function command(
  state: GameState,
  action: GameAction,
  actor: PlayerId = 'player-1',
): GameCommand {
  return {
    gameId: state.gameId,
    commandId: `command-${state.revision}`,
    expectedRevision: state.revision,
    actor,
    action,
  };
}
function accepted(
  state: GameState,
  action: GameAction,
  actor: PlayerId = 'player-1',
) {
  const result = applyCommand(
    state,
    command(state, action, actor),
    dependencies,
  );
  if (result.status !== 'accepted') throw new Error(result.error);
  return result;
}
function playing(
  input = rules(),
  placements = { 'player-1': fleet, 'player-2': fleet },
): PlayingState {
  let state: GameState = game(input);
  for (const actor of ['player-1', 'player-2'] as const) {
    state = accepted(
      state,
      { type: 'set-placement', placement: placements[actor] },
      actor,
    ).state;
    state = accepted(state, { type: 'confirm-placement' }, actor).state;
  }
  if (state.phase !== 'playing') throw new Error('Game did not start');
  return state;
}
function freeze<T>(input: T): T {
  if (typeof input === 'object' && input !== null) {
    for (const value of Object.values(input)) freeze(value);
    Object.freeze(input);
  }
  return input;
}
function shot(row: number, col: number): GameAction {
  return { type: 'fire', coord: { row, col } };
}

test('createGame copies validated inputs and creates fresh empty drafts (RULE-22)', () => {
  const input = validated();
  const rng = snapshot();
  const first = createGame(freeze(input), 'first', 'v1', freeze(rng));
  expect(first).toMatchObject({
    phase: 'placing',
    revision: 0,
    nextEventSequence: 1,
    shots: [],
    confirmed: { 'player-1': false, 'player-2': false },
  });
  expect(first.drafts).toEqual({
    'player-1': { ships: [] },
    'player-2': { ships: [] },
  });
  expect(first.rules).not.toBe(input.rules);
  expect(first.rules.fleet[0]).not.toBe(input.rules.fleet[0]);
  expect(first.starterRng).not.toBe(rng);
  const fresh = createRng({
    ...seed,
    initStateHex: '000000000000002b',
  }).exportState();
  const second = createGame(input, 'second', 'v1', fresh);
  expect(second.gameId).not.toBe(first.gameId);
  expect(second.starterRng).not.toEqual(first.starterRng);
  expect(second.drafts).toEqual(first.drafts);
  expect(second.drafts).not.toBe(first.drafts);
  expect(() => createGame(input, '', 'v1', rng)).toThrow(TypeError);
  expect(() => createGame(input, 'id', '', rng)).toThrow(TypeError);
  expect(() =>
    createGame(
      { ...input, status: 'inconclusive' } as unknown as typeof input,
      'id',
      'v1',
      rng,
    ),
  ).toThrow(TypeError);
});

test('partial placement replaces the draft, invalid geometry preserves it, confirmation locks it', () => {
  const initial = freeze(game());
  const draft = freeze({ ships: [fleet.ships[0]!] });
  const update = accepted(initial, { type: 'set-placement', placement: draft });
  expect(update.events).toEqual([
    {
      sequence: 1,
      revision: 1,
      commandId: 'command-0',
      payload: { type: 'placement-updated', player: 'player-1' },
    },
  ]);
  expect(
    update.state.phase === 'placing' && update.state.drafts['player-1'],
  ).toEqual(draft);
  expect(
    applyCommand(
      update.state,
      command(update.state, { type: 'confirm-placement' }),
      dependencies,
    ),
  ).toEqual({ status: 'rejected', error: 'INCOMPLETE_FLEET' });
  const invalid = {
    ships: [{ ...fleet.ships[0]!, start: { row: 0, col: 2 } }],
  };
  expect(
    applyCommand(
      update.state,
      command(update.state, { type: 'set-placement', placement: invalid }),
      dependencies,
    ),
  ).toEqual({ status: 'rejected', error: 'INVALID_PLACEMENT' });
  const reset = accepted(update.state, {
    type: 'set-placement',
    placement: { ships: [] },
  });
  expect(
    reset.state.phase === 'placing' && reset.state.drafts['player-1'].ships,
  ).toEqual([]);
  const complete = accepted(update.state, {
    type: 'set-placement',
    placement: fleet,
  });
  const locked = accepted(complete.state, { type: 'confirm-placement' });
  for (const action of [
    { type: 'confirm-placement' },
    { type: 'set-placement', placement: fleet },
  ] as const) {
    expect(
      applyCommand(
        freeze(locked.state),
        command(locked.state, action),
        dependencies,
      ),
    ).toEqual({ status: 'rejected', error: 'FLEET_LOCKED' });
  }
  expect(initial.revision).toBe(0);
  expect(draft.ships).toHaveLength(1);
});

test.each(['player-1', 'player-2', 'random'] as const)(
  'second confirmation chooses %s once with ordered events',
  (startingPlayer) => {
    let state: GameState = game({ ...rules(), startingPlayer });
    const fromState = vi.fn(rngFactory.fromState);
    const deps = { ...dependencies, rngFactory: { fromState } };
    for (const actor of ['player-2', 'player-1'] as const) {
      state = accepted(
        state,
        { type: 'set-placement', placement: fleet },
        actor,
      ).state;
    }
    let result = applyCommand(
      state,
      command(state, { type: 'confirm-placement' }, 'player-2'),
      deps,
    );
    if (result.status !== 'accepted')
      throw new Error('First confirmation failed');
    state = result.state;
    expect(fromState).not.toHaveBeenCalled();
    result = applyCommand(
      freeze(state),
      freeze(command(state, { type: 'confirm-placement' })),
      deps,
    );
    if (result.status !== 'accepted' || result.state.phase !== 'playing')
      throw new Error('Second confirmation failed');
    const started = result.state;
    const rng = rngFactory.fromState(snapshot());
    const expected =
      startingPlayer === 'random'
        ? rng.int(2) === 0
          ? 'player-1'
          : 'player-2'
        : startingPlayer;
    expect(started.starter).toBe(expected);
    expect(started.starterRng).toEqual(
      startingPlayer === 'random' ? rng.exportState() : snapshot(),
    );
    expect(fromState).toHaveBeenCalledTimes(
      startingPlayer === 'random' ? 1 : 0,
    );
    expect(result.events.map((event) => event.payload.type)).toEqual([
      'fleet-confirmed',
      'game-started',
      'turn-started',
    ]);
    expect(result.events.map((event) => event.sequence)).toEqual([4, 5, 6]);
    expect(result.events.map((event) => event.revision)).toEqual([4, 4, 4]);
    expect(started).not.toHaveProperty('drafts');
    expect(started).not.toHaveProperty('confirmed');
    expect(started.turn).toEqual({
      number: 1,
      activePlayer: expected,
      shotsRemaining: 1,
    });
  },
);

test('envelope errors precede game, revision, actor, phase and action errors', () => {
  const state = freeze(game());
  const base = command(state, { type: 'confirm-placement' });
  const cases: readonly [unknown, string][] = [
    [null, 'INVALID_COMMAND'],
    [{ ...base, extra: true }, 'INVALID_COMMAND'],
    [{ ...base, commandId: '' }, 'INVALID_COMMAND'],
    [{ ...base, gameId: '' }, 'INVALID_COMMAND'],
    [{ ...base, expectedRevision: -1 }, 'INVALID_COMMAND'],
    [{ ...base, expectedRevision: 0.5 }, 'INVALID_COMMAND'],
    [{ ...base, expectedRevision: Infinity }, 'INVALID_COMMAND'],
    [{ ...base, actor: 1 }, 'INVALID_COMMAND'],
    [{ ...base, action: { type: 'unknown' } }, 'INVALID_COMMAND'],
    [
      { ...base, action: { type: 'fire', coord: { row: '0', col: 0 } } },
      'INVALID_COMMAND',
    ],
    [
      {
        ...base,
        action: { type: 'fire', coord: { row: 0, col: 0, extra: 1 } },
      },
      'INVALID_COMMAND',
    ],
    [{ ...base, action: { type: 'set-placement' } }, 'INVALID_COMMAND'],
    [
      { ...base, action: { type: 'confirm-placement', extra: 1 } },
      'INVALID_COMMAND',
    ],
    [
      { ...base, gameId: 'another', expectedRevision: 42, actor: 'invalid' },
      'WRONG_GAME',
    ],
    [{ ...base, expectedRevision: 42, actor: 'invalid' }, 'STALE_REVISION'],
    [{ ...base, actor: 'invalid' }, 'INVALID_COMMAND'],
    [{ ...base, action: shot(0, 0) }, 'WRONG_PHASE'],
    [
      { ...base, action: { type: 'set-placement', placement: null } },
      'INVALID_PLACEMENT',
    ],
  ];
  const fromState = vi.fn(rngFactory.fromState);
  const get = vi.fn(turnPolicies.get);
  for (const [input, error] of cases) {
    expect(
      applyCommand(state, input as GameCommand, {
        rngFactory: { fromState },
        turnPolicies: { get },
      }),
    ).toEqual({ status: 'rejected', error });
  }
  expect(fromState).not.toHaveBeenCalled();
  expect(get).not.toHaveBeenCalled();
});

test('RULE-07/08 inactive, out of bounds, duplicate and wrong-phase commands are atomic', () => {
  const state = freeze(playing());
  for (const action of [
    { type: 'confirm-placement' },
    { type: 'set-placement', placement: fleet },
  ] as const) {
    expect(applyCommand(state, command(state, action), dependencies)).toEqual({
      status: 'rejected',
      error: 'WRONG_PHASE',
    });
  }
  expect(
    applyCommand(state, command(state, shot(-1, 0), 'player-2'), dependencies),
  ).toEqual({ status: 'rejected', error: 'NOT_YOUR_TURN' });
  for (const coord of [
    { row: -1, col: 0 },
    { row: 3, col: 0 },
    { row: 0, col: 3 },
    { row: 0.5, col: 0 },
    { row: NaN, col: 0 },
    { row: 0, col: Infinity },
  ]) {
    expect(
      applyCommand(
        state,
        command(state, { type: 'fire', coord }),
        dependencies,
      ),
    ).toEqual({ status: 'rejected', error: 'OUT_OF_BOUNDS' });
  }
  const first = accepted(state, shot(1, 1));
  const second = accepted(first.state, shot(1, 1), 'player-2');
  expect(second.state.shots).toHaveLength(2); // Coordinates are unique per shooter.
  const fromState = vi.fn(rngFactory.fromState);
  const get = vi.fn(turnPolicies.get);
  const saved = JSON.stringify(second.state);
  expect(
    applyCommand(freeze(second.state), command(second.state, shot(1, 1)), {
      rngFactory: { fromState },
      turnPolicies: { get },
    }),
  ).toEqual({ status: 'rejected', error: 'ALREADY_SHOT' });
  expect(JSON.stringify(second.state)).toBe(saved);
  expect(fromState).not.toHaveBeenCalled();
  expect(get).not.toHaveBeenCalled();
});

test('RULE-09 a hit consumes quota and switches player without bonus', () => {
  const result = accepted(freeze(playing()), freeze(shot(0, 0)));
  expect(result.state.shots).toEqual([
    {
      shotIndex: 1,
      shooter: 'player-1',
      coord: { row: 0, col: 0 },
      kind: 'hit',
      shipId: 'long',
    },
  ]);
  expect(result.state.phase === 'playing' && result.state.turn).toEqual({
    number: 2,
    activePlayer: 'player-2',
    shotsRemaining: 1,
  });
  expect(result.events.map((event) => event.payload.type)).toEqual([
    'shot-resolved',
    'turn-started',
  ]);
});

test('RULE-10 nonwinning hits and sinks earn bonus, misses switch', () => {
  let state: GameState = playing(rules(1, true));
  for (const [col, kind] of [
    [0, 'hit'],
    [1, 'sunk'],
  ] as const) {
    const result = accepted(state, shot(0, col));
    state = result.state;
    expect(state.shots.at(-1)?.kind).toBe(kind);
    expect(state.phase === 'playing' && state.turn).toEqual({
      number: 1,
      activePlayer: 'player-1',
      shotsRemaining: 1,
    });
    expect(result.events).toHaveLength(1);
  }
  state = accepted(state, shot(1, 1)).state;
  expect(state.phase === 'playing' && state.turn.activePlayer).toBe('player-2');
});

test('RULE-19 quota three with bonus follows 2,2,1 then resets for the opponent', () => {
  let state: GameState = playing(rules(3, true));
  for (const [row, col, remaining] of [
    [1, 0, 2],
    [0, 0, 2],
    [1, 1, 1],
    [1, 2, 3],
  ]) {
    state = accepted(state, shot(row!, col!)).state;
    expect(state.phase === 'playing' && state.turn.shotsRemaining).toBe(
      remaining,
    );
  }
  expect(state.phase === 'playing' && state.turn).toEqual({
    number: 2,
    activePlayer: 'player-2',
    shotsRemaining: 3,
  });
});

test.each([1, 3])(
  'RULE-11 win precedes bonus and switching with quota %s; no later actions',
  (quota) => {
    let state: GameState = playing(rules(quota, true));
    state = accepted(state, shot(0, 1)).state;
    state = accepted(state, shot(2, 2)).state;
    const before = freeze(state);
    const afterShot = vi.fn(fixedTurnPolicy.afterShot);
    const deps = {
      rngFactory,
      turnPolicies: { get: () => ({ ...fixedTurnPolicy, afterShot }) },
    };
    const result = applyCommand(before, command(before, shot(0, 0)), deps);
    if (result.status !== 'accepted') throw new Error('Winning shot failed');
    expect(result.state).toMatchObject({
      phase: 'finished',
      winner: 'player-1',
      turn: { number: 1, activePlayer: 'player-1', shotsRemaining: quota - 1 },
    });
    expect(result.events.map((event) => event.payload.type)).toEqual([
      'shot-resolved',
      'game-finished',
    ]);
    expect(afterShot).not.toHaveBeenCalled();
    for (const action of [
      shot(1, 1),
      { type: 'confirm-placement' },
      { type: 'set-placement', placement: fleet },
    ] as const) {
      expect(
        applyCommand(result.state, command(result.state, action), deps),
      ).toEqual({ status: 'rejected', error: 'WRONG_PHASE' });
    }
  },
);

test('policy registry resolves exact version and inconsistent composition fails explicitly', () => {
  expect(turnPolicies.get('fixed', 1)).toBe(fixedTurnPolicy);
  expect(turnPolicies.get('fixed', 2)).toBeUndefined();
  expect(turnPolicies.get('salvo', 1)).toBeUndefined();
  expect(() =>
    fixedTurnPolicy.beginTurn({
      rules: {
        ...rules(),
        turn: { ...rules().turn, quota: { kind: 'own-afloat' } },
      },
      activePlayer: 'player-1',
      shotsRemaining: 0,
      ownShipsAfloat: 2,
    }),
  ).toThrow(TypeError);
  const state = freeze(playing());
  expect(() =>
    applyCommand(state, command(state, shot(1, 1)), {
      rngFactory,
      turnPolicies: { get: () => undefined },
    }),
  ).toThrow(TypeError);
});

test('ENG-01–08: generated complete games match an independent board/quota oracle', () => {
  const cells: Coord[] = Array.from({ length: 9 }, (_, index) => ({
    row: Math.floor(index / 3),
    col: index % 3,
  }));
  const permutation = fc.shuffledSubarray(cells, {
    minLength: 9,
    maxLength: 9,
  });
  fc.assert(
    fc.property(
      permutation,
      permutation,
      fc.integer({ min: 1, max: 9 }),
      fc.boolean(),
      fc.boolean(),
      (one, two, quota, bonus, reverse) => {
        const rotated: Placement = {
          ships: [
            {
              shipId: 'long',
              start: { row: 1, col: 0 },
              orientation: 'vertical',
            },
            {
              shipId: 'short',
              start: { row: 0, col: 2 },
              orientation: 'horizontal',
            },
          ],
        };
        const placements = { 'player-1': fleet, 'player-2': rotated };
        let state: GameState = playing(
          {
            ...rules(quota, bonus),
            startingPlayer: reverse ? 'player-2' : 'player-1',
          },
          placements,
        );
        const initial = JSON.stringify(state);
        const orders = { 'player-1': [...one], 'player-2': [...two] };
        const targets = {
          'player-1': new Map([
            ['0,0', 'long'],
            ['0,1', 'long'],
            ['2,2', 'short'],
          ]),
          'player-2': new Map([
            ['1,0', 'long'],
            ['2,0', 'long'],
            ['0,2', 'short'],
          ]),
        };
        let actor: PlayerId = reverse ? 'player-2' : 'player-1';
        let remaining = quota;
        let turnNumber = 1;
        let attempts = 0;
        while (state.phase === 'playing') {
          const opponent = actor === 'player-1' ? 'player-2' : 'player-1';
          const coord = orders[actor].shift()!;
          const key = `${coord.row},${coord.col}`;
          const shipId = targets[opponent].get(key) ?? null;
          targets[opponent].delete(key);
          const kind =
            shipId === null
              ? 'miss'
              : [...targets[opponent].values()].includes(shipId)
                ? 'hit'
                : 'sunk';
          const won = targets[opponent].size === 0;
          const cmd = freeze(command(state, { type: 'fire', coord }, actor));
          const before = freeze(state);
          const result = applyCommand(before, cmd, dependencies);
          expect(result).toEqual(applyCommand(before, cmd, dependencies));
          if (result.status !== 'accepted') throw new Error(result.error);
          state = result.state;
          attempts++;
          remaining--;
          if (!won && bonus && kind !== 'miss') remaining++;
          if (!won && remaining === 0) {
            actor = opponent;
            remaining = quota;
            turnNumber++;
          }
          expect(state.phase).toBe(won ? 'finished' : 'playing');
          expect(state.phase !== 'placing' && state.turn).toEqual({
            number: turnNumber,
            activePlayer: actor,
            shotsRemaining: remaining,
          });
          expect(state.shots.at(-1)).toEqual({
            shotIndex: attempts,
            shooter: cmd.actor,
            coord,
            kind,
            shipId,
          });
          expect(state.revision).toBe(before.revision + 1);
          expect(result.events.map((event) => event.sequence)).toEqual(
            result.events.map((_, i) => before.nextEventSequence + i),
          );
          expect(
            result.events.every((event) => event.revision === state.revision),
          ).toBe(true);
          expect(state.starterRng).toEqual(before.starterRng);
          expect(state.rules).toEqual(before.rules);
          expect(state.signatures).toEqual(before.signatures);
          expect(JSON.parse(JSON.stringify(state))).toEqual(state);
          expect(
            state.phase !== 'placing' &&
              validatePlacement(state.rules, state.placements[actor]).status,
          ).toBe('valid');
          if (won)
            expect(state.phase === 'finished' && state.winner).toBe(cmd.actor);
        }
        expect(attempts).toBeLessThanOrEqual(17);
        expect(initial).toBe(
          JSON.stringify(
            playing(
              {
                ...rules(quota, bonus),
                startingPlayer: reverse ? 'player-2' : 'player-1',
              },
              placements,
            ),
          ),
        );
      },
    ),
    { seed: 20261104, numRuns: 1000 },
  );
});

test.each([
  ['allow', false],
  ['allow', true],
  ['no-touch', false],
  ['no-touch', true],
] as const)(
  'all v1 variants play from validated witnesses through the final shot: %s/%s',
  (contact, bonus) => {
    const input = validated(createV1RuleSet(contact, bonus));
    let state: GameState = playing(input.rules, {
      'player-1': input.witness,
      'player-2': input.witness,
    });
    const remaining = { 'player-1': 100, 'player-2': 100 };
    while (state.phase === 'playing') {
      const actor = state.turn.activePlayer;
      const index = 100 - remaining[actor]--;
      state = accepted(
        freeze(state),
        shot(Math.floor(index / 10), index % 10),
        actor,
      ).state;
    }
    expect(state.phase).toBe('finished');
    if (state.phase !== 'finished') throw new Error('Missing winner');
    expect(
      state.shots.filter(
        (record) => record.shooter === state.winner && record.kind === 'sunk',
      ),
    ).toHaveLength(5);
    expect(
      state.shots.filter(
        (record) => record.shooter === state.winner && record.kind !== 'miss',
      ),
    ).toHaveLength(17);
    expect(state.starterRng).not.toEqual(snapshot());
  },
);
