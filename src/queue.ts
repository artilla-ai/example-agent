import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { Queue } from "sst/node/queue";

let sqsClient: SQSClient;

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
export function enqueueAcceptedTaskProposal(proposalId: string) {
  return getSQSClient().send(
    new SendMessageCommand({
      QueueUrl: Queue.jobProcessingQueue.queueUrl,
      MessageBody: proposalId,
      DelaySeconds: 0,
    })
  );
}
