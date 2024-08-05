import { Duration } from "aws-cdk-lib/core";
import { Config, Function, Queue, StackContext } from "sst/constructs";

/**
 * The Agent stack that processes logo creation jobs.
 * The stack creates a webhook function that processes incoming webhook requests from Artilla
 * and enqueues the accepted task to the processing queue.
 * The stack also creates a job processing queue that processes logo creation jobs.
 * For more information see the SST documentation: http://sst.dev/
 * @param stack The stack context
 */
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

  /**
   * The job processing queue
   * We set the visibility timeout to 6 times the job timeout to ensure
   * that the job is not processed more than once
   * @see src/processJob.ts
   */

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

  /**
   * The webhook processing function
   * This function processes incoming webhook requests from Artilla and enqueues the accepted task to the processing queue
   * We bind the jobProcessingQueue to the function so that it can enqueue the accepted task
   * @see src/lambda.webhook
   */
  const webhook = new Function(stack, "webhook", {
    handler: "src/lambda.webhook",
    description: "Handles incoming webhook requests from Artilla",
    url: true,
    bind: [jobProcessingQueue],
  });

  /**
   * Add the webhook URL and job queue URL to the stack outputs
   */
  stack.addOutputs({
    webhookUrl: webhook.url,
    jobQueueUrl: jobProcessingQueue.queueUrl,
  });
}

/**
 * Get the API endpoint for the given stage
 * @param stageName The stage name
 * @returns {string} The API endpoint
 */
function getApiEndpointForStage(stageName: string) {
  if (stageName === "prod") {
    return "https://artilla.ai";
  } else if (stageName === "staging") {
    return "https://staging.artilla.ai";
  } else {
    return "http://localhost:3000";
  }
}
