/* tslint:disable */
// This file was automatically generated and should not be edited.

import { ElectionStatus } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: SetStatus
// ====================================================

export interface SetStatus_setStatus_election_createdBy {
  __typename: "User";
  id: string;
  email: string;
}

export interface SetStatus_setStatus_election_candidates {
  __typename: "Candidate";
  id: string;
  name: string;
  description: string | null;
}

export interface SetStatus_setStatus_election_statusTransitions {
  __typename: "ElectionStatusTransition";
  on: string;
  status: ElectionStatus;
}

export interface SetStatus_setStatus_election_results_winner {
  __typename: "Candidate";
  id: string;
  name: string;
}

export interface SetStatus_setStatus_election_results {
  __typename: "Results";
  winner: SetStatus_setStatus_election_results_winner;
}

export interface SetStatus_setStatus_election {
  __typename: "Election";
  id: string;
  name: string;
  description: string;
  adminToken: string | null;
  createdBy: SetStatus_setStatus_election_createdBy;
  candidates: SetStatus_setStatus_election_candidates[];
  status: ElectionStatus;
  statusTransitions: SetStatus_setStatus_election_statusTransitions[];
  results: SetStatus_setStatus_election_results | null;
}

export interface SetStatus_setStatus {
  __typename: "SetStatusResponse";
  election: SetStatus_setStatus_election;
}

export interface SetStatus {
  setStatus: SetStatus_setStatus;
}

export interface SetStatusVariables {
  electionId: string;
  status: ElectionStatus;
}
