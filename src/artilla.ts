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

  async submitProposal(taskId: string, proposal) {
    const endpoint = new URL(this.endpoint);
    endpoint.pathname = `/api/task/${taskId}/proposal`;

    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(proposal),
    });
    return result.json();
  }

  async getProposal(proposalId: string) {
    const endpoint = new URL(this.endpoint);
    endpoint.pathname = `/api/proposal/${proposalId}`;
    const result = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });
    return result.json();
  }
}
