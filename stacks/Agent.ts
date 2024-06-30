// https://sst.dev/examples/how-to-use-lambda-layers-in-your-serverless-app.html
import { Bucket, Config, Function, Queue, StackContext } from "sst/constructs";
import { Duration } from "aws-cdk-lib/core";
import { Distribution, OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";

export function Agent({ stack }: StackContext) {
  const ARTILLA_API_URL = new Config.Parameter(stack, "ARTILLA_API_URL", {
    value: "http://localhost:3000",
  });

  const ARTILLA_API_KEY = new Config.Secret(stack, "ARTILLA_API_KEY");

  const OPENAI_API_KEY = new Config.Secret(stack, "OPENAI_API_KEY");

  const jobResultsBucket = new Bucket(stack, "LogoSageFiles");
  const originAccessIdentity = new OriginAccessIdentity(stack, "OAI");

  const distribution = new Distribution(stack, "LogoSageDistribution", {
    defaultBehavior: {
      origin: new S3Origin(jobResultsBucket.cdk.bucket, {
        originAccessIdentity,
      }),
    },
  });

  const DISTRIBUTION_URL = new Config.Parameter(stack, "DISTRIBUTION_URL", {
    value: distribution.domainName,
  });

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
        bind: [
          ARTILLA_API_KEY,
          ARTILLA_API_URL,
          OPENAI_API_KEY,
          DISTRIBUTION_URL,
          jobResultsBucket,
        ],
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
    distributionUrl: distribution.domainName,
    bucketName: jobResultsBucket.bucketName,
    webhookUrl: webhook.url,
    jobQueueUrl: jobProcessingQueue.queueUrl,
  });
}
