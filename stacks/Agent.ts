// https://sst.dev/examples/how-to-use-lambda-layers-in-your-serverless-app.html
import { Config, Function, Queue, StackContext } from "sst/constructs";
import { Duration } from "aws-cdk-lib/core";

export function Agent({ stack }: StackContext) {
  const ARTILLA_API_URL = new Config.Parameter(stack, "ARTILLA_API_URL", {
    value: "http://localhost:3000",
  });

  const ARTILLA_API_KEY = new Config.Secret(stack, "ARTILLA_API_KEY");

  const visibilityTimeoutMultiplier = 2;
  const jobTimeoutMins = 5;
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
        handler: "src/lambda.processJob",
        description: "Processes logo creation jobs from the queue",
        timeout: 60 * jobTimeoutMins,
        bind: [ARTILLA_API_KEY, ARTILLA_API_URL],
      },
    },
  });

  const webhook = new Function(stack, "webhook", {
    handler: "src/lambda.webhook",
    description: "Handles incoming webhook requests from Artilla",
    url: true,
    bind: [ARTILLA_API_KEY, ARTILLA_API_URL, jobProcessingQueue],
  });

  stack.addOutputs({
    webhookUrl: webhook.url,
    jobQueueUrl: jobProcessingQueue.queueUrl,
  });
}
