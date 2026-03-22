# Response Contracts

This skill supports two report modes: discovery-only and approved-fix.

## Discovery-Only Contract

Use [../assets/bug-discovery-template.md](../assets/bug-discovery-template.md).

Required qualities:

- clearly separates observed behavior from expected behavior
- states whether reproduction succeeded, failed, or was blocked
- names the strongest source of truth used to judge whether this is a real defect
- explains the test or detection gap even when no code change is being made
- ends with a concrete next step instead of vague triage language

## Approved-Fix Contract

Use [../assets/bug-fix-report-template.md](../assets/bug-fix-report-template.md).

Required qualities:

- describes both the bug impact and the engineering scope
- explains root cause, trigger condition, and why the issue escaped earlier
- records how the defect was verified before the fix
- records what changed in code, tests, and documentation
- states exactly what was and was not validated after the fix
- leaves an explicit residual-risk note when uncertainty remains

## Optional Machine-Readable Appendix

When the caller asks for automation-friendly output, add a final appendix named `## Machine-Readable Summary` containing compact JSON with these keys:

```json
{
  "mode": "report-only",
  "title": "string",
  "status": "new",
  "severity": "high",
  "affectedArea": "checkout",
  "reproduced": true,
  "testsUpdated": false,
  "docsUpdated": ["docs/technical/checkout.md"],
  "residualRisk": "string"
}
```

Keep the appendix brief. The markdown report remains the primary artifact unless the caller explicitly wants JSON-first output.

For full machine-readable artifacts, prefer the canonical schema files:

- [../schemas/bug-discovery-report.schema.json](../schemas/bug-discovery-report.schema.json)
- [../schemas/bug-fix-report.schema.json](../schemas/bug-fix-report.schema.json)

## Style Rules

- Prefer repository terms over generic placeholders when the names are known.
- Quote user-reported wording only in the context section, not throughout the report.
- Summarize long logs instead of dumping them.
- Be precise about what is unavailable, inferred, or unverified.
