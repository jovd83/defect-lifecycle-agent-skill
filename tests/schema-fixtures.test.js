"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");

function loadJson(relativePath) {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", relativePath), "utf8").replace(/^\uFEFF/, "")
  );
}

function assertRequiredProperties(example, schema, prefix = "") {
  for (const requiredKey of schema.required || []) {
    assert.ok(example[requiredKey] !== undefined, `Missing required key: ${prefix}${requiredKey}`);
  }
}

test("discovery example satisfies top-level schema requirements", () => {
  const schema = loadJson("schemas/bug-discovery-report.schema.json");
  const example = loadJson("examples/sample-bug-discovery.json");
  assertRequiredProperties(example, schema);
  assert.equal(example.mode, "report-only");
  assertRequiredProperties(example.evidence, schema.properties.evidence, "evidence.");
  assertRequiredProperties(example.environment, schema.properties.environment, "environment.");
  assertRequiredProperties(example.reproduction, schema.properties.reproduction, "reproduction.");
  assertRequiredProperties(example.scopeAndImpact, schema.properties.scopeAndImpact, "scopeAndImpact.");
});

test("fix example satisfies top-level schema requirements", () => {
  const schema = loadJson("schemas/bug-fix-report.schema.json");
  const example = loadJson("examples/sample-bug-fix-report.json");
  assertRequiredProperties(example, schema);
  assert.equal(example.mode, "approved-fix");
  assertRequiredProperties(example.context, schema.properties.context, "context.");
  assertRequiredProperties(example.rootCause, schema.properties.rootCause, "rootCause.");
  assertRequiredProperties(example.confirmationTestBeforeFix, schema.properties.confirmationTestBeforeFix, "confirmationTestBeforeFix.");
  assertRequiredProperties(example.codeChanges, schema.properties.codeChanges, "codeChanges.");
  assertRequiredProperties(example.regressionProtection, schema.properties.regressionProtection, "regressionProtection.");
  assertRequiredProperties(example.documentationUpdates, schema.properties.documentationUpdates, "documentationUpdates.");
  assertRequiredProperties(example.verificationAfterFix, schema.properties.verificationAfterFix, "verificationAfterFix.");
});
