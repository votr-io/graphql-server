import { CreateElectionMutation } from './generated/serviceFactory';
import { createElection } from './../db/election';
import { service as baseService, client, createServiceWithAccessToken } from './service';
import { CreateElection, CreateElectionVariables } from './generated/CreateElection';
import { FetchResult } from 'apollo-link';
import ApolloClient from 'apollo-client';
import { createClient } from './client';

async function makePublicElection(input: {
  name: string;
  description: string;
  email: string;
  candidates: {
    name: string;
    description?: string;
  }[];
}) {
  //create the election and run our tests
  const { name, description, email, candidates } = input;
  const res = await baseService.CreateElection({
    name,
    description,
    candidates,
    email,
  });
  const { election } = res.data.createElection;

  //info we sent in
  expect(election.name).toBe(name);
  expect(election.description).toBe(description);
  candidates.forEach(({ name }) =>
    expect(election.candidates.map(candidate => candidate.name)).toContain(name)
  );
  expect(election.createdBy.email).toBe(email);

  //stuff that the server automatically creates
  expect(election.status).toBe('PENDING');
  expect(election.statusTransitions[0].status).toBe('PENDING');
  expect(election.results).toBeNull();

  //perform a weak login with the adminToken we just got back
  const {
    data: {
      weakLogin: { accessToken },
    },
  } = await baseService.WeakLogin({ adminToken: election.adminToken });

  const service = createServiceWithAccessToken(accessToken);
  return {
    election,
    service,
    cleanUp: async () => {
      await service.DeleteElection({ id: election.id });
      const {
        data: {
          getElections: { elections },
        },
      } = await service.GetElections({ ids: [election.id] });
      expect(elections.length).toBe(0);
    },
  };
}

test('create election', async () => {
  const name = 'create election test';
  const description = 'this sure is an election';
  const candidates = [
    {
      name: 'Gorilla',
    },
    {
      name: 'Tiger',
    },
  ];
  const email = 'test@fake.com';

  const { cleanUp } = await makePublicElection({
    name,
    description,
    candidates,
    email,
  });
  await cleanUp();
});
