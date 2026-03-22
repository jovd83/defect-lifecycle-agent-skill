# Example Prompts

## Discovery Only

- "Log this bug: users can submit the checkout form with an impossible birth date."
- "Write up a defect report for the profile page silently dropping avatar uploads on Safari."

Expected path:

- reproduce if practical
- validate expected behavior from repo evidence
- use the discovery template only
- stop after the report

## Approved Fix

- "Fix approved bug: invoice export returns a 500 when no line items are present."
- "Patch this bug and update any docs or tests that should have covered it."

Expected path:

- reproduce the bug
- add or reuse a failing confirmation test when practical
- implement the smallest credible fix
- validate regression coverage and update only necessary docs
- use the resolution report template

## Ambiguous Approval

- "There is a bug in the refund flow."

Expected path:

- triage the request
- if approval to implement is unclear, ask before mutating code
- do not skip the distinction between reporting and fixing

## Repo Without Standard Docs Layout

- "Fix this bug in our CLI and tell me what docs need updating."

Expected path:

- discover actual doc locations first
- do not assume `docs/functional analysis/` or other hard-coded folders
