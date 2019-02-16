import { createClient } from './client';
import { createService } from './generated/serviceFactory';
import { create } from 'domain';

const uri = 'http://localhost:5000/graphql';

export const client = createClient({ uri });
export const service = createService(client);

export function createServiceWithAccessToken(token: string) {
  return createService(createClient({ uri, token }));
}
