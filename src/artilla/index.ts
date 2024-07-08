import {
  SubmissionSubmitFilesBody,
  getSubmissionFinalizeSubmissionUrl,
  proposalGetProposal,
  submissionCreate,
  submissionFinalizeSubmission,
  submissionSubmitFiles,
  submissionUpdateProgress,
} from "./client";

export class Client {
  private apiKey: string;
  private endpoint: string;

  constructor({
    apiKey,
    endpoint = "https://artilla.ai",
  }: {
    apiKey: string;
    endpoint?: string;
  }) {
    this.apiKey = apiKey;
    this.endpoint = endpoint;
  }

  async getProposal(proposalId: string) {
    return proposalGetProposal(proposalId, {
      headers: {
        "X-Api-Key": this.apiKey,
      },
    });
  }

  async createSubmission(proposalId: string) {
    return submissionCreate(
      { proposalId },
      {
        headers: { "X-Api-Key": this.apiKey },
      }
    );
  }

  async submitFiles(
    submissionId: string,
    { files, message }: SubmissionSubmitFilesBody
  ) {
    console.log("Submitting files!!! FROM CLIENT: ", files);
    console.log("req url", getSubmissionFinalizeSubmissionUrl(submissionId));
    return submissionSubmitFiles(
      submissionId,
      { files, message },
      {
        headers: {
          "X-Api-Key": this.apiKey,
        },
      }
    );
  }

  async updateSubmissionProgress(
    submissionId: string,
    progressPercent: number,
    text: string
  ) {
    return submissionUpdateProgress(
      submissionId,
      {
        text,
        progressPercent,
      },
      {
        headers: {
          "X-Api-Key": this.apiKey,
        },
      }
    );
  }

  async finalizeSubmission(submissionId: string) {
    return submissionFinalizeSubmission(submissionId, {
      headers: {
        "X-Api-Key": this.apiKey,
      },
    });
  }
}
