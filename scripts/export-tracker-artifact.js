"use strict";

const fs = require("fs");
const path = require("path");

function parseArgs(argv) {
  const config = {
    tracker: null,
    input: null,
    output: null,
    artifact: null
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const nextValue = argv[index + 1];

    switch (arg) {
      case "--tracker":
        config.tracker = nextValue;
        index += 1;
        break;
      case "--input":
        config.input = nextValue;
        index += 1;
        break;
      case "--output":
        config.output = nextValue;
        index += 1;
        break;
      case "--artifact":
        config.artifact = nextValue;
        index += 1;
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!config.tracker || !config.input) {
    throw new Error("Usage: node scripts/export-tracker-artifact.js --tracker <jira|linear> --input <report.json> [--artifact <issue-draft|resolution-update>] [--output <file>]");
  }

  return config;
}

function loadReport(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8").replace(/^\uFEFF/, ""));
}

function joinList(items) {
  return (items || []).length ? items.join(", ") : "none";
}

function uniqueList(items) {
  return Array.from(new Set((items || []).filter(Boolean)));
}

function jiraPriority(priorityOrSeverity) {
  switch (priorityOrSeverity) {
    case "p0":
    case "critical":
      return "Highest";
    case "p1":
    case "high":
      return "High";
    case "p2":
    case "medium":
      return "Medium";
    default:
      return "Low";
  }
}

function linearPriority(priorityOrSeverity) {
  switch (priorityOrSeverity) {
    case "p0":
    case "critical":
      return 1;
    case "p1":
    case "high":
      return 2;
    case "p2":
    case "medium":
      return 3;
    default:
      return 4;
  }
}

function buildDiscoveryMarkdown(report) {
  return [
    `h2. Summary`,
    `*Severity:* ${report.severity}`,
    `*Priority:* ${report.priority}`,
    `*Status:* ${report.status}`,
    "",
    `h2. Defect Description`,
    report.defectDescription,
    "",
    `h2. Expected Behavior`,
    report.expectedBehavior,
    "",
    `h2. Reproduction`,
    ...(report.reproduction.steps || []).map((step, index) => `${index + 1}. ${step}`),
    "",
    `h2. Actual Result`,
    report.actualResult,
    "",
    `h2. Scope And Impact`,
    `*Affected area:* ${report.scopeAndImpact.affectedArea}`,
    `*User impact:* ${report.scopeAndImpact.userImpact}`,
    `*Risk if unchanged:* ${report.scopeAndImpact.riskIfUnchanged}`,
    "",
    `h2. Test And Detection Gap`,
    report.testAndDetectionGap,
    "",
    `h2. Evidence`,
    `*Source:* ${report.evidence.source}`,
    `*Requirement reference:* ${report.evidence.requirementReference}`,
    `*Attachments:* ${joinList(report.evidence.attachments)}`
  ].join("\n");
}

function buildFixMarkdown(report) {
  return [
    `h2. Resolution Summary`,
    `*Severity:* ${report.severity}`,
    `*Status:* ${report.status}`,
    `*Owner:* ${report.resolutionOwner}`,
    "",
    `h2. Root Cause`,
    `*Technical cause:* ${report.rootCause.technicalCause}`,
    `*Trigger condition:* ${report.rootCause.triggerCondition}`,
    `*Why it escaped earlier:* ${report.rootCause.whyItEscapedEarlier}`,
    "",
    `h2. Confirmation Test Before Fix`,
    `*Type:* ${report.confirmationTestBeforeFix.type}`,
    `*Location:* ${report.confirmationTestBeforeFix.location}`,
    `*Result:* ${report.confirmationTestBeforeFix.result}`,
    `*Notes:* ${report.confirmationTestBeforeFix.notes}`,
    "",
    `h2. Code Changes`,
    `*Files changed:* ${joinList(report.codeChanges.filesChanged)}`,
    `*Fix strategy:* ${report.codeChanges.fixStrategy}`,
    `*Risk notes:* ${report.codeChanges.riskNotes}`,
    "",
    `h2. Regression Protection`,
    `*Tests updated:* ${joinList(report.regressionProtection.testsUpdated)}`,
    `*Coverage validation:* ${report.regressionProtection.coverageValidation}`,
    `*Regression checks:* ${joinList(report.regressionProtection.regressionChecks)}`,
    "",
    `h2. Verification After Fix`,
    `*Confirmation test result:* ${report.verificationAfterFix.confirmationTestResult}`,
    `*Additional validation:* ${report.verificationAfterFix.additionalValidation}`,
    "",
    `h2. Residual Risk And Follow-Up`,
    report.residualRiskAndFollowUp
  ].join("\n");
}

function inferArtifact(report, requestedArtifact) {
  if (requestedArtifact) {
    return requestedArtifact;
  }
  return report.mode === "approved-fix" ? "resolution-update" : "issue-draft";
}

function exportForJira(report, artifact) {
  if (artifact === "issue-draft") {
    return {
      tracker: "jira",
      artifactType: "issue-draft",
      projectKey: report.trackerMetadata && report.trackerMetadata.projectKey ? report.trackerMetadata.projectKey : null,
      issueType: "Bug",
      summary: `[Bug] ${report.title}`,
      priorityName: jiraPriority(report.priority || report.severity),
      labels: uniqueList(["bug"].concat((report.trackerMetadata && report.trackerMetadata.labels) || [])),
      components: (report.trackerMetadata && report.trackerMetadata.components) || [],
      descriptionMarkdown: buildDiscoveryMarkdown(report)
    };
  }

  return {
    tracker: "jira",
    artifactType: "resolution-update",
    projectKey: report.trackerMetadata && report.trackerMetadata.projectKey ? report.trackerMetadata.projectKey : null,
    summary: `Resolved: ${report.title}`,
    labels: uniqueList(["bug", "resolved"].concat((report.trackerMetadata && report.trackerMetadata.labels) || [])),
    commentMarkdown: buildFixMarkdown(report)
  };
}

function exportForLinear(report, artifact) {
  if (artifact === "issue-draft") {
    return {
      tracker: "linear",
      artifactType: "issue-draft",
      teamKey: report.trackerMetadata && report.trackerMetadata.teamKey ? report.trackerMetadata.teamKey : null,
      title: report.title,
      priority: linearPriority(report.priority || report.severity),
      labelNames: uniqueList(["bug"].concat((report.trackerMetadata && report.trackerMetadata.labels) || [])),
      descriptionMarkdown: buildDiscoveryMarkdown(report)
    };
  }

  return {
    tracker: "linear",
    artifactType: "resolution-update",
    teamKey: report.trackerMetadata && report.trackerMetadata.teamKey ? report.trackerMetadata.teamKey : null,
    title: `Resolved: ${report.title}`,
    labelNames: uniqueList(["bug", "resolved"].concat((report.trackerMetadata && report.trackerMetadata.labels) || [])),
    commentMarkdown: buildFixMarkdown(report)
  };
}

function exportTrackerArtifact(report, tracker, requestedArtifact) {
  const artifact = inferArtifact(report, requestedArtifact);

  if (tracker === "jira") {
    return exportForJira(report, artifact);
  }
  if (tracker === "linear") {
    return exportForLinear(report, artifact);
  }

  throw new Error(`Unsupported tracker: ${tracker}`);
}

function main(argv = process.argv.slice(2)) {
  const config = parseArgs(argv);
  const report = loadReport(config.input);
  const artifact = exportTrackerArtifact(report, config.tracker, config.artifact);
  const serialized = JSON.stringify(artifact, null, 2);

  if (config.output) {
    fs.writeFileSync(path.resolve(config.output), serialized);
  } else {
    console.log(serialized);
  }

  return 0;
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
  parseArgs,
  loadReport,
  buildDiscoveryMarkdown,
  buildFixMarkdown,
  exportTrackerArtifact,
  exportForJira,
  exportForLinear,
  jiraPriority,
  linearPriority,
  uniqueList,
  inferArtifact,
  main
};
