import { createUser, getUsers, deleteUsers } from './db/user';
import { createElection, Election, getElections } from './db/election';
import * as express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import * as cors from 'cors';
import { ENV } from './env';
import { typeDefs, resolvers } from './schemaAndResolvers';
import { context } from './context';

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
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: ENV.RUN_PORT }, () => {
  console.log(`Apollo Server listening at localhost:${ENV.RUN_PORT}...`);
});
