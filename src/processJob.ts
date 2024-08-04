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
  const proposalId = event.Records[0].body;

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

  // 1. Fetch the proposal fron Artilla and extract the task data
  const result = await artilla.proposals.retrieve(proposalId);
  const proposal = result.proposal;
  const taskData = proposal.task.data as LogoDesignInputs;

  // 2. Create a new submission
  const { submission } = await artilla.submissions.create({
    proposalId: proposalId,
  });

  await artilla.submissions.progress(submission.id, {
    progressPercent: 10,
    text: `Generating design strategy`,
  });

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

  let submissionProgress = 0;
  queue.on("completed", async (submissionFile) => {
    console.debug(`Completed ${submissionFile.key}`);
    submissionProgress += 10;
    await artilla.submissions.progress(submission.id, {
      progressPercent: submissionProgress,
      text: `Created ${submissionFile.key}`,
    });
  });

  await queue.start();
  await queue.onIdle();

  await artilla.submissions.upload(submission.id, {
    message: designStrategy.designApproach,
    files: submissionFiles,
  });

  await artilla.submissions.finalize(submission.id);

  return "Done";
};
