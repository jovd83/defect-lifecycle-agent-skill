# Coverage Policy

Use `scripts/verify-coverage.js` as a deterministic guardrail, not as a substitute for good test design.

## Defaults

- default threshold: `80`
- default metrics: `lines, statements, functions, branches`
- default scope: total project coverage when no file list is provided

## Prefer Scoped Validation When You Can

When the bug fix is localized and the coverage summary includes per-file entries, prefer validating the changed files:

```bash
node scripts/verify-coverage.js --coverage coverage/coverage-summary.json --files src/checkout/form.ts,src/checkout/validation.ts
```

For repeatable CI usage, prefer a manifest:

```bash
node scripts/verify-coverage.js --manifest examples/coverage-manifest.example.json
```

## When Not To Over-Claim

Do not report that a fix is safe simply because the total line coverage stayed above the threshold.

Call out these situations explicitly:

- coverage data was unavailable
- the changed files were not present in the summary
- only total coverage was validated, not changed files
- branch-heavy logic remains weakly tested even though line coverage passed

## Threshold Changes

Lowering the threshold should be unusual and justified by repository policy, not convenience. If a repository already has stricter coverage gates, follow those instead of this skill's default.
