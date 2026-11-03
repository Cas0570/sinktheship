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
