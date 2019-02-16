import { gql } from 'apollo-server-core';
import { IResolvers } from 'apollo-server';
import { Context } from './context';
import * as tokens from './tokens';

export const schema = gql`
  type User {
    id: String!
    email: String!
  }
`;

export const resolvers: IResolvers<any, Context> = {
  //   Query: {
  //     me: (_, args: {}, { token, db }: Context) => {
  //       const { id } = tokens.validate(token);
  //       const [user] = db.getUsers({ ids: [id] });
  //       if (user == null) {
  //         throw new Error('user not found');
  //       }
  //       return user;
  //     },
  //   },
  //   Mutation: {
  //     login: (
  //       _,
  //       args: { input: { username: string; password: string } },
  //       { db }: Context
  //     ) => {
  //       const { username, password } = args.input;
  //       const [user] = db.getUsers({ ids: [username] });
  //       if (user == null) {
  //         throw new Error('user not found');
  //       }
  //       if (password != user.password) {
  //         throw new Error('bad password');
  //       }
  //       return { token: tokens.sign(user) };
  //     },
  //     register: (
  //       _,
  //       args: { input: { username: string; password: string } },
  //       { db }: Context
  //     ) => {
  //       const { username, password } = args.input;
  //       const user = db.createUser({ username, password });
  //       return { token: tokens.sign(user) };
  //     },
  //     deleteMe: (
  //       _,
  //       args: { input: { username: string; password: string } },
  //       { db, token }: Context
  //     ) => {
  //       const { id } = tokens.validate(token);
  //       db.deleteUsers({ ids: [id] });
  //       return true;
  //     },
  //   },
};
