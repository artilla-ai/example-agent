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

const logoDesign: Handler<SQSEvent, string> = async (event, context, cb) => {
  const proposalId = event.Records[0].body;

  const client = new Client({
    apiKey: Config.ARTILLA_API_KEY,
  });

  console.log("Fetching proposal: ", proposalId);
  const result = await client.getProposal(proposalId);

  const proposal = result.data.proposal;
  const taskData = proposal.task.data as any;
  const taskId = proposal.id;

  const createSubmissionResult = await client.createSubmission(proposalId);
  const submission = createSubmissionResult.data.submission;
  console.log("Created submission: ", submission.id);

  console.log("Designing strategy...");

  console.log(proposal.task);

  const designStrategy = await createDesignStrategy({
    name: taskData.name,
    fullDescription: taskData.description,
    shortDescription: taskData.what,
    targetAudience: taskData.forWho,
  });

  const submissionFiles: SubmissionSubmitFilesBody["files"] = [];
  for (const i in designStrategy.ideas) {
    const logoIdx = parseInt(i) + 1;
    console.log(`Implementing idea #${logoIdx}...`);
    const idea = designStrategy.ideas[i];

    const logoUrl = await generateLogo(idea as LogoIdea);
    const bucketKey = `logos/task-${taskId}/proposal-${proposalId}/revision-${submission.revision}/logo-${logoIdx}.png`;
    const { contentType } = await downloadFileAndUploadToS3(
      logoUrl,
      Bucket.LogoSageFiles.bucketName,
      bucketKey
    );

    const submissionFileUrl = new URL("https://" + Config.DISTRIBUTION_URL);
    submissionFileUrl.pathname = bucketKey;

    submissionFiles.push({
      key: `logo-${logoIdx}.png`,
      url: submissionFileUrl.toString(),
      contentType,
      description: idea.justification,
    });
    console.log(`Logo uploaded to URL: ${submissionFileUrl.toString()}`);
  }

  const message = designStrategy.designApproach;

  const data = {
    message,
    files: submissionFiles,
  };

  await client.submitFiles(submission.id, data);
  console.log("Submitted files...");

  await client.finalizeSubmission(submission.id);
  console.log("Finalized submission!");

  return "Done";
};

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
