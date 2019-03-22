import { gql } from 'apollo-server-core';
import { IResolvers } from 'apollo-server';
import { Context } from './context';

export const schema = gql`
  type User {
    id: String!
    email: String!
  }
`;

export const resolvers: IResolvers<any, Context> = {};
