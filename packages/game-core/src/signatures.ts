import type { RuleSet, RuleSignatures } from './rules.js';

// This explicit projection keeps presentation fields out of both signatures.
// Keys at every level are written in ASCII order; fleet order is semantic by ID.
export function getRuleSignatures(rules: RuleSet): RuleSignatures {
  const board = { cols: rules.board.cols, rows: rules.board.rows };
  const fleet = rules.fleet.map(({ id, length }) => ({ id, length }));
  fleet.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  const information = {
    hit: rules.information.hit,
    sunk: rules.information.sunk,
  };
  const { quota } = rules.turn;
  const turn = {
    extraShotOnHit: rules.turn.extraShotOnHit,
    policyId: rules.turn.policyId,
    policyVersion: rules.turn.policyVersion,
    quota:
      quota.kind === 'fixed'
        ? { count: quota.count, kind: quota.kind }
        : { kind: quota.kind },
  };
  return {
    rulesSignature:
      'rules/v1:' +
      JSON.stringify({
        board,
        contactRule: rules.contactRule,
        fleet,
        information,
        schemaVersion: rules.schemaVersion,
        startingPlayer: rules.startingPlayer,
        turn,
      }),
    strategySignature:
      'strategy/v1:' +
      JSON.stringify({
        board,
        contactRule: rules.contactRule,
        fleet,
        information,
      }),
  };
}
