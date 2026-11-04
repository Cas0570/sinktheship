import type {
  Coord,
  Placement,
  PlayerId,
  RuleSet,
  RuleSignatures,
} from './rules.js';
import type { PlacementDraft } from './placement.js';
import type { RngState } from './rng.js';

export interface PrivateShotRecord {
  readonly shotIndex: number;
  readonly shooter: PlayerId;
  readonly coord: Coord;
  readonly kind: 'miss' | 'hit' | 'sunk';
  readonly shipId: string | null;
}

export interface TurnState {
  readonly number: number;
  readonly activePlayer: PlayerId;
  readonly shotsRemaining: number;
}

export interface GameBase {
  readonly schemaVersion: 1;
  readonly engineVersion: string;
  readonly gameId: string;
  readonly revision: number;
  readonly nextEventSequence: number;
  readonly rules: RuleSet;
  readonly signatures: RuleSignatures;
  readonly starterRng: RngState;
  readonly shots: readonly PrivateShotRecord[];
}

export interface PlacingState extends GameBase {
  readonly phase: 'placing';
  readonly drafts: Readonly<Record<PlayerId, PlacementDraft>>;
  readonly confirmed: Readonly<Record<PlayerId, boolean>>;
}

export interface PlayingState extends GameBase {
  readonly phase: 'playing';
  readonly starter: PlayerId;
  readonly placements: Readonly<Record<PlayerId, Placement>>;
  readonly turn: TurnState;
}

export interface FinishedState extends GameBase {
  readonly phase: 'finished';
  readonly starter: PlayerId;
  readonly placements: Readonly<Record<PlayerId, Placement>>;
  readonly turn: TurnState;
  readonly winner: PlayerId;
}

export type GameState = PlacingState | PlayingState | FinishedState;

export type GameAction =
  | { readonly type: 'set-placement'; readonly placement: PlacementDraft }
  | { readonly type: 'confirm-placement' }
  | { readonly type: 'fire'; readonly coord: Coord };

export interface GameCommand {
  readonly gameId: string;
  readonly commandId: string;
  readonly expectedRevision: number;
  readonly actor: PlayerId;
  readonly action: GameAction;
}

export type EventPayload =
  | { readonly type: 'placement-updated'; readonly player: PlayerId }
  | { readonly type: 'fleet-confirmed'; readonly player: PlayerId }
  | { readonly type: 'game-started'; readonly starter: PlayerId }
  | { readonly type: 'shot-resolved'; readonly record: PrivateShotRecord }
  | { readonly type: 'turn-started'; readonly turn: TurnState }
  | { readonly type: 'game-finished'; readonly winner: PlayerId };

export interface GameEvent {
  readonly sequence: number;
  readonly revision: number;
  readonly commandId: string;
  readonly payload: EventPayload;
}

export type CommandError =
  | 'WRONG_GAME'
  | 'STALE_REVISION'
  | 'INVALID_COMMAND'
  | 'WRONG_PHASE'
  | 'FLEET_LOCKED'
  | 'INVALID_PLACEMENT'
  | 'INCOMPLETE_FLEET'
  | 'NOT_YOUR_TURN'
  | 'OUT_OF_BOUNDS'
  | 'ALREADY_SHOT';

export type EngineResult =
  | {
      readonly status: 'accepted';
      readonly state: GameState;
      readonly events: readonly GameEvent[];
    }
  | { readonly status: 'rejected'; readonly error: CommandError };

export interface TurnContext {
  readonly rules: RuleSet;
  readonly activePlayer: PlayerId;
  readonly shotsRemaining: number;
  readonly ownShipsAfloat: number;
}

export interface TurnPolicy {
  readonly id: string;
  readonly version: number;
  beginTurn(context: TurnContext): number;
  afterShot(
    context: TurnContext,
    outcome: 'miss' | 'hit' | 'sunk',
  ): { readonly switchPlayer: boolean; readonly shotsRemaining: number };
}

export interface TurnPolicyRegistry {
  get(id: string, version: number): TurnPolicy | undefined;
}
