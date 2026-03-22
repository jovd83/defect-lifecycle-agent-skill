"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");
const { validateSkill, parseFrontmatter, parseSimpleYaml } = require("../scripts/validate-skill");

test("parseFrontmatter extracts top-level fields", () => {
  const frontmatter = parseFrontmatter("---\nname: example\ndescription: sample\n---\n# Title\n");
  assert.equal(frontmatter.name, "example");
  assert.equal(frontmatter.description, "sample");
});

test("parseSimpleYaml extracts key value pairs", () => {
  const yaml = parseSimpleYaml("display_name: Example\nshort_description: Demo\ndefault_prompt: Use it\n");
  assert.equal(yaml.display_name, "Example");
  assert.equal(yaml.short_description, "Demo");
  assert.equal(yaml.default_prompt, "Use it");
});

test("validateSkill passes for the repository", () => {
  const errors = validateSkill(path.join(__dirname, ".."));
  assert.deepEqual(errors, []);
});
