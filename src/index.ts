import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import cors from 'cors';
import { ENV } from './env';
import { typeDefs, resolvers } from './schemaAndResolvers';
import { context } from './context';

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
