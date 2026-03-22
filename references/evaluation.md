# Evaluation Strategy

Use this checklist when extending or regression-testing the skill itself.

## Core Evaluation Questions

1. Does the skill correctly distinguish discovery-only work from approved-fix work?
2. Does it avoid assuming repository paths that are not present?
3. Does it require a failing confirmation test before a fix when practical?
4. Does it explain why the issue escaped earlier instead of only describing the code change?
5. Does it update docs only when behavior or guidance truly changed?
6. Does it report missing evidence honestly when reproduction, coverage, or docs are unavailable?
7. Do the canonical JSON examples stay aligned with the schemas and tracker export behavior?

## Suggested Prompt Set

- "Log this bug: password reset succeeds but the confirmation email is never sent."
- "Fix approved bug: checkout throws 500 when date_of_birth is blank."
- "Investigate this flaky issue and tell me whether it is a real bug or missing test data."
- "Patch this defect in a repo with no docs folder and no changelog."
- "Fix this API validation bug and prove the changed endpoints stay above 85 percent coverage."

## Pass Criteria

A strong run should:

- choose the right execution path
- discover the repo's real conventions
- produce the required report sections without filler
- generate valid canonical JSON when requested
- export tracker drafts with the right artifact type and priority mapping
- keep the fix scope tight
- verify the fix with a right-sized test plan
- state residual risks clearly

## Maintenance Triggers

Review the skill when:

- teams repeatedly override the same instruction
- the output contract is too vague for automation consumers
- the coverage validator no longer matches common coverage-summary formats
- examples drift from the actual workflow
- a new testing skill should become an explicit dependency or routing target
