import { GraphQLClient } from 'graphql-request';
import { getSdk } from './generated/sdk';

//this nonsense is to get cookies to work in our tests
const IsomorphicFetch = require('real-isomorphic-fetch');
const fetch = require('node-fetch');
global['fetch'] = new IsomorphicFetch(fetch);

const url = 'http://localhost:5000/graphql';

export type Sdk = ReturnType<typeof getSdk>;

export function newSdk() {
  const client = new GraphQLClient(url, {
    credentials: 'include',
    mode: 'cors',
  });
  return getSdk(client);
}

export const sdk = newSdk();
