/* tslint:disable */
// This file was automatically generated and should not be edited.

import { ElectionStatus } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: RemoveCandidates
// ====================================================

export interface RemoveCandidates_removeCandidates_election_createdBy {
  __typename: "User";
  id: string;
  email: string;
}

export interface RemoveCandidates_removeCandidates_election_candidates {
  __typename: "Candidate";
  id: string;
  name: string;
  description: string | null;
}

export interface RemoveCandidates_removeCandidates_election_statusTransitions {
  __typename: "ElectionStatusTransition";
  on: string;
  status: ElectionStatus;
}

export interface RemoveCandidates_removeCandidates_election_results_winner {
  __typename: "Candidate";
  id: string;
  name: string;
}

export interface RemoveCandidates_removeCandidates_election_results {
  __typename: "Results";
  winner: RemoveCandidates_removeCandidates_election_results_winner;
}

export interface RemoveCandidates_removeCandidates_election {
  __typename: "Election";
  id: string;
  name: string;
  description: string;
  createdBy: RemoveCandidates_removeCandidates_election_createdBy;
  candidates: RemoveCandidates_removeCandidates_election_candidates[];
  status: ElectionStatus;
  statusTransitions: RemoveCandidates_removeCandidates_election_statusTransitions[];
  results: RemoveCandidates_removeCandidates_election_results | null;
}

export interface RemoveCandidates_removeCandidates {
  __typename: "RemoveCandidatesResponse";
  election: RemoveCandidates_removeCandidates_election;
}

export interface RemoveCandidates {
  removeCandidates: RemoveCandidates_removeCandidates;
}

export interface RemoveCandidatesVariables {
  electionId: string;
  candidateIds: string[];
}
