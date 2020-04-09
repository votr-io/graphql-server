import { User as StoreUser } from '../store/types';
import { Context, User } from './types';
import * as store from '../store';
import * as tokens from '../../tokens';

interface Input {}

interface Output {
  user?: User;
}

export async function self(ctx: Context, input: Input): Promise<Output> {
  const { token } = ctx;

  if (!token) {
    return { user: null };
  }

  let id: string = null;
  try {
    id = tokens.validateUserAccessToken(token).id;
  } catch (e) {
    //if the token is bad, return null to indicate that this user is not logged in
    //this feels correct, but in the future it may make sense to throw an error
    return { user: null };
  }

  const user = await store.getUserById(ctx, id);
  return { user };
}
