"use strict";

const fs = require("fs");
const path = require("path");

const REQUIRED_FILES = [
  "SKILL.md",
  "README.md",
  "LICENSE",
  "package.json",
  "agents/openai.yaml",
  "assets/bug-discovery-template.md",
  "assets/bug-fix-report-template.md",
  "references/repository-discovery.md",
  "references/response-contracts.md",
  "references/coverage-policy.md",
  "references/evaluation.md",
  "references/tracker-exports.md",
  "examples/example-prompts.md",
  "examples/coverage-manifest.example.json",
  "examples/sample-bug-discovery.json",
  "examples/sample-bug-fix-report.json",
  "schemas/bug-discovery-report.schema.json",
  "schemas/bug-fix-report.schema.json",
  "scripts/verify-coverage.js",
  "scripts/export-tracker-artifact.js",
  "tests/verify-coverage.test.js",
  "tests/validate-skill.test.js",
  "tests/export-tracker-artifact.test.js",
  "tests/schema-fixtures.test.js"
];

function readText(rootDir, relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), "utf8").replace(/^\uFEFF/, "");
}

function parseFrontmatter(markdown) {
  const normalized = markdown.replace(/^\uFEFF/, "");
  const match = normalized.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) {
    throw new Error("SKILL.md is missing YAML frontmatter.");
  }

  const lines = match[1].split(/\r?\n/);
  const result = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();
    value = value.replace(/^"|"$/g, "");
    result[key] = value;
  }

  return result;
}

function parseSimpleYaml(text) {
  const result = {};
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();
    value = value.replace(/^"|"$/g, "");
    result[key] = value;
  }
  return result;
}

function validateSkill(rootDir = path.join(__dirname, "..")) {
  const errors = [];

  for (const relativePath of REQUIRED_FILES) {
    if (!fs.existsSync(path.join(rootDir, relativePath))) {
      errors.push(`Missing required file: ${relativePath}`);
    }
  }

  if (errors.length > 0) {
    return errors;
  }

  const skillFrontmatter = parseFrontmatter(readText(rootDir, "SKILL.md"));
  if (!skillFrontmatter.name) {
    errors.push("SKILL.md frontmatter must include 'name'.");
  }
  if (!skillFrontmatter.description) {
    errors.push("SKILL.md frontmatter must include 'description'.");
  }

  const openaiYaml = parseSimpleYaml(readText(rootDir, "agents/openai.yaml"));
  for (const key of ["display_name", "short_description", "default_prompt"]) {
    if (!openaiYaml[key]) {
      errors.push(`agents/openai.yaml must include '${key}'.`);
    }
  }

  const packageJson = JSON.parse(readText(rootDir, "package.json"));
  if (!packageJson.scripts || !packageJson.scripts.test || !packageJson.scripts["validate:skill"]) {
    errors.push("package.json must expose 'test' and 'validate:skill' scripts.");
  }
  if (!packageJson.scripts || !packageJson.scripts["export:tracker"]) {
    errors.push("package.json must expose an 'export:tracker' script.");
  }

  const discoveryTemplate = readText(rootDir, "assets/bug-discovery-template.md");
  const fixTemplate = readText(rootDir, "assets/bug-fix-report-template.md");
  for (const requiredHeading of ["## Summary", "## Expected Behavior", "## Test And Detection Gap"]) {
    if (!discoveryTemplate.includes(requiredHeading)) {
      errors.push(`Discovery template missing heading: ${requiredHeading}`);
    }
  }
  for (const requiredHeading of ["## Root Cause", "## Confirmation Test Before Fix", "## Residual Risk And Follow-Up"]) {
    if (!fixTemplate.includes(requiredHeading)) {
      errors.push(`Fix template missing heading: ${requiredHeading}`);
    }
  }

  const discoverySchema = JSON.parse(readText(rootDir, "schemas/bug-discovery-report.schema.json"));
  const fixSchema = JSON.parse(readText(rootDir, "schemas/bug-fix-report.schema.json"));
  if (!discoverySchema.required || !discoverySchema.required.includes("title")) {
    errors.push("Discovery schema must require 'title'.");
  }
  if (!fixSchema.required || !fixSchema.required.includes("rootCause")) {
    errors.push("Fix schema must require 'rootCause'.");
  }

  return errors;
}

function main() {
  const errors = validateSkill();
  if (errors.length > 0) {
    for (const error of errors) {
      console.error(error);
    }
    return 1;
  }

  console.log("Skill structure validation passed.");
  return 0;
}

if (require.main === module) {
  process.exit(main());
}

module.exports = {
  REQUIRED_FILES,
  parseFrontmatter,
  parseSimpleYaml,
  validateSkill,
  main
};
