const fs = require("fs");
const path = require("path");
const core = require("@actions/core");

try {
  const applicationName = core.getInput("application-name");
  const TaskDefinition = core.getInput("task-arn");

  const deploymentGroupName = core.getInput("deployment-group", { required: false }) || applicationName;
  const ContainerName = core.getInput("container-name", { required: false }) || applicationName;
  const fileName = path.join(__dirname, "..", "codedeploy.json");

  fs.writeFileSync(
    fileName,
    JSON.stringify(
      {
        applicationName,
        deploymentGroupName,
        revision: {
          revisionType: "AppSpecContent",
          appSpecContent: {
            content: JSON.stringify({
              version: "0.0",
              Resources: [
                {
                  TargetService: {
                    Type: "AWS::ECS::Service",
                    Properties: {
                      TaskDefinition,
                      PlatformVersion: "LATEST",
                      LoadBalancerInfo: {
                        ContainerName,
                        ContainerPort: 5001,
                      },
                    },
                  },
                },
              ],
            }),
          },
        },
      },
      null,
      4
    )
  );

  core.setOutput('file-name', fileName)
} catch (error) {
  core.setFailed(error.message);
}

