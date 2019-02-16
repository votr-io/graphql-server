import { CreateElectionMutation } from './generated/serviceFactory';
import { createElection } from './../db/election';
import { service, client } from './service';
import { CreateElection, CreateElectionVariables } from './generated/CreateElection';
import { FetchResult } from 'apollo-link';

// async function newUserNewElection(input: {
//   name: string;
//   candidates: {
//     name: string;
//     description?: string;
//   }[];
// }): Promise<{
//   election: any;
//   client: ApolloClient<any>;
//   cleanUp: () => Promise<void>;
// }> {
//   const username = 'election-tester';
//   const { client, cleanUp } = await newUser(username);
//   const { name, candidates } = input;
//   const {
//     data: {
//       createElection: { election },
//     },
//   } = await createElection.call(client, { name, candidates });

//   expect(election.name).toBe(name);
//   expect(election.createdBy.username).toBe(username);
//   //TODO: test the rest of election properties

//   return {
//     client,
//     election,
//     cleanUp: async () => {
//       await deleteElections.call(client, { ids: [election.id] });
//       const {
//         data: {
//           getElections: { elections },
//         },
//       } = await getElections.call(client, { ids: [election.id] });
//       expect(elections.length).toBe(0);
//       await cleanUp();
//     },
//   };
// }

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

  const res = await service.CreateElection({
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
});
