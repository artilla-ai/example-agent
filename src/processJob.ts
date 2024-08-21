/**
 * This file contains the code for the job processing function.
 *
 * The function processes logo design jobs by generating a design strategy
 * and creating logo designs based on that strategy. It is triggered by an
 * SQS message containing the proposal ID.
 *
 * The function:
 * 1. Retrieves the proposal from Artilla.
 * 2. Extracts the task data.
 * 3. Creates a new submission for the proposal.
 * 4. Generates a design strategy using OpenAI's GPT-4 model.
 * 5. Creates logo designs based on the strategy.
 * 6. Updates the submission progress as it creates the designs.
 * 7. Uploads the designs to Artilla.
 * 8. Finalizes the submission once all designs have been uploaded.
 *
 * The function returns "Done" once the job is complete.
 *
 * You can use this template to create your own job processing function.
 */
import Artilla from "artilla";
import { SubmissionUploadParams } from "artilla/resources";
import { Handler, SQSEvent } from "aws-lambda";
import PQueue from "p-queue";
import pRetry from "p-retry";
import { Config } from "sst/node/config";
import { createDesignStrategy } from "./agent/designStrategy";
import { LogoIdea } from "./agent/prompts";
import { generateLogo } from "./agent/generateLogo";
import { ChatOpenAI } from "@langchain/openai";
import OpenAI from "openai";

interface LogoDesignInputs {
  name?: string;
  description: string;
  what: string;
  forWho: string;
  details?: string;
}

/**
 * Job processing queue - processes logo design jobs
 * @param event
 * @param context
 * @param cb
 * @returns
 */
export const processJob: Handler<SQSEvent, string> = async (
  event,
  context,
  cb
) => {
  let result;
  try {
    result = await logoDesign(event, context, cb);
  } catch (error) {
    console.error(error);
    return "Error";
  }
  return result;
};

const logoDesign: Handler<SQSEvent, string> = async (event, context, cb) => {
  /**
   * The proposal ID is passed in the SQS message body
   */
  const taskId = event.Records[0].body;
  /**
   * Initialize the Artilla and OpenAI clients.
   * We use the Config object set up in the SST app to get the API keys and endpoints
   */
  const artilla = new Artilla({
    baseURL: Config.ARTILLA_API_ENDPOINT,
    defaultHeaders: {
      "X-Api-Key": Config.ARTILLA_API_KEY,
    },
  });

  const openai = new OpenAI({
    apiKey: Config.OPENAI_API_KEY,
  });

  const model = new ChatOpenAI({
    model: "gpt-4o",
    apiKey: Config.OPENAI_API_KEY,
  }).bind({ response_format: { type: "json_object" } });

  /**
   * Now, we can start processing the job. We begin by retrieving the task data
   */
  const { task } = await artilla.tasks.retrieve(taskId);
  const taskData = task.data as any;

  /**
   * Create a new submission for the proposal
   */

  const { submission } = await artilla.submissions.create({ taskId });

  await artilla.submissions.setProgress(submission.id, {
    progressPercent: 10,
    text: `Generating design strategy`,
  });

  // /**
  //  * Then, we kick off the design strategy generation process. We use pRetry to retry the
  //  * operation up to 3 times in case of failure.
  //  */
  const designStrategy = await pRetry(
    () =>
      createDesignStrategy({
        model,
        name: taskData.name,
        fullDescription: taskData.description,
        shortDescription: taskData.what,
        targetAudience: taskData.forWho,
        details: taskData.details,
      }),
    { retries: 3 }
  );

  /**
   * Now that we have the design strategy, we can start creating the logo designs.
   * We use a PQueue to control the concurrency of the logo generation process.
   */
  const queue = new PQueue({ concurrency: 4, autoStart: false });

  const submissionFiles: SubmissionUploadParams["files"] = [];

  designStrategy.ideas.forEach((idea, i) => {
    queue.add(async () => {
      return pRetry(async () => {
        const logoUrl = await generateLogo(idea as LogoIdea, openai);
        const submissionFile = {
          key: `logo-${i}.png`,
          url: logoUrl,
          contentType: "image/png",
          description: idea.justification,
        };
        submissionFiles.push(submissionFile);
        return submissionFile;
      });
    });
  });

  // // Update the submission progress as the logo designs are created
  let submissionProgress = 0;
  queue.on("completed", async (submissionFile) => {
    submissionProgress += 10;

    await artilla.submissions.setProgress(submission.id, {
      progressPercent: submissionProgress,
      text: `Created ${submissionFile.key}`,
    });
  });

  // Start the queue and wait for all logo designs to be created
  await queue.start();
  await queue.onIdle();

  /**
   * Once all logo designs have been created, we upload the designs to Artilla
   * and finalize the submission.
   */
  await artilla.submissions.upload(submission.id, {
    message: designStrategy.designApproach,
    files: submissionFiles,
  });

  await artilla.submissions.finalize(submission.id);

  return "Done";
};
