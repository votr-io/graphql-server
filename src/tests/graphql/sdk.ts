import { GraphQLClient } from 'graphql-request';
import { getSdk } from './generated/sdk';

//this nonsense is to get cookies to work in our tests
import * as IsomorphicFetch from 'real-isomorphic-fetch';
import * as fetch from 'node-fetch';
global['fetch'] = new IsomorphicFetch(fetch);

const url = 'http://localhost:5000/graphql';
// const url = 'https://votr-graphql.herokuapp.com/graphql';

export type Sdk = ReturnType<typeof getSdk>;

export function newSdk() {
  const client = new GraphQLClient(url, {
    credentials: 'include',
  });
  return getSdk(client);
}

export const sdk = newSdk();
