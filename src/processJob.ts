import { Handler, SQSEvent } from "aws-lambda";
import { Client } from "./artilla";
import { Config } from "sst/node/config";
import { createDesignStrategy } from "./agent/designLogo/designStrategy";
import { generateLogo } from "./agent/designLogo/generateLogo";
import { downloadFileAndUploadToS3 } from "./utils/uploadToS3";
import { Bucket } from "sst/node/bucket";

interface SubmissionFile {
  url: string;
  contentType: string;
  description: string;
}

export const processJob: Handler<SQSEvent, string> = async (event, context) => {
  // Fetch the proposal and task

  const proposalId = event.Records[0].body;
  const client = new Client({
    apiKey: Config.ARTILLA_API_KEY,
    endpoint: Config.ARTILLA_API_URL,
  });

  console.log("Fetching proposal: ", proposalId);
  const result = (await client.getProposal(proposalId)) as any;
  const taskData = result.proposal.task.data.request;
  const taskId = result.proposal.task.id;

  console.log("Designing strategy...");
  const designStrategy = await createDesignStrategy({
    name: taskData.name,
    fullDescription: taskData.description,
    shortDescription: taskData.what,
    targetAudience: taskData.forWho,
  });

  const submissionFiles: SubmissionFile[] = [];
  for (const i in designStrategy.ideas) {
    console.log(`Implementing idea #${i + 1}...`);
    const idea = designStrategy.ideas[i];

    const logoUrl = await generateLogo(idea);
    const bucketKey = `logos/task-${taskId}/proposal-${proposalId}/logo-${
      i + 1
    }.png`;
    const { contentType } = await downloadFileAndUploadToS3(
      logoUrl,
      Bucket.LogoSageFiles.bucketName,
      bucketKey
    );

    const submissionFileUrl = new URL("https://" + Config.DISTRIBUTION_URL);
    submissionFileUrl.pathname = bucketKey;

    submissionFiles.push({
      url: submissionFileUrl.toString(),
      contentType,
      description: idea.justification,
    });
    console.log(`Logo uploaded to URL: ${submissionFileUrl.toString()}`);
  }

  console.log("Submission: ");
  console.log(submissionFiles);

  return "Done";
};
