import { Handler, LambdaFunctionURLEvent } from "aws-lambda";
import { enqueueTask } from "./queue";

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

  if (eventType === "test") {
    return "success";
  } else if (eventType === "task.created") {
    const taskId = data.payload.task.id;
    await enqueueTask(taskId);
    return `${eventType} ${taskId}`;
  }

  const message = `Event type ${eventType} not supported.`;
  console.error(message);
  return message;
};
