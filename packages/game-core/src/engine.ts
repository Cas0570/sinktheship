import type { Coord, PlayerId, RuleValidationResult } from './rules.js';
import type { RngFactory, RngState } from './rng.js';
import { rngFactory } from './rng.js';
import type {
  CommandError,
  EngineResult,
  EventPayload,
  GameCommand,
  GameState,
  PlacingState,
  PlayingState,
  PrivateShotRecord,
  TurnPolicy,
  TurnPolicyRegistry,
} from './game-types.js';
import { validatePlacement } from './placement.js';
import { getShipCells, isWithinBoard } from './geometry.js';
import { isCommand } from './command-validation.js';

/** The caller supplies a fresh identity and private starter stream for each game. */
export function createGame(
  validated: Extract<RuleValidationResult, { status: 'valid' }>,
  gameId: string,
  engineVersion: string,
  starterRng: RngState,
): PlacingState {
  if (validated.status !== 'valid' || !gameId || !engineVersion)
    throw new TypeError(
      'A validated ruleset, game ID and engine version are required',
    );
  // Copy JSON data explicitly; no runtime/platform cloning dependency in the core.
  const { rules } = validated;
  return {
    schemaVersion: 1,
    engineVersion,
    gameId,
    revision: 0,
    nextEventSequence: 1,
    rules: {
      ...rules,
      board: { ...rules.board },
      fleet: rules.fleet.map((ship) => ({ ...ship })),
      turn: { ...rules.turn, quota: { ...rules.turn.quota } },
      information: { ...rules.information },
    },
    signatures: { ...validated.signatures },
    starterRng: rngFactory.fromState(starterRng).exportState(),
    shots: [],
    phase: 'placing',
    drafts: { 'player-1': { ships: [] }, 'player-2': { ships: [] } },
    confirmed: { 'player-1': false, 'player-2': false },
  };
}

function other(player: PlayerId): PlayerId {
  return player === 'player-1' ? 'player-2' : 'player-1';
}

function reject(error: CommandError): EngineResult {
  return { status: 'rejected', error };
}

function accept(
  before: GameState,
  next: GameState,
  command: GameCommand,
  payloads: readonly EventPayload[],
): EngineResult {
  const revision = before.revision + 1;
  return {
    status: 'accepted',
    state: {
      ...next,
      revision,
      nextEventSequence: before.nextEventSequence + payloads.length,
    },
    events: payloads.map((payload, index) => ({
      payload,
      revision,
      commandId: command.commandId,
      sequence: before.nextEventSequence + index,
    })),
  };
}

function policyFor(state: GameState, registry: TurnPolicyRegistry): TurnPolicy {
  const policy = registry.get(
    state.rules.turn.policyId,
    state.rules.turn.policyVersion,
  );
  if (!policy)
    throw new TypeError('The validated turn policy must be registered');
  return policy;
}

function confirm(
  state: PlacingState,
  command: GameCommand,
  dependencies: { rngFactory: RngFactory; turnPolicies: TurnPolicyRegistry },
): EngineResult {
  const checked = validatePlacement(state.rules, state.drafts[command.actor]);
  if (checked.status !== 'valid') return reject('INCOMPLETE_FLEET');
  const confirmed = { ...state.confirmed, [command.actor]: true };
  const payloads: EventPayload[] = [
    { type: 'fleet-confirmed', player: command.actor },
  ];
  if (!confirmed[other(command.actor)])
    return accept(state, { ...state, confirmed }, command, payloads);
  const policy = policyFor(state, dependencies.turnPolicies);
  let starterRng = state.starterRng;
  let starter = state.rules.startingPlayer;
  if (starter === 'random') {
    const rng = dependencies.rngFactory.fromState(starterRng);
    starter = rng.int(2) === 0 ? 'player-1' : 'player-2';
    starterRng = rng.exportState();
  }
  const turn = {
    number: 1,
    activePlayer: starter,
    shotsRemaining: policy.beginTurn({
      rules: state.rules,
      activePlayer: starter,
      shotsRemaining: 0,
      ownShipsAfloat: state.rules.fleet.length,
    }),
  };
  // Drop placing-only fields rather than retaining hidden drafts in later phases.
  const { drafts, confirmed: previousConfirmed, ...base } = state;
  void previousConfirmed;
  const next: PlayingState = {
    ...base,
    phase: 'playing',
    starter,
    starterRng,
    placements: { ...drafts, [command.actor]: checked.placement },
    turn,
  };
  payloads.push(
    { type: 'game-started', starter },
    { type: 'turn-started', turn },
  );
  return accept(state, next, command, payloads);
}

function same(a: Coord, b: Coord): boolean {
  return a.row === b.row && a.col === b.col;
}

function fire(
  state: PlayingState,
  command: GameCommand & { action: { type: 'fire'; coord: Coord } },
  registry: TurnPolicyRegistry,
): EngineResult {
  const {
    actor,
    action: { coord },
  } = command;
  if (actor !== state.turn.activePlayer) return reject('NOT_YOUR_TURN');
  if (!isWithinBoard(coord, state.rules.board)) return reject('OUT_OF_BOUNDS');
  const previous = state.shots.filter((shot) => shot.shooter === actor);
  if (previous.some((shot) => same(shot.coord, coord)))
    return reject('ALREADY_SHOT');
  const target = state.placements[other(actor)].ships.find((ship) => {
    const spec = state.rules.fleet.find((spec) => spec.id === ship.shipId)!;
    return getShipCells(ship, spec.length).some((cell) => same(cell, coord));
  });
  const length = state.rules.fleet.find(
    (ship) => ship.id === target?.shipId,
  )?.length;
  const kind = !target
    ? 'miss'
    : previous.filter((shot) => shot.shipId === target.shipId).length + 1 ===
        length
      ? 'sunk'
      : 'hit';
  const record: PrivateShotRecord = {
    shotIndex: state.shots.length + 1,
    shooter: actor,
    coord: { ...coord },
    kind,
    shipId: target?.shipId ?? null,
  };
  const shots = [...state.shots, record];
  const payloads: EventPayload[] = [{ type: 'shot-resolved', record }];
  const won =
    kind === 'sunk' &&
    previous.filter((shot) => shot.kind === 'sunk').length + 1 ===
      state.rules.fleet.length;
  if (won) {
    payloads.push({ type: 'game-finished', winner: actor });
    return accept(
      state,
      {
        ...state,
        phase: 'finished',
        shots,
        winner: actor,
        turn: { ...state.turn, shotsRemaining: state.turn.shotsRemaining - 1 },
      },
      command,
      payloads,
    );
  }
  const policy = policyFor(state, registry);
  const afloat = (player: PlayerId) =>
    state.rules.fleet.length -
    shots.filter(
      (shot) => shot.shooter === other(player) && shot.kind === 'sunk',
    ).length;
  const after = policy.afterShot(
    {
      rules: state.rules,
      activePlayer: actor,
      shotsRemaining: state.turn.shotsRemaining,
      ownShipsAfloat: afloat(actor),
    },
    kind,
  );
  let turn = { ...state.turn, shotsRemaining: after.shotsRemaining };
  if (after.switchPlayer) {
    const activePlayer = other(actor);
    turn = {
      number: state.turn.number + 1,
      activePlayer,
      shotsRemaining: policy.beginTurn({
        rules: state.rules,
        activePlayer,
        shotsRemaining: 0,
        ownShipsAfloat: afloat(activePlayer),
      }),
    };
    payloads.push({ type: 'turn-started', turn });
  }
  return accept(state, { ...state, shots, turn }, command, payloads);
}

export function applyCommand(
  state: GameState,
  command: GameCommand,
  dependencies: {
    readonly rngFactory: RngFactory;
    readonly turnPolicies: TurnPolicyRegistry;
  },
): EngineResult {
  if (!isCommand(command)) return reject('INVALID_COMMAND');
  if (command.gameId !== state.gameId) return reject('WRONG_GAME');
  if (command.expectedRevision !== state.revision)
    return reject('STALE_REVISION');
  if (command.actor !== 'player-1' && command.actor !== 'player-2')
    return reject('INVALID_COMMAND');
  if (state.phase === 'finished') return reject('WRONG_PHASE');
  if (command.action.type === 'fire') {
    if (state.phase !== 'playing') return reject('WRONG_PHASE');
    return fire(
      state,
      { ...command, action: command.action },
      dependencies.turnPolicies,
    );
  }
  if (state.phase !== 'placing') return reject('WRONG_PHASE');
  if (state.confirmed[command.actor]) return reject('FLEET_LOCKED');
  if (command.action.type === 'confirm-placement')
    return confirm(state, command, dependencies);
  const checked = validatePlacement(
    state.rules,
    command.action.placement,
    false,
  );
  if (checked.status !== 'valid') return reject('INVALID_PLACEMENT');
  return accept(
    state,
    {
      ...state,
      drafts: { ...state.drafts, [command.actor]: checked.placement },
    },
    command,
    [{ type: 'placement-updated', player: command.actor }],
  );
}
