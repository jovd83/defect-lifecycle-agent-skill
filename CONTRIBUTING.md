# Contributing

## Development Loop

1. Edit the skill or supporting artifacts.
2. Run `node scripts/validate-skill.js`.
3. Run `npm test`.
4. Update `README.md`, templates, or references when the workflow changed materially.

## Design Principles

- Keep `SKILL.md` lean and operational. Move detailed guidance into `references/`.
- Prefer repository-aware defaults over hard-coded folder assumptions.
- Add guardrails only when they materially improve reliability.
- Keep runtime memory ephemeral and persist only deliberate project-local artifacts.
- Avoid adding dependencies unless a deterministic, testable script truly needs them.

## Pull Request Expectations

A strong contribution should:

- preserve or improve the clarity of the skill trigger
- keep templates aligned with the response contract
- include tests or validation updates when scripts change
- explain any new files and why they earn their maintenance cost
