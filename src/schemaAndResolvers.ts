import { IResolvers, gql } from 'apollo-server';
import { merge } from 'lodash';
import * as election from './election';
import * as user from './user';
import * as auth from './auth';
import * as ballot from './ballot';

//this file is weird
//not really sure where this belongs or how to better break this up yet
//the idea is to have a single place that stitches together schemas and resolvers

const baseSchema = gql`
  type Query {
    noop: Boolean
  }
  type Mutation {
    noop: Boolean
  }
`;

export const typeDefs = [
  baseSchema,
  election.schema,
  user.schema,
  auth.schema,
  ballot.schema,
];

export const resolvers: IResolvers = merge(
  {},
  election.resolvers,
  user.resolvers,
  auth.resolvers,
  ballot.resolvers
);
