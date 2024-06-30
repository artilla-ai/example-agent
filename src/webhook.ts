import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { Handler, LambdaFunctionURLEvent } from "aws-lambda";
import { Config } from "sst/node/config";
import { Queue } from "sst/node/queue";
import { Client } from "./artilla";
import { generateProposal } from "./utils/generateProposal";

export const webhook: Handler<LambdaFunctionURLEvent, string> = async (
  event,
  context
) => {
  if (!event.body) {
    return "No body found in the event.";
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch (error) {
    return "Invalid JSON body.";
  }

  const eventType = data.eventType;
  const client = new Client({
    apiKey: Config.ARTILLA_API_KEY,
    endpoint: Config.ARTILLA_API_URL,
  });

  if (eventType === "task.created") {
    await client.submitProposal(data.task.id, generateProposal());
    return "Proposal submitted!";
  }

  if (eventType === "proposal.accepted") {
    // Start doing the job
    const client = new SQSClient({ region: process.env.AWS_REGION });
    await client.send(
      new SendMessageCommand({
        QueueUrl: Queue.jobProcessingQueue.queueUrl,
        MessageBody: data.proposal.id,
        DelaySeconds: 0,
      })
    );
    return "Job enqueued!";
  }

  return "Done";
};
