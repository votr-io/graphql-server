import { gql } from 'apollo-server-core';
import { IResolvers } from 'apollo-server';
import { Context } from './context';
import * as tokens from './tokens';

export const schema = gql`
  extend type Query {
    listElections(): [Election!]!
  }
  extend type Mutation {
    createElection(input: CreateElectionRequest): CreateElectionResponse
  }

  input CreateElectionRequest {
    name: String!
  }
  type CreateElectionResponse {
    election: Election!
  }

  type Election {
    name: String!
    createdBy: User!
  }
`;

export const resolvers: IResolvers<any, Context> = {
  Query: {
    me: (_, args: {}, ctx: Context) => {
      return tokens.validate(ctx.token);
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
