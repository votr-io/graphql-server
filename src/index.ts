import * as express from 'express';
import * as cookieParser from 'cookie-parser';

import { logger } from './logger';
import { CONFIG } from './config';
import { server } from './GraphQL';
import { migrate } from './postgres';

/**
 * This is the main entry point for our server.
 *
 * It is responsible for the following:
 * - run database migrations (if any)
 * - wire up an express server with middleware
 * - bind our express server to a port and listen
 *
 * If you have any other special needs that need to happen at
 * start up (ie. making an API call to some other service) it
 * should happen here.
 *
 * I personally think that a more procedual style of writing code
 * is very appropriate for entry points of a service.  Having stuff
 * that happens when your service starts up being overly abstracted away
 * can be very confusing to people that are new to the codebase.  I think
 * that giving them a people a  simple starting point that they can
 * achor the rest of the code to is important.
 *
 *
 * NOTE: I'm using an immediately invoked async function here.
 * The only purpose of this is to that I can use "await" here for db migrations.
 * The day that top-level await is supported, this could go away.
 */

(async () => {
  logger.info('starting up!');

  await migrate();

  const app = express();
  app.use(cookieParser());
  server.applyMiddleware({ app, path: '/graphql' });

  app.listen({ port: CONFIG.PORT }, () => {
    logger.info(`gql-server listening at :${CONFIG.PORT}...`);
  });
})();
