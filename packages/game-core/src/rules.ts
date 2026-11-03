export type PlayerId = 'player-1' | 'player-2';
export type ContactRule = 'allow' | 'no-orthogonal' | 'no-touch';
export type HitDisclosure = 'hit-only' | 'ship-type';
export type SunkDisclosure = 'sunk-only' | 'ship-type' | 'ship-cells';

export interface Coord {
  readonly row: number;
  readonly col: number;
}

export interface ShipSpec {
  readonly id: string;
  readonly nameKey: string;
  readonly length: number;
}

export interface ShipPlacement {
  readonly shipId: string;
  readonly start: Coord;
  readonly orientation: 'horizontal' | 'vertical';
}

export interface Placement {
  readonly ships: readonly ShipPlacement[];
}

export interface TurnConfiguration {
  readonly policyId: string;
  readonly policyVersion: number;
  readonly quota:
    | { readonly kind: 'fixed'; readonly count: number }
    | { readonly kind: 'own-afloat' };
  readonly extraShotOnHit: boolean;
}

export interface RuleSet {
  readonly schemaVersion: 1;
  readonly board: { readonly rows: number; readonly cols: number };
  readonly fleet: readonly ShipSpec[];
  readonly contactRule: ContactRule;
  readonly turn: TurnConfiguration;
  readonly information: {
    readonly hit: HitDisclosure;
    readonly sunk: SunkDisclosure;
  };
  readonly startingPlayer: 'random' | PlayerId;
}

export interface RuleSignatures {
  readonly rulesSignature: string;
  readonly strategySignature: string;
}

export interface RuleIssue {
  readonly code:
    | 'INVALID_SHAPE'
    | 'INVALID_VALUE'
    | 'DUPLICATE_SHIP_ID'
    | 'SHIP_TOO_LONG'
    | 'FLEET_TOO_LARGE'
    | 'INCONSISTENT_TURN_CONFIG'
    | 'NO_VALID_PLACEMENT';
  readonly path: string;
}

export type RuleValidationResult =
  | {
      readonly status: 'valid';
      readonly rules: RuleSet;
      readonly signatures: RuleSignatures;
      readonly witness: Placement;
    }
  | { readonly status: 'invalid'; readonly issues: readonly RuleIssue[] }
  | {
      readonly status: 'unsupported';
      readonly reason: 'schema-version' | 'turn-policy';
    }
  | { readonly status: 'inconclusive'; readonly reason: 'search-budget' };

// A schema check deliberately cannot authorize a game start.
export type RuleSchemaValidationResult =
  | {
      readonly status: 'schema-valid';
      readonly rules: RuleSet;
      readonly signatures: RuleSignatures;
    }
  | Extract<
      RuleValidationResult,
      { readonly status: 'invalid' | 'unsupported' }
    >;
