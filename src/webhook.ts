import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { Handler, LambdaFunctionURLEvent } from "aws-lambda";
import { Queue } from "sst/node/queue";

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
    const client = new SQSClient({ region: process.env.AWS_REGION });
    await client.send(
      new SendMessageCommand({
        QueueUrl: Queue.jobProcessingQueue.queueUrl,
        MessageBody: data.payload.proposal.id,
        DelaySeconds: 0,
      })
    );
    return `proposal.accepted ${data.payload.proposal.id}`;
  } else if (eventType === "test") {
    console.log("Test event received.");
    return "Test event received.";
  } else {
    return `Event type ${eventType} not supported.`;
  }
};
