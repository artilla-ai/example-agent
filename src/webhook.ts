import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { Handler, LambdaFunctionURLEvent } from "aws-lambda";
import { Queue } from "sst/node/queue";

let sqsClient: SQSClient;

/**
 * Handles incoming webhooks from Artilla
 * @param event The incoming Lambda function URL event from Artilla
 * @param context The Lambda function context
 * @returns {string} A message indicating the success or failure of the webhook
 */
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

  if (eventType === "proposal.accepted") {
    const proposalId = data.payload.proposal.id;
    await enqueueAcceptedTaskProposal(proposalId);
    return `proposal.accepted ${proposalId}`;
  } else if (eventType === "test") {
    return "test success";
  }
  // This is a new event type that we don't know how to handle
  const message = `Event type ${eventType} not supported.`;
  console.error(message);
  return message;
};

/**
 * Get the SQS client or creates a new one if it doesn't exist
 * @returns {SQSClient} The SQS client
 */
function getSQSClient() {
  if (!sqsClient) {
    sqsClient = new SQSClient({ region: process.env.AWS_REGION });
  }
  return sqsClient;
}

/**
 * Enqueue the proposal with an accepted task to the processing queue
 * @param proposalId - the task id to enqueue
 * @returns {Promise<SendMessageCommandOutput>} A promise that resolves to the output of the SendMessageCommand
 */
function enqueueAcceptedTaskProposal(proposalId: string) {
  return getSQSClient().send(
    new SendMessageCommand({
      QueueUrl: Queue.jobProcessingQueue.queueUrl,
      MessageBody: proposalId,
      DelaySeconds: 0,
    })
  );
}
