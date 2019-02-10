import { gql } from 'apollo-server-core';
import { IResolvers } from 'apollo-server';
import { Context } from './context';
import * as tokens from './tokens';

export const schema = gql`
  extend type Query {
    me: User
  }
  extend type Mutation {
    login(input: LoginRequest): LoginResponse!
    register(input: RegisterRequest): RegisterResponse!
    deleteMe: Boolean!
  }

  input LoginRequest {
    username: String!
    password: String!
  }
  type LoginResponse {
    token: String!
  }

  input RegisterRequest {
    username: String!
    password: String!
  }
  type RegisterResponse {
    token: String!
  }

  type User {
    username: String!
  }
`;

export const resolvers: IResolvers<any, Context> = {
  Query: {
    me: (_, args: {}, { token, db }: Context) => {
      const { username } = tokens.validate(token);
      const user = db.getUsers({ ids: [username] });
      if (user == null) {
        throw new Error('user not found');
      }
      return user;
    },
  },
  Mutation: {
    login: (
      _,
      args: { input: { username: string; password: string } },
      { db }: Context
    ) => {
      const { username, password } = args.input;

      const [user] = db.getUsers({ ids: [username] });
      if (user == null) {
        throw new Error('user not found');
      }

      if (password != user.password) {
        throw new Error('bad password');
      }

      return { token: tokens.sign({ username }) };
    },
    register: (
      _,
      args: { input: { username: string; password: string } },
      { db }: Context
    ) => {
      const { username, password } = args.input;
      db.createUser({ username, password });
      return { token: tokens.sign({ username }) };
    },
    deleteMe: (
      _,
      args: { input: { username: string; password: string } },
      { db, token }: Context
    ) => {
      const { username } = tokens.validate(token);
      db.deleteUsers({ ids: [username] });
      return true;
    },
  },
};
