import { GraphQLClient } from 'graphql-request';
import { getSdk } from './generated/sdk';

const url = 'http://localhost:5000/graphql';

const client = new GraphQLClient(url);

export const sdk = getSdk(client);
