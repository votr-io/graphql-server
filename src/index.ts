import { createUser, getUsers, deleteUsers } from './db/user';
import {
  createElection,
  getElections,
  deleteCandidates,
  createCandidates,
  observeBallots,
  getElection,
} from './db/election';
import * as express from 'express';
import { ApolloServer } from 'apollo-server-express';
import * as cors from 'cors';
import { ENV } from './env';
import { typeDefs, resolvers } from './schemaAndResolvers';
import { context } from './context';
import { getResults } from 'alt-vote';
import { tallyElection } from './tallyElection';

// getResults({
//   fetchBallots: () => observeBallots('5380dac6-a88a-4116-9373-05f6fe93fba2'),
// }).then(console.log);

// getElection('5380dac6-a88a-4116-9373-05f6fe93fba2').then(election =>
//   console.log(JSON.stringify(election, null, 2))
// );

// const electionId = 'efe98d33-1515-4832-a514-c07a8928f8e5';
// const candidateIds = [
//   '7e9f753b-728d-4e14-b73b-07ecf74b4573',
//   '6ce7d68f-75ce-4720-8ad4-4647f8917e57',
//   '6ce7d68f-75ce-4720-8ad4-4647f8917e51',
//   '6ce7d68f-75ce-4720-8ad4-4647f8917e52',
//   '6ce7d68f-75ce-4720-8ad4-4647f8917e54',
// ];
// deleteCandidates({ electionId, candidateIds })
//   .then(() => getElections({ ids: [electionId] }))
//   .then(election => {
//     console.log(election[0]);
//     return createCandidates({
//       electionId,
//       candidates: candidateIds.map((id, i) => ({ id, name: `candidate${i}` })),
//     });
//   })
//   .then(console.log);

// const uuidv4 = require('uuid/v4');
// let userId = uuidv4();
// createUser({ user: { id: userId, email: `${userId}@fake.com` } }).then(() => {
//   getUsers({ ids: [userId] }).then(console.log);
// });

// userId = uuidv4();
// const electionId = uuidv4();
// createUser({ user: { id: userId, email: `${userId}@fake.com` } })
//   .then(() => {
//     const now = new Date().toISOString();
//     const election: Election = {
//       id: electionId,
//       name: 'sure is an election',
//       description: 'asfda',
//       created_by: userId,
//       date_updated: now,
//       candidates: [{ id: uuidv4(), name: 'test', description: 'asdfas' }],
//       status: 'PENDING',
//       status_transitions: [
//         {
//           on: now,
//           status: 'PENDING',
//         },
//       ],
//     };
//     return createElection({ election });
//   })
//   .then(() => {
//     getElections({ ids: [electionId] }).then(([election]) => {
//       console.log(election);
//     });
//   });

// getUsers({ ids: ['b7f90237-d4e7-4338-a245-d3ad8be88649'] }).then(users => {
//   deleteUsers({ ids: users.map(({ id }) => id) });
// });

const app = express();
app.use(cors());

app.use('/healthy', (req, res) => {
  res.send({ healthy: true });
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  introspection: true,
  playground: true,
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: ENV.PORT }, () => {
  console.log(`Apollo Server listening at :${ENV.PORT}...`);
});
