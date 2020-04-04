import { Request, Response } from 'express';
import { getToken, login, logout } from './cookies';

export type Context = ReturnType<typeof context>;

/**
 * This function is called every time a new request hits our server.
 * It can be thought of as the "handoff" point between HTTP and GraphQL
 *
 * The responsibilities here include the following:
 * - pull any authentication information (ie. cookies / headers) off the HTTP request
 * - attach login/logout functions to the context to be used in resolvers
 * - attach data loader functions to the context to be used in resolvers
 */
export function context({ req, res }: { req: Request; res: Response }) {
  // const token = getToken(req);

  //base context that we'll be passing to dataloader factory functions
  //aka - the overlap GraphqlContext has with the Service Context
  // const ctx = { token };

  return {
    // ...ctx,
    // login: (token: string) => login(res, token),
    // logout: () => logout(res),
  };
}
