const { yamlParse } = require("yaml-cfn");
const core = require("@actions/core");
const fs = require("fs");
const path = require("path");
const sortKeys = require("sort-keys");

const environment = core.getInput("environment");
if (!environment) {
  throw new Error(`Environment not specified`);
}

const cloudformationFile = path.join(
  process.cwd(),
  "cloudformation",
  "cloudformation.yaml"
);
if (fs.existsSync(cloudformationFile)) {
  const environmentFile = path.join(
    process.cwd(),
    "configs",
    environment + ".json"
  );
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
    console.error(failureMessage);
    core.setFailed(failureMessage);
  }

  if (process.argv.indexOf("--fix")) {
    console.info("Fixing...");
    disallowedParameters.forEach((parameter) => {
      environmentConfig.Parameters[parameter] = undefined;
    });
    environmentConfig.Parameters = sortKeys(environmentConfig.Parameters);
    fs.writeFileSync(
      environmentFile,
      JSON.stringify(environmentConfig, null, 2)
    );
  }
}
