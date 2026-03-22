# Repository Discovery Guide

Use this guide when the target repository does not follow the default layout you expected.

## Discovery Goals

You are trying to answer five questions before doing bug work:

1. Where does this repository define intended behavior?
2. Where do tests already live, and which framework owns them?
3. Where should documentation changes go if the fix changes behavior or guidance?
4. Does the repository maintain release notes or a changelog?
5. What deterministic commands are safe to run for verification?

## Signals To Prefer

### Behavior sources

Look for these sources in roughly this order:

1. formal requirements or product docs
2. API contracts or schema files
3. ADRs, runbooks, or technical docs
4. existing tests that encode behavior intentionally
5. implementation comments or issue references

If the repository has no clear behavior source, say so in the report instead of pretending certainty.

### Test stack sources

Look for:

- manifest scripts in `package.json`, `pyproject.toml`, `pom.xml`, `build.gradle`, or similar
- config files such as `vitest.config.*`, `jest.config.*`, `playwright.config.*`, `cypress.config.*`, `pytest.ini`, or `tox.ini`
- nearby test files that show naming and helper conventions

Reuse the existing stack whenever possible.

### Documentation sources

Look for likely locations such as:

- `docs/`
- `adr/`, `adrs/`, or `architecture/`
- `runbooks/` or `ops/`
- component-level markdown next to code
- user help content inside an app or docs site
- `CHANGELOG.md`, release notes, or versioned docs

If no documentation structure exists, note that limitation. Do not invent a large docs architecture just to satisfy the workflow.

## Decision Rules

- If the repository has both unit and end-to-end tests, prefer the narrowest layer that credibly proves the defect.
- If an existing failing test already reproduces the issue, reuse it and tighten it if needed rather than adding a duplicate.
- If behavior is ambiguous between product intent and implementation, surface the ambiguity before changing both code and docs.
- If the bug spans multiple services or packages, keep the report explicit about which boundaries were actually verified.

## Minimum Discovery Summary

Capture these facts in your runtime notes before editing:

- primary language and runtime
- relevant package or service
- current test framework(s)
- strongest source of expected behavior
- docs locations that might need updates
- validation commands you can run safely
