import { createClient } from './client';
import { createService } from './generated/serviceFactory';

const uri = 'http://localhost:5000/graphql';
export const client = createClient({ uri });

export const service = createService(client);
