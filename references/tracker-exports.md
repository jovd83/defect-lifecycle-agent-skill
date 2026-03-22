# Tracker Export Artifacts

This skill keeps tracker integration at the artifact boundary instead of calling vendor APIs directly.

## Supported Outputs

Use the canonical JSON report first, then export tracker-specific drafts.

### Jira

Discovery report to issue draft:

```bash
node scripts/export-tracker-artifact.js --tracker jira --input examples/sample-bug-discovery.json
```

Fix report to resolution update draft:

```bash
node scripts/export-tracker-artifact.js --tracker jira --input examples/sample-bug-fix-report.json
```

The Jira export contains plain JSON fields such as `summary`, `priorityName`, `labels`, and `descriptionMarkdown` or `commentMarkdown`.

### Linear

Discovery report to issue draft:

```bash
node scripts/export-tracker-artifact.js --tracker linear --input examples/sample-bug-discovery.json
```

Fix report to resolution update draft:

```bash
node scripts/export-tracker-artifact.js --tracker linear --input examples/sample-bug-fix-report.json
```

The Linear export contains plain JSON fields such as `title`, `priority`, `labelNames`, and `descriptionMarkdown` or `commentMarkdown`.

## Why This Boundary Exists

- avoids hard-coding secrets or API clients into the skill repo
- keeps the core skill reusable across organizations
- makes the artifacts auditable before they are pasted into a tracker or sent through a separate integration layer

## Recommended Flow

1. Produce the canonical markdown report or machine-readable JSON report.
2. Export a tracker draft with `scripts/export-tracker-artifact.js`.
3. Review labels, project key, team key, and priority mapping.
4. Send the artifact through organization-specific Jira or Linear automation if desired.
