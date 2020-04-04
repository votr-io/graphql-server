export enum Status {
  SETUP = 'SETUP',
  OPEN = 'OPEN',
  TALLYING = 'TALLYING',
  CLOSED = 'CLOSED',
}

export interface Election {
  id: string;
  dateCreated: Date;
  dateUpdated: Date;
  createdByEmail?: string;
  name: string;
  description: string;
  status: Status;
  candidates: Candidate[];
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
