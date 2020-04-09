export interface Context {
  token?: string;
}

// export enum Status {
//   SETUP = 'SETUP',
//   OPEN = 'OPEN',
//   TALLYING = 'TALLYING',
//   CLOSED = 'CLOSED',
// }

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

export interface Results {
  //TODO
}

export interface PageInfo {
  endCursor?: string;
}
