# Changelog

## 2.2.0 - 2026-04-19

- aligned the skill frontmatter and trigger with the canonical `defect-lifecycle-agent-skill` identity
- synced public docs, schema identifiers, and validation metadata with the canonical repository
- confirmed `jovd83/defect-lifecycle-agent-skill` as the active source of truth before retiring the legacy private repo

## 2.1.0 - 2026-03-21

- polished the public-facing repo and package identity to `defect-lifecycle-agent-skill`
- added canonical JSON schemas and example artifacts for discovery and fix reports
- added Jira-ready and Linear-ready tracker draft exports with a dedicated CLI script
- expanded validation coverage to include schema fixtures and tracker export behavior

## 2.0.0 - 2026-03-21

- rewrote the core skill contract around repository-aware bug reporting and approved-fix execution
- replaced brittle, emoji-heavy templates with stronger traceable report formats
- upgraded the coverage helper to support thresholds, metrics, manifests, and file-scoped validation
- added references, examples, validation scripts, tests, install metadata, and GitHub workflow packaging

## [2.2.1] - 2026-04-30

### Changed
- Trim `SKILL.md` frontmatter to fit the 1000-character dispatcher limit (description trim, migrate non-dispatcher fields to body).

