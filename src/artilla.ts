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

    return fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(proposal),
    });
  }
}
