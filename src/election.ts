import { gql } from 'apollo-server-core';
import { IResolvers } from 'apollo-server';
import { Context, context } from './context';
import * as tokens from './tokens';
import { getUsers, getUsersByEmail, createUser } from './db/user';
import { Election, getElections, createElection, deleteElections } from './db/election';
const uuidv4 = require('uuid/v4');

export const schema = gql`
  extend type Query {
    getElections(input: GetElectionsRequest!): GetElectionsResponse
  }
  extend type Mutation {
    createElection(input: CreateElectionRequest!): CreateElectionResponse!
    deleteElections(input: DeleteElectionsRequest!): Boolean!
    # updateElection(input: UpdateElectionRequest): UpdateElectionResponse!
    # addCandidates(input: AddCandidatesRequest): AddCandidatesResponse!
    # removeCandidates(input: RemoveCandidatesRequest): RemoveCandidatesResponse!
    # setStatus(input: SetStatusRequest): SetStatusResponse!

    #addRegistrations (this should probably be allowed in both PENDING and ACTIVE)
    #removeRegistrations (this should probably be allowed only in PENDING)
  }

  input GetElectionsRequest {
    ids: [ID!]!
  }
  type GetElectionsResponse {
    elections: [Election!]!
  }

  input CreateElectionRequest {
    name: String!
    description: String!
    candidates: [CreateCandidateInput!]!
    email: String
  }
  input CreateCandidateInput {
    name: String!
    description: String
  }
  type CreateElectionResponse {
    election: Election!
  }

  input DeleteElectionsRequest {
    ids: [ID!]!
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
    description: String!
    createdBy: User!
    dateUpdated: String!
    candidates: [Candidate!]!
    status: ElectionStatus!
    statusTransitions: [ElectionStatusTransition!]!
    results: Results
    adminToken: String
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
    getElections: (_, args: { input: { ids: string[] } }) => {
      const { ids } = args.input;
      /*
      TODO: Authorization.  only return if:
         - this election is owned by the user making the request
         - this election is private, but the user making the request is registered
         - this election is public
      */

      const elections = getElections({ ids });
      return { elections };
    },
  },
  Election: {
    createdBy: async (election: Election) => {
      const [user] = await getUsers({ ids: [election.created_by] });
      return user;
    },
    adminToken: async (election: Election) => {
      const [user] = await getUsers({ ids: [election.created_by] });
      return tokens.encryptAdminToken({ userId: user.id, electionId: election.id });
    },
  },
  Mutation: {
    createElection: async (
      _,
      args: {
        input: {
          name: string;
          description: string;
          candidates: CreateCandidateInput[];
          email: string;
        };
      }
    ) => {
      console.log('create election request received');
      //TODO: validate input

      const { name, description, candidates, email } = args.input;
      const now = new Date().toISOString();

      console.log(`looking up user by email ${email}...`);
      let [user] = await getUsersByEmail({ emails: [email] });
      if (!user) {
        console.log(`couldn't find user with email ${email}, creating one...`);
        user = await createUser({
          user: { id: uuidv4(), email, date_created: now, type: 'WEAK' },
        });
      }

      let election = await createElection({
        election: {
          id: uuidv4(),
          name,
          description,
          created_by: user.id,
          date_created: now,
          date_updated: now,
          candidates: candidates.map(candidate => ({ id: uuidv4(), ...candidate })),
          status: 'PENDING',
          status_transitions: [
            {
              on: now,
              status: 'PENDING',
            },
          ],
        },
      });

      return {
        election: {
          ...election,
          createdBy: user.id,
          dateUpdated: election.date_updated,
          statusTransitions: election.status_transitions,
        },
      };
    },
    deleteElections: async (
      _,
      args: { input: { ids: string[] } },
      { token }: Context
    ) => {
      const claims = tokens.validate(token);
      const { ids } = args.input;

      const elections = await getElections({ ids });
      const electionsAuthorizedForDeleteion = elections
        .filter(({ created_by }) => created_by === claims.userId)
        .filter(
          ({ id }) => (tokens.isWeakClaims(claims) ? id === claims.electionId : true) //if the claims are weak, there's only one election they can delete
        )
        .map(({ id }) => id);

      await deleteElections({ ids: electionsAuthorizedForDeleteion });

      return true;
    },
  },
};

interface CreateCandidateInput {
  name: string;
  description: string;
}
