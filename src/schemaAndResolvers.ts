import { IResolvers, gql } from 'apollo-server';
import { merge } from 'lodash';
import * as auth from './auth';
import * as election from './election';

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

export const typeDefs = [baseSchema, auth.schema, election.schema];

export const resolvers: IResolvers = merge({}, auth.resolvers, election.resolvers);
