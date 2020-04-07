import * as uuid from 'uuid';
import { newSdk } from '../graphql/sdk';

describe('authentication', () => {
  it('returns nothing for self if the user is not logged in', async () => {
    const sdk = newSdk();
    const { self } = await sdk.self();
    expect(self).toBeNull();
  });

  it('upserting a user causes the user to be logged in', async () => {
    const sdk = newSdk();

    const input = {
      id: uuid.v4(),
      email: `${uuid.v4()}@test.com`,
      password: 'boggle',
    };

    await sdk.upsertUser({ input });

    const { self } = await sdk.self();
    expect(self).not.toBeNull();
  });
});
