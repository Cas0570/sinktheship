export type {
  PlayerId,
  ContactRule,
  HitDisclosure,
  SunkDisclosure,
  Coord,
  ShipSpec,
  ShipPlacement,
  Placement,
  TurnConfiguration,
  RuleSet,
  RuleSignatures,
  RuleIssue,
  RuleValidationResult,
  RuleSchemaValidationResult,
} from './rules.js';
export { createV1RuleSet } from './presets.js';
export { getRuleSignatures } from './signatures.js';
export { validateRuleSetSchema } from './validate-rules.js';
export { isWithinBoard, getShipCells, rotateShip } from './geometry.js';
export { validatePlacement } from './placement.js';
export type {
  PlacementDraft,
  PlacementIssue,
  PlacementValidationResult,
} from './placement.js';
export { validateRuleSet } from './validate-placement-existence.js';
export type { Rng, RngState, RngFactory, RngSeed } from './rng.js';
export { createRng, rngFactory } from './rng.js';
export type { RandomSeedPlan, RandomStreams } from './random-streams.js';
export { createRandomStreams } from './random-streams.js';
export type {
  PrivateShotRecord,
  TurnState,
  GameBase,
  PlacingState,
  PlayingState,
  FinishedState,
  GameState,
  GameAction,
  GameCommand,
  EventPayload,
  GameEvent,
  CommandError,
  EngineResult,
  TurnContext,
  TurnPolicy,
  TurnPolicyRegistry,
} from './game-types.js';
export { createGame, applyCommand } from './engine.js';
export { fixedTurnPolicy, turnPolicies } from './turn-policy.js';
