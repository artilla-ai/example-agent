import { Handler, SQSEvent } from "aws-lambda";

export const processJob: Handler<SQSEvent, string> = async (event, context) => {
  return "Done";
};
