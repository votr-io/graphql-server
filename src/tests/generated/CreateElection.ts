/* tslint:disable */
// This file was automatically generated and should not be edited.

import { CreateCandidateInput, ElectionStatus } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateElection
// ====================================================

export interface CreateElection_createElection_election_createdBy {
  __typename: "User";
  id: string;
  email: string;
}

export interface CreateElection_createElection_election_candidates {
  __typename: "Candidate";
  id: string;
  name: string;
  description: string | null;
}

export interface CreateElection_createElection_election_statusTransitions {
  __typename: "ElectionStatusTransition";
  on: string;
  status: ElectionStatus;
}

export interface CreateElection_createElection_election_results_winner {
  __typename: "Candidate";
  id: string;
  name: string;
}

export interface CreateElection_createElection_election_results {
  __typename: "Results";
  winner: CreateElection_createElection_election_results_winner;
}

export interface CreateElection_createElection_election {
  __typename: "Election";
  id: string;
  name: string;
  description: string;
  createdBy: CreateElection_createElection_election_createdBy;
  candidates: CreateElection_createElection_election_candidates[];
  status: ElectionStatus;
  statusTransitions: CreateElection_createElection_election_statusTransitions[];
  results: CreateElection_createElection_election_results | null;
}

export interface CreateElection_createElection {
  __typename: "CreateElectionResponse";
  election: CreateElection_createElection_election;
}

export interface CreateElection {
  createElection: CreateElection_createElection;
}

export interface CreateElectionVariables {
  name: string;
  description: string;
  candidates: CreateCandidateInput[];
  email?: string | null;
}
