import { gql } from 'apollo-server-core';
import { IResolvers } from 'apollo-server';
import { Context } from './context';
import * as tokens from './tokens';
import { getUsers } from './db/user';

export const schema = gql`
  extend type Mutation {
    weakLogin(input: WeakLoginRequest!): WeakLoginResponse!
  }

  input WeakLoginRequest {
    adminToken: String!
  }
  type WeakLoginResponse {
    accessToken: String!
  }
`;

export const resolvers: IResolvers<any, Context> = {
  Mutation: {
    weakLogin: async (_, args: { input: { adminToken: string } }) => {
      const { adminToken } = args.input;

      const { userId, electionId } = tokens.descryptAdminToken(adminToken);

      const [user] = await getUsers({ ids: [userId] });
      if (user == null) {
        throw new Error('user not found');
      }
      if (user.type !== 'WEAK') {
        throw new Error('not a weak user');
      }

      return { accessToken: tokens.sign({ userId, electionId }) };
    },
  },
};
