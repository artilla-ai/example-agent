/**
 * Generated by orval v6.31.0 🍺
 * Do not edit manually.
 * Artilla API Documentation
 * The Artilla API provides developers with the tools to interact with Artilla's AI-native marketplace. This API allows you to access and manage AI agents, perform searches, retrieve task recommendations, and handle user data. Designed to be flexible and scalable, the Artilla API is built with RESTful principles and is documented using Swagger for ease of use and integration.
 * OpenAPI spec version: 0.0.1
 */
export type WorkspaceGetWorkspace200Workspace = {
  createdAt: string;
  id: string;
  /** @nullable */
  owner: string | null;
  status: string;
  title: string;
  updatedAt: string;
};

export type WorkspaceGetWorkspace200TasksItem = {
  createdAt: string;
  /** @nullable */
  data: WorkspaceGetWorkspace200TasksItemData;
  id: string;
  mode: string;
  proposals: WorkspaceGetWorkspace200TasksItemProposalsItem[];
  status: string;
  type: string;
  updatedAt: string;
  workspaceId: string;
};

export type WorkspaceGetWorkspace200 = {
  success: boolean;
  tasks: WorkspaceGetWorkspace200TasksItem[];
  workspace: WorkspaceGetWorkspace200Workspace;
};

/**
 * @nullable
 */
export type WorkspaceGetWorkspace200TasksItemProposalsItemData = unknown | null;

/**
 * @nullable
 */
export type WorkspaceGetWorkspace200TasksItemProposalsItemAgentData = unknown | null;

export type WorkspaceGetWorkspace200TasksItemProposalsItemAgent = {
  /** @nullable */
  averageRating: string | null;
  createdAt: string;
  /** @nullable */
  data: WorkspaceGetWorkspace200TasksItemProposalsItemAgentData;
  freeTier: boolean;
  id: string;
  /** @nullable */
  image: string | null;
  /** @nullable */
  instantEnabled: boolean | null;
  /** @nullable */
  isApproved: boolean | null;
  /** @nullable */
  isFeatured: boolean | null;
  /** @nullable */
  isTopRated: boolean | null;
  /** @nullable */
  isVerified: boolean | null;
  /** @nullable */
  numBookmarks: number | null;
  /** @nullable */
  owner: string | null;
  /** @nullable */
  preview: string | null;
  /** @nullable */
  pricingStrategy: string | null;
  /** @nullable */
  ratings: number[] | null;
  taskTypes: string[];
  title: string;
  updatedAt: string;
  url: string;
};

export type WorkspaceGetWorkspace200TasksItemProposalsItem = {
  agent: WorkspaceGetWorkspace200TasksItemProposalsItemAgent;
  agentId: string;
  createdAt: string;
  /** @nullable */
  data: WorkspaceGetWorkspace200TasksItemProposalsItemData;
  /** @nullable */
  description: string | null;
  estimatedTimeToComplete: number;
  id: string;
  price: string;
  revisions: number;
  status: string;
  taskId: string;
  updatedAt: string;
  validTill: string;
};

/**
 * @nullable
 */
export type WorkspaceGetWorkspace200TasksItemData = unknown | null;

export type WorkspaceGetWorkspaceList200WorkspacesItem = {
  createdAt: string;
  id: string;
  /** @nullable */
  owner: string | null;
  status: string;
  title: string;
  updatedAt: string;
};

export type WorkspaceGetWorkspaceList200 = {
  success: boolean;
  workspaces: WorkspaceGetWorkspaceList200WorkspacesItem[];
};

export type SubmissionFinalizeSubmission200 = {
  success: boolean;
};

export type SubmissionSubmitFiles200Submission = {
  id: string;
  revision: number;
};

export type SubmissionSubmitFiles200 = {
  submission: SubmissionSubmitFiles200Submission;
  success: boolean;
};

export type SubmissionSubmitFilesBodyFilesItem = {
  contentType: string;
  description: string;
  key: string;
  url: string;
};

export type SubmissionSubmitFilesBody = {
  files: SubmissionSubmitFilesBodyFilesItem[];
  message: string;
};

export type SubmissionCreate200Submission = {
  id: string;
  revision: number;
};

export type SubmissionCreate200 = {
  submission: SubmissionCreate200Submission;
  success: boolean;
};

export type SubmissionCreateBody = {
  proposalId: string;
};

/**
 * @nullable
 */
export type ProposalGetProposal200ProposalTaskData = unknown | null;

export type ProposalGetProposal200ProposalTask = {
  /** @nullable */
  additionalSearches: number | null;
  createdAt: string;
  /** @nullable */
  data: ProposalGetProposal200ProposalTaskData;
  email: string;
  /** @nullable */
  emailVerified: string | null;
  id: string;
  /** @nullable */
  image: string | null;
  /** @nullable */
  name: string | null;
  /** @nullable */
  referredBy: string | null;
  updatedAt: string;
};

/**
 * @nullable
 */
export type ProposalGetProposal200ProposalData = unknown | null;

export type ProposalGetProposal200Proposal = {
  agent: ProposalGetProposal200ProposalAgent;
  agentId: string;
  createdAt: string;
  /** @nullable */
  data: ProposalGetProposal200ProposalData;
  /** @nullable */
  description: string | null;
  estimatedTimeToComplete: number;
  id: string;
  price: string;
  revisions: number;
  status: string;
  task: ProposalGetProposal200ProposalTask;
  taskId: string;
  updatedAt: string;
  validTill: string;
};

export type ProposalGetProposal200 = {
  proposal: ProposalGetProposal200Proposal;
  success: boolean;
};

/**
 * @nullable
 */
export type ProposalGetProposal200ProposalAgentData = unknown | null;

export type ProposalGetProposal200ProposalAgent = {
  /** @nullable */
  averageRating: string | null;
  createdAt: string;
  /** @nullable */
  data: ProposalGetProposal200ProposalAgentData;
  freeTier: boolean;
  id: string;
  /** @nullable */
  image: string | null;
  /** @nullable */
  instantEnabled: boolean | null;
  /** @nullable */
  isApproved: boolean | null;
  /** @nullable */
  isFeatured: boolean | null;
  /** @nullable */
  isTopRated: boolean | null;
  /** @nullable */
  isVerified: boolean | null;
  /** @nullable */
  numBookmarks: number | null;
  /** @nullable */
  owner: string | null;
  /** @nullable */
  preview: string | null;
  /** @nullable */
  pricingStrategy: string | null;
  /** @nullable */
  ratings: number[] | null;
  taskTypes: string[];
  title: string;
  updatedAt: string;
  url: string;
};

export type AgentCreateDefaultTaskForAgent200Workspace = {
  createdAt: string;
  id: string;
  /** @nullable */
  owner: string | null;
  status: string;
  title: string;
  updatedAt: string;
};

/**
 * @nullable
 */
export type AgentCreateDefaultTaskForAgent200TaskData = unknown | null;

export type AgentCreateDefaultTaskForAgent200Task = {
  createdAt: string;
  /** @nullable */
  data: AgentCreateDefaultTaskForAgent200TaskData;
  id: string;
  mode: string;
  status: string;
  type: string;
  updatedAt: string;
  workspaceId: string;
};

/**
 * @nullable
 */
export type AgentCreateDefaultTaskForAgent200ProposalData = unknown | null;

export type AgentCreateDefaultTaskForAgent200Proposal = {
  agentId: string;
  createdAt: string;
  /** @nullable */
  data: AgentCreateDefaultTaskForAgent200ProposalData;
  /** @nullable */
  description: string | null;
  estimatedTimeToComplete: number;
  id: string;
  price: string;
  revisions: number;
  status: string;
  taskId: string;
  updatedAt: string;
  validTill: string;
};

export type AgentCreateDefaultTaskForAgent200 = {
  proposal: AgentCreateDefaultTaskForAgent200Proposal;
  success: boolean;
  task: AgentCreateDefaultTaskForAgent200Task;
  workspace: AgentCreateDefaultTaskForAgent200Workspace;
};

export type AgentCreateDefaultTaskForAgentBody = {
  task: AgentCreateDefaultTaskForAgentBodyTask;
};

export type AgentCreateDefaultTaskForAgentBodyTaskMode = typeof AgentCreateDefaultTaskForAgentBodyTaskMode[keyof typeof AgentCreateDefaultTaskForAgentBodyTaskMode];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AgentCreateDefaultTaskForAgentBodyTaskMode = {
  DIRECT: 'DIRECT',
} as const;

export type AgentCreateDefaultTaskForAgentBodyTaskData = { [key: string]: unknown };

export type AgentCreateDefaultTaskForAgentBodyTask = {
  data: AgentCreateDefaultTaskForAgentBodyTaskData;
  mode: AgentCreateDefaultTaskForAgentBodyTaskMode;
  type: string;
};

export type AgentGetAgent200AgentAllOfThreeOwner = {
  image: string;
  name: string;
};

export type AgentGetAgent200AgentAllOfThree = {
  owner: AgentGetAgent200AgentAllOfThreeOwner;
};

export type AgentGetAgent200Agent = AgentGetAgent200AgentAllOf & AgentGetAgent200AgentAllOfThree;

export type AgentGetAgent200 = {
  agent: AgentGetAgent200Agent;
  success: boolean;
};

/**
 * @nullable
 */
export type AgentGetAgent200AgentAllOfData = unknown | null;

export type AgentGetAgent200AgentAllOf = {
  /** @nullable */
  averageRating: string | null;
  createdAt: string;
  /** @nullable */
  data: AgentGetAgent200AgentAllOfData;
  freeTier: boolean;
  id: string;
  /** @nullable */
  image: string | null;
  /** @nullable */
  instantEnabled: boolean | null;
  /** @nullable */
  isApproved: boolean | null;
  /** @nullable */
  isFeatured: boolean | null;
  /** @nullable */
  isTopRated: boolean | null;
  /** @nullable */
  isVerified: boolean | null;
  /** @nullable */
  numBookmarks: number | null;
  /** @nullable */
  owner: string | null;
  /** @nullable */
  preview: string | null;
  /** @nullable */
  pricingStrategy: string | null;
  /** @nullable */
  ratings: number[] | null;
  taskTypes: string[];
  title: string;
  updatedAt: string;
  url: string;
};

export type AgentList200AgentsItemAllOfThreeOwner = {
  image: string;
  name: string;
};

export type AgentList200AgentsItemAllOfThree = {
  owner: AgentList200AgentsItemAllOfThreeOwner;
};

export type AgentList200AgentsItem = AgentList200AgentsItemAllOf & AgentList200AgentsItemAllOfThree;

export type AgentList200 = {
  agents: AgentList200AgentsItem[];
  success: boolean;
};

/**
 * @nullable
 */
export type AgentList200AgentsItemAllOfData = unknown | null;

export type AgentList200AgentsItemAllOf = {
  /** @nullable */
  averageRating: string | null;
  createdAt: string;
  /** @nullable */
  data: AgentList200AgentsItemAllOfData;
  freeTier: boolean;
  id: string;
  /** @nullable */
  image: string | null;
  /** @nullable */
  instantEnabled: boolean | null;
  /** @nullable */
  isApproved: boolean | null;
  /** @nullable */
  isFeatured: boolean | null;
  /** @nullable */
  isTopRated: boolean | null;
  /** @nullable */
  isVerified: boolean | null;
  /** @nullable */
  numBookmarks: number | null;
  /** @nullable */
  owner: string | null;
  /** @nullable */
  preview: string | null;
  /** @nullable */
  pricingStrategy: string | null;
  /** @nullable */
  ratings: number[] | null;
  taskTypes: string[];
  title: string;
  updatedAt: string;
  url: string;
};



/**
 * Lists all avaliable AI agents
 * @summary List avaliable AI agents
 */
export type agentListResponse = {
  data: AgentList200;
  status: number;
}

export const getAgentListUrl = () => {


  return `http://localhost:3000/api/v1/agent/`
}

export const agentList = async ( options?: RequestInit): Promise<agentListResponse> => {
  const res = await fetch(getAgentListUrl(),
  {      
    ...options,
    method: 'GET'
    
  }

  )
  const data = await res.json()

  return { status: res.status, data }
}


/**
 * Fetchs a single agent by agent ID
 * @summary Fetch a single agent
 */
export type agentGetAgentResponse = {
  data: AgentGetAgent200;
  status: number;
}

export const getAgentGetAgentUrl = (agentId: string,) => {


  return `http://localhost:3000/api/v1/agent/${agentId}`
}

export const agentGetAgent = async (agentId: string, options?: RequestInit): Promise<agentGetAgentResponse> => {
  const res = await fetch(getAgentGetAgentUrl(agentId),
  {      
    ...options,
    method: 'GET'
    
  }

  )
  const data = await res.json()

  return { status: res.status, data }
}


/**
 * Creates a workspace with a new task. When a task is created directly with a single agent, it must always be in the 'direct' mode and is assigned the default proposal strategy.
 * @summary Create a new task
 */
export type agentCreateDefaultTaskForAgentResponse = {
  data: AgentCreateDefaultTaskForAgent200;
  status: number;
}

export const getAgentCreateDefaultTaskForAgentUrl = (agentId: string,) => {


  return `http://localhost:3000/api/v1/agent/${agentId}/task`
}

export const agentCreateDefaultTaskForAgent = async (agentId: string,
    agentCreateDefaultTaskForAgentBody: AgentCreateDefaultTaskForAgentBody, options?: RequestInit): Promise<agentCreateDefaultTaskForAgentResponse> => {
  const res = await fetch(getAgentCreateDefaultTaskForAgentUrl(agentId),
  {      
    ...options,
    method: 'POST',
    body: JSON.stringify(
      agentCreateDefaultTaskForAgentBody,)
  }

  )
  const data = await res.json()

  return { status: res.status, data }
}


/**
 * Fetchs a proposal using its proposal ID
 * @summary Fetch a proposal
 */
export type proposalGetProposalResponse = {
  data: ProposalGetProposal200;
  status: number;
}

export const getProposalGetProposalUrl = (proposalId: string,) => {


  return `http://localhost:3000/api/v1/proposal/${proposalId}`
}

export const proposalGetProposal = async (proposalId: string, options?: RequestInit): Promise<proposalGetProposalResponse> => {
  const res = await fetch(getProposalGetProposalUrl(proposalId),
  {      
    ...options,
    method: 'GET'
    
  }

  )
  const data = await res.json()

  return { status: res.status, data }
}


/**
 * Finalizes a submission and notifies the client
 * @summary Finalize a submission
 */
export type submissionCreateResponse = {
  data: SubmissionCreate200;
  status: number;
}

export const getSubmissionCreateUrl = () => {


  return `http://localhost:3000/api/v1/submission/`
}

export const submissionCreate = async (submissionCreateBody: SubmissionCreateBody, options?: RequestInit): Promise<submissionCreateResponse> => {
  const res = await fetch(getSubmissionCreateUrl(),
  {      
    ...options,
    method: 'POST',
    body: JSON.stringify(
      submissionCreateBody,)
  }

  )
  const data = await res.json()

  return { status: res.status, data }
}


/**
 * Upload files to a submission
 * @summary Submit files
 */
export type submissionSubmitFilesResponse = {
  data: SubmissionSubmitFiles200;
  status: number;
}

export const getSubmissionSubmitFilesUrl = (submissionId: string,) => {


  return `http://localhost:3000/api/v1/submission/${submissionId}`
}

export const submissionSubmitFiles = async (submissionId: string,
    submissionSubmitFilesBody: SubmissionSubmitFilesBody, options?: RequestInit): Promise<submissionSubmitFilesResponse> => {
  const res = await fetch(getSubmissionSubmitFilesUrl(submissionId),
  {      
    ...options,
    method: 'POST',
    body: JSON.stringify(
      submissionSubmitFilesBody,)
  }

  )
  const data = await res.json()

  return { status: res.status, data }
}


/**
 * Upload files to a submission
 * @summary Submit files
 */
export type submissionFinalizeSubmissionResponse = {
  data: SubmissionFinalizeSubmission200;
  status: number;
}

export const getSubmissionFinalizeSubmissionUrl = (submissionId: string,) => {


  return `http://localhost:3000/api/v1/submission/${submissionId}/finalize`
}

export const submissionFinalizeSubmission = async (submissionId: string, options?: RequestInit): Promise<submissionFinalizeSubmissionResponse> => {
  const res = await fetch(getSubmissionFinalizeSubmissionUrl(submissionId),
  {      
    ...options,
    method: 'GET'
    
  }

  )
  const data = await res.json()

  return { status: res.status, data }
}


/**
 * Fetches the list of workspaces belonging to a user
 * @summary Fetch users' workspaces
 */
export type workspaceGetWorkspaceListResponse = {
  data: WorkspaceGetWorkspaceList200;
  status: number;
}

export const getWorkspaceGetWorkspaceListUrl = () => {


  return `http://localhost:3000/api/v1/workspace/`
}

export const workspaceGetWorkspaceList = async ( options?: RequestInit): Promise<workspaceGetWorkspaceListResponse> => {
  const res = await fetch(getWorkspaceGetWorkspaceListUrl(),
  {      
    ...options,
    method: 'GET'
    
  }

  )
  const data = await res.json()

  return { status: res.status, data }
}


/**
 * Get a workspace by its ID and return all tasks and proposals associated with it
 * @summary Get a workspace
 */
export type workspaceGetWorkspaceResponse = {
  data: WorkspaceGetWorkspace200;
  status: number;
}

export const getWorkspaceGetWorkspaceUrl = (workspaceId: string,) => {


  return `http://localhost:3000/api/v1/workspace/${workspaceId}`
}

export const workspaceGetWorkspace = async (workspaceId: string, options?: RequestInit): Promise<workspaceGetWorkspaceResponse> => {
  const res = await fetch(getWorkspaceGetWorkspaceUrl(workspaceId),
  {      
    ...options,
    method: 'GET'
    
  }

  )
  const data = await res.json()

  return { status: res.status, data }
}


/**
 * Watches a workspace for changes using the event streaming and notifies a user when the workspace has been updated. In production, make sure to add the /edge path to the endpoint to ensure long-running connections
 * @summary Watch workspace for changes
 */
export type workspaceGetWatchWorkspaceResponse = {
  data: void;
  status: number;
}

export const getWorkspaceGetWatchWorkspaceUrl = (workspaceId: string,) => {


  return `http://localhost:3000/api/v1/workspace/${workspaceId}/watch`
}

export const workspaceGetWatchWorkspace = async (workspaceId: string, options?: RequestInit): Promise<workspaceGetWatchWorkspaceResponse> => {
  const res = await fetch(getWorkspaceGetWatchWorkspaceUrl(workspaceId),
  {      
    ...options,
    method: 'GET'
    
  }

  )
  const data = await res.json()

  return { status: res.status, data }
}


