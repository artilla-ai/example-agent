import { Handler, SQSEvent } from "aws-lambda";
import { Bucket } from "sst/node/bucket";
import { Config } from "sst/node/config";
import { Client } from "./artilla";

import {
  LogoIdea,
  createDesignStrategy,
} from "./agent/designLogo/designStrategy";
import { generateLogo } from "./agent/designLogo/generateLogo";
import { SubmissionSubmitFilesBody } from "./artilla/client";
import { downloadFileAndUploadToS3 } from "./utils/uploadToS3";
import PQueue from "p-queue";
import pRetry, { AbortError } from "p-retry";

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

  const artilla = new Client({
    apiKey: Config.ARTILLA_API_KEY,
  });

  console.log("Fetching proposal: ", proposalId);
  const result = await artilla.getProposal(proposalId);

  const proposal = result.data.proposal;
  const taskData = proposal.task.data as any;
  const taskId = proposal.id;
  console.log("Creating submission: ", proposalId);

  const createSubmissionResult = await artilla.createSubmission(proposalId);
  const submission = createSubmissionResult.data.submission;
  console.log("Created submission: ", submission.id);

  console.log("Designing strategy...");
  10 + 80 + 10;
  await artilla.updateSubmissionProgress(
    submission.id,
    10,
    `Generating design strategy`
  );

  const designStrategy = await createDesignStrategy({
    name: taskData.name,
    fullDescription: taskData.description,
    shortDescription: taskData.what,
    targetAudience: taskData.forWho,
  });

  const queue = new PQueue({ concurrency: 4, autoStart: false });

  const submissionFiles: SubmissionSubmitFilesBody["files"] = [];

  let submissionProgress = 0;

  for (const i in designStrategy.ideas) {
    const doDesign = async () => {
      const logoIdx = parseInt(i) + 1;
      console.log(`Implementing idea #${logoIdx}...`);
      const idea = designStrategy.ideas[i];
      const submissionFile = await pRetry(
        () =>
          designAndUploadLogo(
            idea as LogoIdea,
            logoIdx,
            taskId,
            proposalId,
            submission,
            async () => {
              submissionProgress += 10;
              await artilla.updateSubmissionProgress(
                submission.id,
                submissionProgress,
                `Generated logo #${logoIdx}`
              );
            },
            async () => {
              submissionProgress += 10;
              await artilla.updateSubmissionProgress(
                submission.id,
                submissionProgress,
                `Uploaded logo #${logoIdx}`
              );
            }
          ),
        {
          retries: 3,
          onFailedAttempt: (error) => {
            console.error(error);
            console.error(idea);
          },
        }
      );
      submissionFiles.push(submissionFile);
    };
    queue.add(doDesign);
  }

  await queue.start();
  await queue.onIdle();

  const message = designStrategy.designApproach;
  console.log("Submission files", submissionFiles);
  const data = {
    message,
    files: submissionFiles,
  };

  const submitFilesResult = await artilla.submitFiles(submission.id, data);
  console.log(submitFilesResult.data);
  console.log(submitFilesResult.status);
  console.log("Submitted files...");

  await artilla.finalizeSubmission(submission.id);
  console.log("Finalized submission!");

  return "Done";
};

async function designAndUploadLogo(
  idea: LogoIdea,
  logoIdx: number,
  taskId: string,
  proposalId: string,
  submission: any,
  onLogoGenerated,
  onLogoUploadedGenerated
) {
  const logoUrl = await generateLogo(idea);
  await onLogoGenerated();
  const bucketKey = `logos/task-${taskId}/proposal-${proposalId}/revision-${submission.revision}/logo-${logoIdx}.png`;
  const { contentType } = await downloadFileAndUploadToS3(
    logoUrl,
    Bucket.LogoSageFiles.bucketName,
    bucketKey
  );

  await onLogoUploadedGenerated();

  const submissionFileUrl = new URL("https://" + Config.DISTRIBUTION_URL);
  submissionFileUrl.pathname = bucketKey;

  const submissionFile = {
    key: `logo-${logoIdx}.png`,
    url: submissionFileUrl.toString(),
    contentType,
    description: idea.justification,
  };
  console.log(`Logo uploaded to URL: ${submissionFileUrl.toString()}`);
  return submissionFile;
}
