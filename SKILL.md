---
name: bug-fix-lifecycle
description: Use when Codex must report a newly discovered defect, implement an approved bug fix, or harden regression coverage and documentation around a known bug. This skill enforces repository-aware bug intake, failing confirmation tests before fixes, scoped verification, documentation updates when warranted, and a structured resolution report.
metadata:
  author: jovd83
  version: "2.1.0"
---

# Bug Fix Lifecycle

Use this skill to move a defect from intake through verified resolution without skipping the evidence that makes the fix trustworthy.

## Responsibilities

- report newly discovered defects with repository-grounded evidence
- fix approved bugs with a failing confirmation test before the implementation when practical
- explain the requirement gap, test gap, and root cause in plain engineering language
- update affected documentation when product behavior, developer guidance, or operator guidance changed
- deliver a structured report that another engineer can audit quickly

## Boundaries

- Do not use this skill for net-new feature work, broad refactors unrelated to a defect, or postmortem-only incident analysis.
- Do not assume the repository uses `docs/functional analysis/`, `docs/technical/`, `frontend-tests/`, or any other fixed layout. Discover the actual conventions first.
- Do not start fixing tracker bugs unless the user explicitly asks for the fix or the issue is clearly marked approved.
- Do not patch code before you have either reproduced the failure or explained precisely why deterministic reproduction is currently blocked.
- Do not treat global line coverage alone as proof of adequate regression safety.
- Do not create persistent shared-memory behavior inside this skill. Shared memory belongs behind an external integration boundary such as a dedicated shared-memory skill.

## Inputs To Confirm Or Infer

Confirm or infer these inputs before heavy edits:

- execution mode: `report-only` or `approved-fix`
- defect source: user description, tracker ticket, failing test, log, screenshot, or monitoring alert
- affected surface: UI flow, service, API, job, component, or integration point
- repository conventions for requirements, docs, diagrams, help content, and changelog updates
- existing test stack, coverage tooling, and whether JSON coverage summaries are available
- whether the task must produce only markdown or also machine-readable artifacts for automation
- whether the output should also be exported as a Jira-ready or Linear-ready tracker draft

Defaults:

- assume `report-only` when the user says to log or document a bug
- assume `approved-fix` when the user says to fix an identified bug directly
- reuse the repository's existing test and documentation stack when present
- keep runtime notes ephemeral unless the user asks you to persist local project artifacts

## Workflow

### 1. Establish scope and approval state

1. Classify the request as bug discovery, approved bug fix, or blocked triage.
2. Identify the source-of-truth artifact if one exists: issue ID, failing test, support ticket, stack trace, or user report.
3. If the work is fix-oriented but approval is ambiguous, pause and ask only when proceeding would be risky.

### 2. Discover repository conventions

Inspect the target repository before assuming paths or tools.

- Find manifests and tool configs such as `package.json`, `pyproject.toml`, `pom.xml`, `go.mod`, `Cargo.toml`, `playwright.config.*`, `cypress.config.*`, `jest.config.*`, `vitest.config.*`, or CI workflows.
- Locate where the repository keeps product requirements, ADRs, diagrams, runbooks, help content, or changelog history.
- Identify the existing test layers and their ownership: unit, integration, API, component, browser, or end-to-end.
- Read [references/repository-discovery.md](references/repository-discovery.md) when the layout is non-obvious or inconsistent.

### 3. Choose the execution path

#### Discovery-only path

Use this path when the user wants the defect reported, triaged, or written up but not fixed.

1. Reproduce the issue when practical, or document why reproduction is blocked.
2. Check the expected behavior against the best available source of truth.
3. Read [assets/bug-discovery-template.md](assets/bug-discovery-template.md).
4. Produce the bug report using the required headings from the template.
5. Stop after the report unless the user expands the scope.

#### Approved-fix path

Use this path when the bug is ready to be fixed.

1. Reproduce or otherwise verify the failure with evidence.
2. Identify the requirement gap, documentation gap, or assumption gap that allowed the defect.
3. Create a focused confirmation test that fails for the current bug when practical.
4. Explain why the existing tests or monitoring failed to catch the problem.
5. Implement the minimal credible fix.
6. Re-run the confirmation test and a right-sized regression set.
7. Validate coverage with `node scripts/verify-coverage.js` when a JSON summary is available.
8. Update docs only where the bug changed user-visible behavior, developer contracts, or operator expectations.
9. Read [assets/bug-fix-report-template.md](assets/bug-fix-report-template.md) and [references/response-contracts.md](references/response-contracts.md).
10. Deliver the structured resolution report.

### 4. Coverage and regression discipline

Use the repository's native test commands. Do not invent a test stack.

- Prefer the narrowest verification that proves the bug, then broaden to nearby regression risks.
- When JSON coverage data exists, run `node scripts/verify-coverage.js --coverage <path>`.
- When the change is scoped to specific files, prefer file-scoped validation with `--files` or `--manifest`.
- Read [references/coverage-policy.md](references/coverage-policy.md) before lowering or changing thresholds.

### 5. Documentation and artifact updates

Only update the artifacts that truly changed.

- requirements or acceptance criteria when the defect exposed a missing or ambiguous rule
- technical docs when implementation behavior or operational guidance changed
- diagrams when data flow, state flow, or architecture changed materially
- help content when user guidance was wrong or incomplete
- changelog when the repository already maintains one
- README only when setup, usage, or development workflow changed

## Response Contract

For discovery-only work, use the headings from [assets/bug-discovery-template.md](assets/bug-discovery-template.md).

For approved-fix work, use the headings from [assets/bug-fix-report-template.md](assets/bug-fix-report-template.md). The report must make these points clear:

- what failed and who was affected
- how the expected behavior was validated
- why the bug slipped through
- how the confirmation test proved the defect before the fix
- what changed in code, tests, and docs
- what was validated after the fix
- what residual risks or out-of-scope follow-up items remain

Read [references/response-contracts.md](references/response-contracts.md) when you need the exact required fields and optional machine-readable appendix guidance.

When the caller wants machine-readable or tracker-ready output:

- emit canonical JSON that matches [schemas/bug-discovery-report.schema.json](schemas/bug-discovery-report.schema.json) or [schemas/bug-fix-report.schema.json](schemas/bug-fix-report.schema.json)
- use `node scripts/export-tracker-artifact.js --tracker jira|linear --input <report.json>` to generate a tracker draft artifact
- read [references/tracker-exports.md](references/tracker-exports.md) before claiming a tracker export is ready

## Memory Model

- Runtime memory: live notes, reproduction data, stack traces, diffs, and the active verification plan for the current task only.
- Project-local memory: issue writeups, markdown reports, local docs, or other repository artifacts deliberately saved in the target project.
- Shared memory: out of scope for this skill. If cross-project reuse is needed, integrate a separate shared-memory skill rather than embedding that responsibility here.

Do not automatically promote runtime findings into persistent storage. Persist only what improves traceability for the current project.

## Failure Handling

- If the bug cannot be reproduced, state what evidence exists, what was attempted, and what blocks confirmation.
- If no requirements source exists, state the limitation and use the strongest available signal such as observed UX, API contract, or nearby code comments.
- If no automated tests exist, document the gap explicitly and add the smallest useful regression protection when the user asked for a fix.
- If coverage JSON is unavailable, say so plainly instead of pretending the validator ran.
- If docs or diagrams do not exist in the repository, do not invent a documentation architecture unless the user asks for one.
- If the bug implies a broader product decision rather than a straightforward defect, surface the ambiguity instead of forcing a narrow technical fix.

## Gotchas

- **Deterministic Reproduction**: Not every defect is reproducible in a limited environment (e.g., race conditions, external API dependencies). Always document the blocking reason if a confirmation test cannot be created.
- **Script Dependencies**: This skill relies on `scripts/verify-coverage.js` and `scripts/export-tracker-artifact.js`. If these are missing or return a non-zero exit code, automated validation and export steps will fail.
- **Approval Ambiguity**: The `approved-fix` path should only be taken when there is clear intent from the user. Automating fixes for unconfirmed tracker issues can result in unintended side effects.
- **Test Layer Gaps**: This skill prefers the repository's native test stack. If the repository has no tests, the agent will attempt to add minimal safety but may miss broader regression risks.

## Resource Map

- `assets/bug-discovery-template.md`: required markdown template for discovery-only reports
- `assets/bug-fix-report-template.md`: required markdown template for resolution reports
- `scripts/verify-coverage.js`: deterministic coverage validator for total or file-scoped checks
- `scripts/validate-skill.js`: smoke validator for skill packaging and required artifacts
- `references/repository-discovery.md`: repository inspection and convention-mapping guide
- `references/response-contracts.md`: exact reporting requirements and extension guidance
- `references/coverage-policy.md`: threshold policy and coverage-validation usage
- `references/evaluation.md`: maintenance and evaluation strategy for this skill
- `examples/example-prompts.md`: representative trigger prompts and expected routing
- `examples/coverage-manifest.example.json`: sample manifest for scoped coverage validation
- `examples/sample-bug-discovery.json`: canonical machine-readable discovery report example
- `examples/sample-bug-fix-report.json`: canonical machine-readable fix report example
- `schemas/bug-discovery-report.schema.json`: schema for machine-readable discovery reports
- `schemas/bug-fix-report.schema.json`: schema for machine-readable fix reports
- `scripts/export-tracker-artifact.js`: export canonical reports into Jira-ready or Linear-ready draft artifacts
- `references/tracker-exports.md`: tracker artifact mapping and usage guidance

## When To Read Extra References

- Read `references/repository-discovery.md` when the repository's documentation or test layout is unclear.
- Read `references/response-contracts.md` before composing a substantial bug report or fix report.
- Read `references/coverage-policy.md` when the default threshold, metrics, or scoping rules are in question.
- Read `references/tracker-exports.md` when the user wants Jira or Linear-ready artifacts.
- Read `references/evaluation.md` when extending, validating, or regression-testing this skill itself.
