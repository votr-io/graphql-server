import { gql, ForbiddenError, UserInputError } from 'apollo-server-core';
import { IResolvers } from 'apollo-server';
import { Context } from './context';
import * as tokens from './tokens';
import { getUsers, getUsersByEmail, createUser } from './db/user';
import {
  Election,
  getElections,
  createElection,
  deleteElections,
  getElection,
  createCandidates,
  withNotFound,
  deleteCandidates,
  ElectionStatus,
  updateElection,
} from './db/election';
import * as lodash from 'lodash';
import { QueryResolvers } from './generated/resolvers';
const uuidv4 = require('uuid/v4');

export const schema = gql`
  extend type Query {
    getElections(input: GetElectionsRequest!): GetElectionsResponse
  }
  extend type Mutation {
    createElection(input: CreateElectionRequest!): CreateElectionResponse!
    deleteElections(input: DeleteElectionsRequest!): Boolean!
    # updateElection(input: UpdateElectionRequest): UpdateElectionResponse!
    addCandidates(input: AddCandidatesRequest): AddCandidatesResponse!
    removeCandidates(input: RemoveCandidatesRequest): RemoveCandidatesResponse!
    setStatus(input: SetStatusRequest): SetStatusResponse!

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
    adminToken: String
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
  Query: <QueryResolvers.Resolvers>{
    getElections: async (_, args) => {
      const { ids } = args.input;
      /*
      TODO: Authorization.  only return if:
         - this election is owned by the user making the request
         - this election is private, but the user making the request is registered
         - this election is public
      */

      const elections = await getElections({ ids });
      // return { elections: elections.map(toApiElection) };
      const ret: GetElectionsResponse = {};
      return ret;
    },
  },
  Election: {
    createdBy: async (election: Election) => {
      const [user] = await getUsers({ ids: [election.created_by] });
      return user;
    },
    candidates: (election: Election) => {
      return shuffle(election.candidates);
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
      const { name, description, candidates, email } = args.input;

      const errors: string[] = [];
      if (name === '') {
        errors.push('name is required');
      }
      if (email === '') {
        errors.push('email is required if you do not have an account');
      }
      if (candidates.length < 2) {
        errors.push('at least two candidates are required');
      }
      if (candidates.filter(({ name }) => name === '').length !== 0) {
        errors.push('candidate.name is required');
      }
      if (errors.length > 0) {
        throw new UserInputError(`createElection error: ${errors.join(', ')}`);
      }

      const now = new Date().toISOString();

      let [user] = await getUsersByEmail({ emails: [email] });
      if (!user) {
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
        election: toApiElection(election),
        adminToken: tokens.encryptAdminToken({
          userId: user.id,
          electionId: election.id,
        }),
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
      const electionsAuthorizedForDeletion = elections
        .filter(({ created_by }) => created_by === claims.userId)
        .filter(
          ({ id }) => (tokens.isWeakClaims(claims) ? id === claims.electionId : true) //if the claims are weak, there's only one election they can delete
        )
        .map(({ id }) => id);

      if (electionsAuthorizedForDeletion.length == 0) {
        return true;
      }

      await deleteElections({ ids: electionsAuthorizedForDeletion });

      return true;
    },

    addCandidates: async (
      _,
      args: { input: { electionId: string; candidates: CreateCandidateInput[] } },
      { token }: Context
    ) => {
      const { electionId, candidates } = args.input;

      const election = await getElectionAndCheckPermissionsToUpdate(token, electionId);

      if (election.status != 'PENDING') {
        throw new UserInputError('cannot change an election after it has begun');
      }

      const dedupedCandidates = lodash
        .uniqBy(candidates, ({ name }) => name.toLowerCase())
        .filter(
          newCandidate =>
            !election.candidates.find(
              ({ name }) => name.toLowerCase() === newCandidate.name.toLowerCase()
            )
        );

      if (dedupedCandidates.length == 0) {
        return { election: toApiElection(election) };
      }

      const updatedElection = await createCandidates({
        electionId,
        candidates: dedupedCandidates.map(candidate => ({ id: uuidv4(), ...candidate })),
      });
      return { election: toApiElection(updatedElection) };
    },

    removeCandidates: async (
      _,
      args: { input: { electionId: string; candidateIds: string[] } },
      { token }: Context
    ) => {
      const { electionId, candidateIds } = args.input;

      const election = await getElectionAndCheckPermissionsToUpdate(token, electionId);

      if (election.status != 'PENDING') {
        throw new UserInputError('cannot change an election after it has begun');
      }

      if (candidateIds.length === 0) {
        return { election: toApiElection(election) };
      }

      if (election.candidates.filter(({ id }) => !candidateIds.includes(id)).length < 2) {
        throw new UserInputError('an election must have at least two candidates');
      }

      const updatedElection = await deleteCandidates({
        electionId,
        candidateIds,
      });
      return { election: toApiElection(updatedElection) };
    },

    setStatus: async (
      _,
      args: { input: { electionId: string; status: ElectionStatus } },
      { token }: Context
    ) => {
      const { electionId, status } = args.input;

      const election = await getElectionAndCheckPermissionsToUpdate(token, electionId);

      if (election.status === status) {
        return { election: toApiElection(election) };
      }

      //TODO: clean up this validation and make it data driven with good error messaging
      if (election.status === 'PENDING' && status !== 'OPEN') {
        throw new UserInputError('invalid status transition');
      }
      if (election.status === 'OPEN' && status !== 'TALLYING') {
        throw new UserInputError('invalid status transition');
      }

      const now = new Date().toISOString();
      const updatedElection = await updateElection({
        election: {
          ...election,
          status,
          date_updated: now,
          status_transitions: [...election.status_transitions, { status, on: now }],
        },
      });
      return { election: toApiElection(updatedElection) };
    },
  },
};
async function getElectionAndCheckPermissionsToUpdate(
  token: string,
  electionId: string
): Promise<Election> {
  const claims = tokens.validate(token);
  const election = await getElection(electionId).then(withNotFound);

  if (election.created_by !== claims.userId) {
    throw new ForbiddenError('403');
  }
  if (tokens.isWeakClaims(claims) && claims.electionId !== election.id) {
    throw new ForbiddenError('403');
  }

  return election;
}

interface CreateCandidateInput {
  name: string;
  description: string;
}

function toApiElection(election: Election) {
  return {
    ...election,
    dateUpdated: election.date_updated,
    statusTransitions: election.status_transitions,
  };
}

//https://bost.ocks.org/mike/shuffle/
function shuffle<T>(ogArray: T[]) {
  const array = lodash.cloneDeep(ogArray);
  var m = array.length,
    t,
    i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}
