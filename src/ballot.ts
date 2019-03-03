import { gql, UserInputError } from 'apollo-server-core';

import { Context } from './context';
import { IResolvers } from './generated/resolvers';

import { getElection, withNotFound, createBallot } from './db/election';

export const schema = gql`
  extend type Mutation {
    castBallot(input: SubmitBallotRequest!): Boolean!
  }

  input SubmitBallotRequest {
    electionId: ID!
    candidateIds: [ID!]!
  }
`;

export const resolvers: IResolvers = {
  Mutation: {
    castBallot: async (_, args) => {
      const { electionId, candidateIds } = args.input;
      if (candidateIds.length === 0) {
        throw new UserInputError(`why don't you try standing for something`);
      }
      const election = await getElection(electionId).then(withNotFound);
      if (election.status === 'PENDING') {
        throw new UserInputError(`can't vote in an election that hasn't started yet`);
      } else if (election.status !== 'OPEN') {
        throw new UserInputError(`can't vote in an election that is closed`);
      }
      const bogusCandidates = candidateIds.filter(
        id => !election.candidates.map(candidate => candidate.id).includes(id)
      );
      if (bogusCandidates.length !== 0) {
        throw new UserInputError(
          `the following candidates are not in this election: ${bogusCandidates.join(
            ', '
          )}`
        );
      }
      const candidateIdToIndex = election.candidates.reduce((acc, { id }, i) => {
        acc[id] = i;
        return acc;
      }, {});
      await createBallot({
        electionId,
        candidateIndexes: candidateIds.map(id => candidateIdToIndex[id]),
      });
      return true;
    },
  },
};
