require('fetch-cookie/node-fetch')(require('node-fetch'));

import { GraphQLClient } from 'graphql-request';
import { getSdk } from './generated/sdk';

const url = 'http://localhost:5000/graphql';

export type Sdk = ReturnType<typeof getSdk>;

export function newSdk() {
  const client = new GraphQLClient(url);
  return getSdk(client);
}

export const sdk = newSdk();
