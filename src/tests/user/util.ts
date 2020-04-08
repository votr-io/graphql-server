import * as uuid from 'uuid';
import { sdk } from '../graphql/sdk';

export async function createUserAndLogin({
  id = uuid.v4(),
  email = `${uuid.v4()}@test.com`,
  password = 'boggle',
}: { id?: string; email?: string; password?: string } = {}) {
  const response = await sdk.upsertUser({ input: { id, email, password } });
  return response.upsertUser.user;
}
