"use strict";

const fs = require("fs");
const path = require("path");

const DEFAULT_THRESHOLD = 80;
const DEFAULT_METRICS = ["lines", "statements", "functions", "branches"];

function normalizePath(value) {
  return String(value).replace(/\\/g, "/");
}

function parseArgs(argv) {
  const config = {
    coverageFile: null,
    threshold: null,
    metrics: null,
    files: [],
    manifest: null
  };

  const positional = [];

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (!arg.startsWith("--")) {
      positional.push(arg);
      continue;
    }

    const nextValue = argv[index + 1];

    switch (arg) {
      case "--coverage":
        config.coverageFile = nextValue;
        index += 1;
        break;
      case "--threshold":
        config.threshold = Number(nextValue);
        index += 1;
        break;
      case "--metrics":
        config.metrics = String(nextValue)
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean);
        index += 1;
        break;
      case "--files":
        config.files = String(nextValue)
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean);
        index += 1;
        break;
      case "--manifest":
        config.manifest = nextValue;
        index += 1;
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!config.coverageFile && positional[0]) {
    config.coverageFile = positional[0];
  }

  return config;
}

function loadManifest(manifestPath) {
  const absolutePath = path.resolve(manifestPath);
  const manifest = JSON.parse(fs.readFileSync(absolutePath, "utf8"));
  return {
    coverageFile: manifest.coverageFile,
    threshold: manifest.threshold,
    metrics: manifest.metrics,
    files: manifest.files || []
  };
}

function loadCoverage(coverageFile) {
  const absolutePath = path.resolve(coverageFile || "coverage/coverage-summary.json");

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Coverage file not found at ${absolutePath}`);
  }

  const data = JSON.parse(fs.readFileSync(absolutePath, "utf8"));
  return { absolutePath, data };
}

function findCoverageEntry(data, filePath) {
  const desired = normalizePath(filePath);
  const entries = Object.entries(data).filter(([key]) => key !== "total");

  let exact = entries.find(([key]) => normalizePath(key) === desired);
  if (exact) {
    return exact;
  }

  exact = entries.find(([key]) => normalizePath(key).endsWith(`/${desired}`) || normalizePath(key).endsWith(desired));
  return exact || null;
}

function collectTargets(data, files) {
  if (!files || files.length === 0) {
    return [{ label: "total", summary: data.total }];
  }

  return files.map((filePath) => {
    const entry = findCoverageEntry(data, filePath);
    if (!entry) {
      throw new Error(`Coverage entry not found for requested file: ${filePath}`);
    }

    return {
      label: normalizePath(filePath),
      summary: entry[1]
    };
  });
}

function validateCoverage(data, options = {}) {
  const threshold = Number.isFinite(options.threshold) ? options.threshold : DEFAULT_THRESHOLD;
  const metrics = (options.metrics && options.metrics.length ? options.metrics : DEFAULT_METRICS).map((metric) => metric.trim());
  const files = options.files || [];
  const targets = collectTargets(data, files);
  const failures = [];

  for (const target of targets) {
    for (const metric of metrics) {
      const metricSummary = target.summary && target.summary[metric];
      if (!metricSummary || typeof metricSummary.pct !== "number") {
        failures.push({
          label: target.label,
          metric,
          reason: "missing metric"
        });
        continue;
      }

      if (metricSummary.pct < threshold) {
        failures.push({
          label: target.label,
          metric,
          pct: metricSummary.pct,
          reason: "below threshold"
        });
      }
    }
  }

  return {
    threshold,
    metrics,
    files,
    targets,
    failures,
    ok: failures.length === 0
  };
}

function formatResult(result, coveragePath) {
  const lines = [];
  lines.push(`Coverage source: ${coveragePath}`);
  lines.push(`Threshold: ${result.threshold}%`);
  lines.push(`Metrics: ${result.metrics.join(", ")}`);
  lines.push(`Scope: ${result.files.length ? result.files.join(", ") : "total"}`);

  if (result.ok) {
    lines.push("Coverage check passed.");
    return lines.join("\n");
  }

  lines.push("Coverage check failed:");
  for (const failure of result.failures) {
    if (failure.reason === "missing metric") {
      lines.push(`- ${failure.label}: missing metric '${failure.metric}'`);
    } else {
      lines.push(`- ${failure.label}: ${failure.metric} is ${failure.pct}%`);
    }
  }

  return lines.join("\n");
}

function resolveConfig(argv) {
  const parsed = parseArgs(argv);
  let manifestConfig = {};

  if (parsed.manifest) {
    manifestConfig = loadManifest(parsed.manifest);
  }

  return {
    coverageFile: parsed.coverageFile || manifestConfig.coverageFile || "coverage/coverage-summary.json",
    threshold: Number.isFinite(parsed.threshold) ? parsed.threshold : manifestConfig.threshold,
    metrics: parsed.metrics && parsed.metrics.length ? parsed.metrics : manifestConfig.metrics || DEFAULT_METRICS,
    files: parsed.files && parsed.files.length ? parsed.files : manifestConfig.files || []
  };
}

function main(argv = process.argv.slice(2)) {
  const config = resolveConfig(argv);
  const coverage = loadCoverage(config.coverageFile);
  const result = validateCoverage(coverage.data, config);
  const output = formatResult(result, coverage.absolutePath);

  if (result.ok) {
    console.log(output);
    return 0;
  }

  console.error(output);
  return 1;
}

if (require.main === module) {
  try {
    process.exit(main());
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = {
  DEFAULT_THRESHOLD,
  DEFAULT_METRICS,
  parseArgs,
  loadManifest,
  loadCoverage,
  findCoverageEntry,
  collectTargets,
  validateCoverage,
  formatResult,
  resolveConfig,
  main
};
