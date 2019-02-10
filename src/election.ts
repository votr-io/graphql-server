import { Election, ElectionStatus } from './db';
import { gql } from 'apollo-server-core';
import { IResolvers } from 'apollo-server';
import { Context, context } from './context';
import * as tokens from './tokens';
const uuidv4 = require('uuid/v4');

export const schema = gql`
  extend type Query {
    getElections(input: GetElectionsRequest): GetElectionsResponse
    listElections: ListElectionsResponse
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

  input GetElectionsRequest {
    ids: [ID!]!
  }
  type GetElectionsResponse {
    elections: [Election!]!
  }

  type ListElectionsResponse {
    elections: [Election!]!
  }

  input CreateElectionRequest {
    name: String!
    candidates: [CreateCandidateInput!]!
  }
  input CreateCandidateInput {
    name: String!
    description: String
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
  type UpdateElectionResponse {
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
    candidateIds: [ID!]!
  }
  type RemoveCandidatesResponse {
    election: Election!
  }

  input DeleteElectionsRequest {
    ids: [ID!]!
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
    OPEN
    TALLYING
    CLOSED
  }

  """
  Represents the dateTime an election moved into a specific status.
  """
  type ElectionStatusTransition {
    on: String!
    status: ElectionStatus!
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
    status: ElectionStatus!
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
    getElections: (_, args: { input: { ids: string[] } }, { token, db }: Context) => {
      const { ids } = args.input;
      /*
      TODO: Authorization.  only return if:
         - this election is owned by the user making the request
         - this election is private, but the user making the request is registered
         - this election is public
      */

      const elections = db.getElections({ ids });
      return { elections };
    },
    listElections: (_, args: {}, { token, db }: Context) => {
      const { id } = tokens.validate(token);
      return db.listElections({ createdBy: id });
    },
  },
  Election: {
    createdBy: async (election: Election, _, { db }: Context) => {
      return db.getUsers({ ids: [election.createdBy] })[0];
    },
  },
  Mutation: {
    createElection: (
      _,
      args: { input: { name: string; candidates: CreateCandidateInput[] } },
      { token, db }: Context
    ) => {
      console.log('create election request received');
      const { id } = tokens.validate(token);
      const { name, candidates } = args.input;
      const now = new Date().toISOString();
      const election = db.createElection({
        election: {
          id: uuidv4(),
          name,
          createdBy: id,
          dateUpdated: now,
          candidates: candidates.map(candidate => ({ id: uuidv4(), ...candidate })),
          status: 'PENDING',
          statusTransitions: [
            {
              on: now,
              status: 'PENDING',
            },
          ],
        },
      });
      return { election };
    },
    deleteElections: (_, args: { input: { ids: string[] } }, { token, db }: Context) => {
      const { id } = tokens.validate(token);
      const { ids } = args.input;

      const elections = db.getElections({ ids });
      const electionsAuthorizedForDeleteion = elections
        .filter(({ createdBy }) => createdBy === id)
        .map(({ id }) => id);

      db.deleteElections({ ids: electionsAuthorizedForDeleteion });
      return true;
    },
  },
};

interface CreateCandidateInput {
  name: string;
  description: string;
}
