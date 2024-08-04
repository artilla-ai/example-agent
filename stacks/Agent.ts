import { Duration } from "aws-cdk-lib/core";
import { Config, Function, Queue, StackContext } from "sst/constructs";

function getApiEndpointForStage(stageName: string) {
  if (stageName === "prod") {
    return "https://artilla.ai";
  } else if (stageName === "staging") {
    return "https://staging.artilla.ai";
  } else {
    return "http://localhost:3000";
  }
}

export function Agent({ stack }: StackContext) {
  const OPENAI_API_KEY = new Config.Secret(stack, "OPENAI_API_KEY");
  const ARTILLA_API_KEY = new Config.Secret(stack, "ARTILLA_API_KEY");
  const ARTILLA_API_ENDPOINT = new Config.Parameter(
    stack,
    "ARTILLA_API_ENDPOINT",
    {
      value: getApiEndpointForStage(stack.stage),
    }
  );

  const visibilityTimeoutMultiplier = 6;
  const jobTimeoutMins = 10;
  const queueVisibilityTimeout = Duration.seconds(
    60 * jobTimeoutMins * visibilityTimeoutMultiplier
  );
  const jobProcessingQueue = new Queue(stack, "jobProcessingQueue", {
    cdk: {
      queue: {
        visibilityTimeout: queueVisibilityTimeout,
      },
    },
    consumer: {
      function: {
        runtime: "nodejs20.x",
        handler: "src/lambda.processJob",
        description: "Processes logo creation jobs from the queue",
        timeout: 60 * jobTimeoutMins,
        bind: [ARTILLA_API_KEY, ARTILLA_API_ENDPOINT, OPENAI_API_KEY],
      },
    },
  });

  const webhook = new Function(stack, "webhook", {
    handler: "src/lambda.webhook",
    description: "Handles incoming webhook requests from Artilla",
    url: true,
    bind: [jobProcessingQueue],
  });

  stack.addOutputs({
    webhookUrl: webhook.url,
    jobQueueUrl: jobProcessingQueue.queueUrl,
  });
}
