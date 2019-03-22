export interface Election {
  id: string;
  name: string;
  description: string;
  created_by: string;
  date_created: string;
  date_updated: string;
  candidates: Candidate[];
  status: ElectionStatus;
  status_transitions: { on: string; status: ElectionStatus }[];
  results?: Results;
}

export interface Candidate {
  id: string;
  name: string;
  description: string;
}

export interface Results {
  winner: string;
  replay: {
    candidate_totals: CandidateVotes[];
    redistribution: CandidateVotes[];
  }[];
}

export type ElectionStatus = 'PENDING' | 'OPEN' | 'TALLYING' | 'CLOSED';

export interface CandidateVotes {
  candidate_id: string;
  votes: number;
}
