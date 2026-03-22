"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const { exportTrackerArtifact, buildDiscoveryMarkdown, buildFixMarkdown } = require("../scripts/export-tracker-artifact");

const discovery = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "examples", "sample-bug-discovery.json"), "utf8").replace(/^\uFEFF/, "")
);
const fixReport = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "examples", "sample-bug-fix-report.json"), "utf8").replace(/^\uFEFF/, "")
);

test("Jira discovery export produces an issue draft", () => {
  const artifact = exportTrackerArtifact(discovery, "jira");
  assert.equal(artifact.tracker, "jira");
  assert.equal(artifact.artifactType, "issue-draft");
  assert.match(artifact.summary, /^\[Bug\]/);
  assert.match(artifact.descriptionMarkdown, /h2\. Defect Description/);
  assert.deepEqual(artifact.labels, ["bug", "checkout", "validation"]);
});

test("Linear fix export produces a resolution update", () => {
  const artifact = exportTrackerArtifact(fixReport, "linear");
  assert.equal(artifact.tracker, "linear");
  assert.equal(artifact.artifactType, "resolution-update");
  assert.match(artifact.commentMarkdown, /h2\. Root Cause/);
  assert.deepEqual(artifact.labelNames, ["bug", "resolved", "checkout"]);
});

test("markdown builders include the expected sections", () => {
  assert.match(buildDiscoveryMarkdown(discovery), /h2\. Test And Detection Gap/);
  assert.match(buildFixMarkdown(fixReport), /h2\. Verification After Fix/);
});
