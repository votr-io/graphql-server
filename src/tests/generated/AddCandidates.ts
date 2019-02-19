/* tslint:disable */
// This file was automatically generated and should not be edited.

import { CreateCandidateInput, ElectionStatus } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: AddCandidates
// ====================================================

export interface AddCandidates_addCandidates_election_createdBy {
  __typename: "User";
  id: string;
  email: string;
}

export interface AddCandidates_addCandidates_election_candidates {
  __typename: "Candidate";
  id: string;
  name: string;
  description: string | null;
}

export interface AddCandidates_addCandidates_election_statusTransitions {
  __typename: "ElectionStatusTransition";
  on: string;
  status: ElectionStatus;
}

export interface AddCandidates_addCandidates_election_results_winner {
  __typename: "Candidate";
  id: string;
  name: string;
}

export interface AddCandidates_addCandidates_election_results {
  __typename: "Results";
  winner: AddCandidates_addCandidates_election_results_winner;
}

export interface AddCandidates_addCandidates_election {
  __typename: "Election";
  id: string;
  name: string;
  description: string;
  createdBy: AddCandidates_addCandidates_election_createdBy;
  candidates: AddCandidates_addCandidates_election_candidates[];
  status: ElectionStatus;
  statusTransitions: AddCandidates_addCandidates_election_statusTransitions[];
  results: AddCandidates_addCandidates_election_results | null;
}

export interface AddCandidates_addCandidates {
  __typename: "AddCandidatesResponse";
  election: AddCandidates_addCandidates_election;
}

export interface AddCandidates {
  addCandidates: AddCandidates_addCandidates;
}

export interface AddCandidatesVariables {
  electionId: string;
  candidates: CreateCandidateInput[];
}
