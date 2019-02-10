import { createElectionVariables, createElection } from './generated/createElection';
import { deleteMe } from './generated/deleteMe';
import { ApolloClient } from 'apollo-client';
import { clientFactory } from './client';
import { MutationFactory, QueryFactory } from '../libs/apolloFactories';
import { register, registerVariables } from './generated/register';
import { gql } from 'apollo-server-core';
import * as jwt from 'jsonwebtoken';
import { me } from './generated/me';
import { newUser } from './auth.test';
import { deleteElectionsVariables, deleteElections } from './generated/deleteElections';
import { getElections, getElectionsVariables } from './generated/getElections';

const uri = 'http://localhost:5000/graphql';

const client = clientFactory({ uri });

const createElection = MutationFactory<createElection, createElectionVariables>(
  gql`
    mutation createElection($name: String!, $candidates: [CreateCandidateInput!]!) {
      createElection(input: { name: $name, candidates: $candidates }) {
        election {
          id
          name
          createdBy {
            id
            username
          }
          candidates {
            id
            name
            description
          }
          status
          statusTransitions {
            on
            status
          }
          results {
            winner {
              id
              name
            }
          }
        }
      }
    }
  `
);

const getElections = QueryFactory<getElections, getElectionsVariables>(
  gql`
    query getElections($ids: [ID!]!) {
      getElections(input: { ids: $ids }) {
        elections {
          id
          name
          createdBy {
            id
            username
          }
          candidates {
            id
            name
            description
          }
          status
          statusTransitions {
            on
            status
          }
          results {
            winner {
              id
              name
            }
          }
        }
      }
    }
  `
);

const deleteElections = MutationFactory<deleteElections, deleteElectionsVariables>(
  gql`
    mutation deleteElections($ids: [ID!]!) {
      deleteElections(input: { ids: $ids })
    }
  `
);

async function newUserNewElection(input: {
  name: string;
  candidates: {
    name: string;
    description?: string;
  }[];
}): Promise<{
  election: any;
  client: ApolloClient<any>;
  cleanUp: () => Promise<void>;
}> {
  const username = 'election-tester';
  const { client, cleanUp } = await newUser(username);
  const { name, candidates } = input;
  const {
    data: {
      createElection: { election },
    },
  } = await createElection.call(client, { name, candidates });

  expect(election.name).toBe(name);
  expect(election.createdBy.username).toBe(username);
  //TODO: test the rest of election properties

  return {
    client,
    election,
    cleanUp: async () => {
      await deleteElections.call(client, { ids: [election.id] });
      const {
        data: {
          getElections: { elections },
        },
      } = await getElections.call(client, { ids: [election.id] });
      expect(elections.length).toBe(0);
      await cleanUp();
    },
  };
}

test('create election', async () => {
  const { cleanUp } = await newUserNewElection({
    name: 'create election test',
    candidates: [
      {
        name: 'Gorilla',
      },
      {
        name: 'Tiger',
      },
    ],
  });

  await cleanUp();
});
