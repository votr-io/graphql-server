import { deleteMe } from './generated/deleteMe';
import { ApolloClient } from 'apollo-client';
import { clientFactory } from './client';
import { MutationFactory, QueryFactory } from '../libs/apolloFactories';
import { register, registerVariables } from './generated/register';
import { gql } from 'apollo-server-core';
import * as jwt from 'jsonwebtoken';
import { me } from './generated/me';

const uri = 'http://localhost:5000/graphql';

const client = clientFactory({ uri });

const register = MutationFactory<register, registerVariables>(
  gql`
    mutation register($username: String!, $password: String!) {
      register(input: { username: $username, password: $password }) {
        token
      }
    }
  `
);

const me = QueryFactory<me>(
  gql`
    query me {
      me {
        username
      }
    }
  `
);

const deleteMe = MutationFactory<deleteMe>(
  gql`
    mutation deleteMe {
      deleteMe
    }
  `
);

async function newUser(
  username: string
): Promise<{ token: string; client: ApolloClient<any>; cleanUp: () => Promise<void> }> {
  const {
    data: {
      register: { token },
    },
  } = await register.call(client, { username, password: 'boggle' });
  expect(jwt.decode(token)['username']).toBe(username);

  const clientWithToken = clientFactory({ uri, token });
  return {
    token,
    client: clientWithToken,
    cleanUp: async () => {
      await deleteMe.call(clientWithToken, {});

      const res = await me.call(clientWithToken, {});
      console.log(res);
      expect(res.errors.length).toBeGreaterThan(0);
    },
  };
}

test('me', async () => {
  const username = 'newUser';
  const { cleanUp, client } = await newUser(username);
  const res = await me.call(client, {});
  expect(res.data.me.username).toBe(username);

  await cleanUp();
});
