import * as uuid from 'uuid';
import { sdk } from '../graphql/sdk';
describe('creating a user', () => {
  it('obeys client ids for creation', async () => {
    const id = uuid.v4();
    const email = `${uuid.v4()}@test.com`;
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
    const email = `${uuid.v4()}@test.com`;
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

  it('throws an error if id is not a uuid', async () => {
    const id = 'asdf';
    const email = `${uuid.v4()}@test.com`;
    const password = 'boggle';

    await expect(
      sdk.upsertUser({
        input: {
          id,
          email,
          password,
        },
      })
    ).rejects.toThrow(id);
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
    ).rejects.toThrow(email);
  });

  it('throws an error if an email is reused', async () => {
    const input = {
      email: `${uuid.v4()}@test.com`,
      password: 'boggle',
    };

    //create the user
    await sdk.upsertUser({ input });

    //now try to create another user with the same email
    await expect(
      sdk.upsertUser({
        input,
      })
    ).rejects.toThrow(input.email);
  });
});
