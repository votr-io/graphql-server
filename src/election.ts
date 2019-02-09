import { Election } from './db';
import { gql } from 'apollo-server-core';
import { IResolvers } from 'apollo-server';
import { Context } from './context';
import * as tokens from './tokens';

export const schema = gql`
  extend type Query {
    listElections(): [Election!]!
  }
  extend type Mutation {
    createElection(input: CreateElectionRequest): CreateElectionResponse!
    updateElection(input: UpdateElectionRequest): UpdateElectionResponse!
    addCandidates(input: AddCandidatesRequest): AddCandidatesResponse!
    removeCandidates(input: RemoveCandidatesRequest): RemoveCandidatesResponse!
    setStatus(input: SetStatusRequest): SetStatusResponse!
    deleteElections(input: DeleteElectionsRequest): Boolean!

    #addRegistrations (this should probably be allowed in both PENDING and ACTIVE)
    #removeRegistrations (this should probably be allowed only in PENDING)
  }

  input CreateElectionRequest {
    name: String!
    candidates: [CreateCandidateInput!]!
  }
  input CreateCandidateInput {
    name: String!
    description: String!
  }
  type CreateElectionResponse {
    election: Election!
  }


  """
  updateElection is used to modify an election when it is in the PENDING status.
  Once an election has entered any other status, it's configuration is frozen.
  TODO: add properties here like public/private, manual/scheduled start/end dates
  """  
  input UpdateElectionRequest {
    name: String
  }
  input UpdateElectionResponse {
    election: Election!
  }


  input AddCandidatesRequest {
    electionId: ID!
    candidates: [CreateCandidateInput!]!
  }
  type AddCandidatesResponse {
    election: Election!
  }

  input RemoveCandidatesRequest {
    electionId: ID!
    candidateIds [ID!]!
  }
  type RemoveCandidatesResponse {
    election: Election!
  }

  input DeleteElectionsRequest {
    electionIds: [ID!]!
  }


  """
  Moves the election into a status.  
  Request will fail if the status is an invalid transition.
  """
  input SetStatusRequest {
    electionId: ID!
    status: ElectionStatus!
  }
  type SetStatusResponse {
    election: Election!
  }

  """
  Possible statuses an election can be in.
  Transitions only go in one direction.  There's no going back.
  """
  enum ElectionStatus {
    PENDING
    ACTIVE
    TALLYING
    COMPLETE
  }

  """
  Represents the dateTime an election moved into a specific status.
  """
  enum ElectionStatusTransition {
    on: String!
    status: Status!
  }

  """
  An election.
  """
  type Election {
    id: ID!
    name: String!
    createdBy: User!
    dateUpdated: String!
    candidates: [Candidate!]!
    statuses: ElectionStatus!
    statusTransitions: [ElectionStatusTransition!]!
    results: Results
  }

  """
  A candidate in a specific election.
  """
  type Candidate {
    id: ID!
    name: String!
    description: String
  }

  """
  The winner of the election and all of the data needed to show how the election was won.
  """
  type Results {
    winner: Candidate!
    replay: [Round!]!
  }

  """
  Information about a specific round of an election.
  If this is the final round of the election, redistribution will be null,
    candidateTotals - the number of votes each candidate is awarded this round
    redistribution - the number of votes being redistributed to each candidate (does not include the last place candidate for this round)
  """
  type Round {
    candidateTotals: [CandidateVotes!]!
    redistribution: [CandidateVotes]
  }

  """
  Votes associated with a candidate.  
  Can be used for:
    - number of votes a candidate recieved in a round
    - number of votes being redistributed to a candidate in the event there's more than one round

  Note: if canditate is null, that means that these votes no longer have a valid candidate to count towards (all the candidates on these ballots have been dropped from the election due to being in last place in previous rounds)
  """
  type CandidateVotes {
    candidate: Candidate
    votes: Int!
  }
`;

export const resolvers: IResolvers<any, Context> = {
  Query: {
    listElections: (_, args: {}, ctx: Context) => {
      return;
    },
  },
  Mutation: {
    login: (_, args: { input: { username: string; password: string } }) => {
      const { username, password } = args.input;
      if (password !== 'boggle') {
        throw new Error('bad password');
      }
      return { token: tokens.sign({ username }) };
    },
  },
};
