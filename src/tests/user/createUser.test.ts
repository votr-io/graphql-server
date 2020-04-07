import * as uuid from 'uuid';
import { sdk } from '../graphql/sdk';
describe('creating a user', () => {
  it('obeys client ids for creation', async () => {
    const id = uuid.v4();
    const email = 'test@fake.com';
    const password = 'boggle';
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
    const email = 'test@fake.com';
    const password = 'boggle';
    const response = await sdk.upsertUser({
      input: {
        email,
        password,
      },
    });

    expect(response.upsertUser.user.id.length).toEqual(36);
    expect(response.upsertUser.user.email).toEqual(email);
  });

  it('throws an error if email is not provided', async () => {
    const password = 'boggle';

    await expect(
      sdk.upsertUser({
        input: {
          password,
        },
      })
    ).rejects.toThrow(`required`);
  });

  it('throws an error if email is not valid', async () => {
    const email = 'asdf';
    const password = 'boggle';

    await expect(
      sdk.upsertUser({
        input: {
          email,
          password,
        },
      })
    ).rejects.toThrow(`invalid`);
  });
});
