export interface Context {
  token?: string;
}

type ElectionStatus = 'SETUP' | 'OPEN' | 'TALLYING' | 'CLOSED';

export interface Election {
  id: string;
  dateCreated: Date;
  dateUpdated: Date;
  createdBy: string;
  name: string;
  description: string;
  candidates: Candidate[];
  status: ElectionStatus;
  results?: Results;
}
export interface Candidate {
  id: string;
  name: string;
  description: string;
}

export interface Ballot {
  electionId: string;
  dateCreated: Date;
  candidateIds: string[];
}

export interface Results {
  //TODO
}

export interface PageInfo {
  endCursor?: string;
}
