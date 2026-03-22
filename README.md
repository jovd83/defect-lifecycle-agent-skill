# Defect Lifecycle Agent Skill

Enterprise-grade AgentSkill for defect intake, approved bug fixing, regression hardening, traceable reporting, and tracker-ready export artifacts.

Public repository/package name: `defect-lifecycle-agent-skill`

Stable skill trigger: `$bug-fix-lifecycle`

This repository provides:

- a clear skill contract for bug discovery and approved bug resolution
- repository-aware guidance instead of hard-coded folder assumptions
- structured markdown templates for discovery reports and fix reports
- a deterministic coverage validator for total or file-scoped checks
- canonical JSON schemas for discovery and fix reports
- Jira-ready and Linear-ready draft export artifacts
- lightweight validation and tests for maintainability
- GitHub-ready packaging and contribution guidance

## What This Skill Does

The skill helps an agent:

1. classify a request as bug reporting or bug fixing
2. discover the target repository's real testing and documentation conventions
3. reproduce or verify the defect with evidence
4. require a confirmation test before the fix when practical
5. implement the smallest credible fix
6. validate regression checks and coverage honestly
7. update only the documentation that truly changed
8. emit markdown, canonical JSON, or tracker-ready drafts as needed

## What This Skill Does Not Do

- replace incident response, SRE postmortems, or generic feature planning
- assume a specific repository layout such as `docs/functional analysis/`
- silently persist shared memory across repositories
- claim regression safety from total line coverage alone
- bypass approval for tracker bugs that are not clearly ready to fix
- embed direct Jira or Linear API clients, secrets, or auth flows

## Repository Layout

```text
defect-lifecycle-agent-skill/
|- SKILL.md
|- README.md
|- agents/openai.yaml
|- assets/
|- examples/
|- references/
|- schemas/
|- scripts/
|- tests/
|- .github/workflows/ci.yml
`- package.json
```

## Install

1. Use Node.js 18 or newer.
2. Run `npm test` to execute the built-in validation suite.
3. Run `node scripts/validate-skill.js` for a packaging smoke check.

No external dependencies are required.

## Usage

Validate total coverage:

```bash
node scripts/verify-coverage.js --coverage coverage/coverage-summary.json
```

Validate specific changed files:

```bash
node scripts/verify-coverage.js --coverage coverage/coverage-summary.json --files src/checkout/form.ts,src/checkout/validation.ts
```

Validate using a manifest:

```bash
node scripts/verify-coverage.js --manifest examples/coverage-manifest.example.json
```

Validate skill packaging:

```bash
node scripts/validate-skill.js
```

Export a Jira draft from a discovery report:

```bash
node scripts/export-tracker-artifact.js --tracker jira --input examples/sample-bug-discovery.json
```

Export a Linear resolution update from a fix report:

```bash
node scripts/export-tracker-artifact.js --tracker linear --input examples/sample-bug-fix-report.json
```

Run tests:

```bash
npm test
```

## Workflow Summary

1. Inspect the target repository and determine the real requirements, docs, and test locations.
2. Route into discovery-only or approved-fix mode.
3. Reproduce or verify the defect.
4. Add or reuse a failing confirmation test when practical.
5. Apply the smallest credible fix.
6. Re-run targeted checks and coverage validation.
7. Update only the docs, diagrams, help content, README, or changelog that truly changed.
8. Deliver the structured markdown report and optional JSON or tracker export.

## Output Model

Primary output is markdown using the templates in [assets/bug-discovery-template.md](assets/bug-discovery-template.md) and [assets/bug-fix-report-template.md](assets/bug-fix-report-template.md).

Machine-readable equivalents live in [schemas/bug-discovery-report.schema.json](schemas/bug-discovery-report.schema.json) and [schemas/bug-fix-report.schema.json](schemas/bug-fix-report.schema.json).

Exact required fields and export guidance live in [references/response-contracts.md](references/response-contracts.md) and [references/tracker-exports.md](references/tracker-exports.md).

## Memory Boundaries

- Runtime memory: active reproduction notes, diffs, logs, and validation results for the current task
- Project-local memory: deliberate artifacts written into the target repository, such as issue notes or documentation updates
- Shared memory: out of scope unless an external shared-memory skill is intentionally integrated

## Validation And Maintenance

This repo includes:

- packaging validation via [scripts/validate-skill.js](scripts/validate-skill.js)
- coverage validator tests in [tests/verify-coverage.test.js](tests/verify-coverage.test.js)
- repository smoke tests in [tests/validate-skill.test.js](tests/validate-skill.test.js)
- tracker export tests in [tests/export-tracker-artifact.test.js](tests/export-tracker-artifact.test.js)
- schema fixture tests in [tests/schema-fixtures.test.js](tests/schema-fixtures.test.js)
- maintenance guidance in [references/evaluation.md](references/evaluation.md)
- a GitHub Actions workflow in [.github/workflows/ci.yml](.github/workflows/ci.yml)

## Optional Integrations

These are related but intentionally out of scope for the current implementation:

- direct Jira or Linear API calls with secrets and auth handling
- specialized testing skills such as Playwright, Cypress, or JUnit helpers for stack-specific test authoring
- shared-memory promotion of stable cross-project debugging knowledge

## Publishability Notes

- the repo is self-contained and uses only Node built-ins
- the skill trigger remains stable for compatibility even though the public repo name is stronger
- generated tracker drafts are intended for review or for a separate organization-specific integration layer
