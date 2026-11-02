Status: Geaccepteerd

Versie: 1.0

Laatst gewijzigd: 2026-11-02

Gerelateerd: [Werkinstructies](../AGENTS.md), [workflowbesluit](../docs/adr/0050-review-and-task-workflow.md), [tooling](../docs/16-tooling-mcp.md#beveiliging-van-main)

# Lokale bescherming van main

Activeer na iedere nieuwe clone, vóór wijzigingen:

```sh
git config --local core.hooksPath .githooks
git config --get core.hooksPath
```

De tweede opdracht moet `.githooks` tonen. Deze instelling geldt alleen voor deze checkout en wordt niet automatisch meegekopieerd bij een clone.

- `pre-commit` weigert gewone commits en amend op main.
- `pre-merge-commit` weigert lokaal aangemaakte mergecommits op main.
- `pre-push` weigert iedere update van de remote-ref `refs/heads/main`, ook vanuit een andere lokale branch, bij force-push of bij verwijderen.

Werk op een taakbranch, push die branch en open een PR. Merge via GitHub na menselijke goedkeuring; haal het resultaat daarna op met `git pull --ff-only`. Die fast-forward maakt geen lokale commit en blijft mogelijk.

Hooks zijn bescherming tegen fouten in deze checkout. Ze kunnen technisch worden overgeslagen of verwijderd en beveiligen andere clones en API-/webwijzigingen niet. De GitHub-ruleset moet de servergrens afdwingen; de actuele activatie staat in het toolingdocument. Agents mogen hooks of serverregels niet omzeilen om een wijziging te laten slagen.
