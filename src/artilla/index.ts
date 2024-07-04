// export interface SubmissionFile {
//   key: string;
//   url: string;
//   contentType: string;
//   description: string;
// }

import {
  SubmissionSubmitFilesBody,
  proposalGetProposal,
  submissionCreate,
  submissionFinalizeSubmission,
  submissionSubmitFiles,
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

  // async submitProposal(taskId: string, proposal) {
  //   const endpoint = new URL(this.endpoint);
  //   endpoint.pathname = `/api/task/${taskId}/proposal`;

  //   const result = await fetch(endpoint, {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Bearer ${this.apiKey}`,
  //     },
  //     body: JSON.stringify(proposal),
  //   });
  //   return result.json();
  // }

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

  async finalizeSubmission(submissionId: string) {
    return submissionFinalizeSubmission(submissionId, {
      headers: {
        "X-Api-Key": this.apiKey,
      },
    });
  }

  // async getProposal(proposalId: string) {
  //   const endpoint = new URL(this.endpoint);
  //   endpoint.pathname = `/api/proposal/${proposalId}`;
  //   const result = await fetch(endpoint, {
  //     headers: {
  //       Authorization: `Bearer ${this.apiKey}`,
  //     },
  //   });
  //   return result.json();
  // }
}
