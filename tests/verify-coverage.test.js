"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const {
  validateCoverage,
  findCoverageEntry,
  resolveConfig,
  loadManifest
} = require("../scripts/verify-coverage");

function createCoverageFixture() {
  return {
    total: {
      lines: { pct: 92 },
      statements: { pct: 91 },
      functions: { pct: 90 },
      branches: { pct: 88 }
    },
    "C:/repo/src/checkout/form.ts": {
      lines: { pct: 85 },
      statements: { pct: 86 },
      functions: { pct: 84 },
      branches: { pct: 83 }
    },
    "C:/repo/src/checkout/validation.ts": {
      lines: { pct: 79 },
      statements: { pct: 82 },
      functions: { pct: 81 },
      branches: { pct: 78 }
    }
  };
}

test("findCoverageEntry matches normalized file suffixes", () => {
  const coverage = createCoverageFixture();
  const match = findCoverageEntry(coverage, "src\\checkout\\form.ts");
  assert.equal(match[0], "C:/repo/src/checkout/form.ts");
});

test("validateCoverage passes when total metrics exceed threshold", () => {
  const result = validateCoverage(createCoverageFixture(), { threshold: 80 });
  assert.equal(result.ok, true);
  assert.equal(result.failures.length, 0);
});

test("validateCoverage fails for scoped files under threshold", () => {
  const result = validateCoverage(createCoverageFixture(), {
    threshold: 80,
    files: ["src/checkout/form.ts", "src/checkout/validation.ts"]
  });

  assert.equal(result.ok, false);
  assert.ok(result.failures.some((failure) => failure.label === "src/checkout/validation.ts"));
});

test("resolveConfig merges manifest defaults", () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "bug-fix-lifecycle-"));
  const manifestPath = path.join(tempDir, "coverage-manifest.json");
  fs.writeFileSync(
    manifestPath,
    JSON.stringify(
      {
        coverageFile: "coverage/custom-summary.json",
        threshold: 85,
        metrics: ["lines", "branches"],
        files: ["src/a.ts"]
      },
      null,
      2
    )
  );

  const manifest = loadManifest(manifestPath);
  assert.equal(manifest.threshold, 85);

  const resolved = resolveConfig(["--manifest", manifestPath]);
  assert.equal(resolved.coverageFile, "coverage/custom-summary.json");
  assert.deepEqual(resolved.metrics, ["lines", "branches"]);
  assert.deepEqual(resolved.files, ["src/a.ts"]);
});
