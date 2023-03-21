const { yamlParse } = require("yaml-cfn");
const core = require("@actions/core");
const fs = require("fs");
const path = require("path");

const environment = core.getInput("environment");
const workingDirectoryInput = core.getInput("working-directory");
const cwd = path.join(process.cwd(), workingDirectoryInput);
if (!environment) {
  throw new Error(`Environment not specified`);
}

const cloudformationFile = path.join(
  cwd,
  "cloudformation",
  "cloudformation.yaml"
);

const environmentFile = path.join(
  cwd,
  "configs",
  environment + ".json"
);

if (!fs.existsSync(cloudformationFile)) {
  return core.info("No Cloudformation file");
}

if (!fs.existsSync(environmentFile)) {
  return core.info("No Environment file ");
}

const environmentText = fs.readFileSync(environmentFile, {
  encoding: "utf-8",
});
const environmentConfig = JSON.parse(environmentText);

const cloudformationText = fs.readFileSync(cloudformationFile, {
  encoding: "utf-8",
});
const cloudformationConfig = yamlParse(cloudformationText);

const allowedParameters = new Set(
  Object.keys(cloudformationConfig.Parameters || {})
);
const parsedParameters = Object.keys(environmentConfig.Parameters || {});

const disallowedParameters = parsedParameters
  .filter((key) => !allowedParameters.has(key))
  .sort();

if (disallowedParameters.length) {
  failureMessages = [];
  failureMessages.push(`Found unexpected Parameters`);
  disallowedParameters.forEach((parameter) => {
    failureMessages.push(`     ${parameter}`);
  });
  const failureMessage = failureMessages.join("\n");
  core.setFailed(failureMessage);
} else {
  core.info(`${environment}.json is all good!`);
}
