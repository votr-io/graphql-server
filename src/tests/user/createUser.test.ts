import * as uuid from 'uuid';
import { sdk } from '../graphql/sdk';
describe('creating a user', () => {
  const id = uuid.v4();
  const email = 'test@fake.com';
  const password = 'boggle';

  it('obeys client ids for creation', async () => {
    const response = await sdk.upsertUser({
      input: {
        id,
        email,
        password,
      },
    });

    expect(response.upsertUser.user.id).toEqual(id);
    expect(response.upsertUser.user.email).toEqual(email);
  });

  it('generates an id if one is not provided', async () => {
    const response = await sdk.upsertUser({
      input: {
        email,
        password,
      },
    });

    expect(response.upsertUser.user.id.length).toEqual(36);
    expect(response.upsertUser.user.email).toEqual(email);
  });
});
