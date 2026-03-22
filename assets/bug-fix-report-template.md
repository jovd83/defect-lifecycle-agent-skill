Respond in markdown using the exact section headings below. Use fenced code blocks only for short excerpts. Summarize long logs instead of pasting them in full.

## Summary
- Title: [short bug title]
- Status: [resolved | mitigated | blocked]
- Severity: [critical | high | medium | low]
- Resolution owner: [team, service, or engineer]

## User Or Issue Context
> [quote the bug description or issue summary]

## Scope Of Investigation
- Affected area: [module, page, endpoint, workflow, or job]
- Source of truth reviewed: [story, spec, ticket, code path, support note, or `none`]
- Repository conventions used: [test framework, docs path, changelog path, or `none`]

## Expected Behavior
[State the intended behavior and how it was validated.]

## Observed Failure
[State the concrete failure mode, user impact, and reproduction signal.]

## Root Cause
- Technical cause: [what was broken or missing]
- Trigger condition: [what inputs or state exposed it]
- Why it escaped earlier: [test gap, requirement gap, monitoring gap, or review gap]

## Confirmation Test Before Fix
- Test type: [unit | integration | API | component | e2e | manual]
- Location: [path or `not added`]
- Result before fix: [failed | blocked]
- Notes: [brief summary of the failure]

## Code Changes
- Files changed: [list]
- Fix strategy: [short explanation]
- Risk notes: [brief impact on adjacent areas]

## Regression Protection
- Additional tests added or updated: [list or `none`]
- Coverage validation: [command and result, or why unavailable]
- Regression checks run: [commands or checks]

## Documentation Updates
- Requirements or acceptance criteria: [updated | not needed | unavailable]
- Technical docs: [updated | not needed | unavailable]
- Diagrams or runbooks: [updated | not needed | unavailable]
- Help pages or README: [updated | not needed | unavailable]
- Changelog: [updated | not present | not needed]

## Verification After Fix
- Confirmation test result: [passed | blocked]
- Additional validation: [brief summary]

## Residual Risk And Follow-Up
[Call out anything intentionally left out of scope, still uncertain, or worth addressing next.]
