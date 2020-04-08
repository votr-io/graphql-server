import * as uuid from 'uuid';
import { sdk } from '../graphql/sdk';

describe('authentication', () => {
  it('returns nothing for self if the user is not logged in', async () => {
    const { self } = await sdk.self();
    expect(self).toBeNull();
  });

  it('upserting a user causes the user to be logged in', async () => {
    const input = {
      id: uuid.v4(),
      email: `${uuid.v4()}@test.com`,
      password: 'boggle',
    };

    await sdk.upsertUser({ input });

    const { self } = await sdk.self();

    expect(self).not.toBeNull();
    expect(self.id).toEqual(input.id);
    expect(self.email).toEqual(input.email);

    await sdk.logout();

    const { self: selfAfterLogout } = await sdk.self();
    expect(selfAfterLogout).toBeNull();
  });

  it('fails if you try to login with a bad password', async () => {
    const id = uuid.v4();
    const email = `${uuid.v4()}@test.com`;
    const password = 'boggle';

    await sdk.upsertUser({ input: { id, email, password } });
    await sdk.logout();

    await expect(
      sdk.login({ email, password: 'not the correct password' })
    ).rejects.toThrow();
  });

  it('can login and logout', async () => {
    const id = uuid.v4();
    const email = `${uuid.v4()}@test.com`;
    const password = 'boggle';

    //we need to create a new user that is isolated to this test
    await sdk.upsertUser({ input: { id, email, password } });
    //we're testing loging in here, so we need to logout after creating the user
    await sdk.logout();

    //confirm that we are not logged in
    const { self } = await sdk.self();
    expect(self).toBeNull();

    //ok, now with all that setup out of the way, lets try logging in
    const loginResponse = await sdk.login({ email, password });
    const user = loginResponse.login.user;
    expect(user).not.toBeNull();
    expect(user.id).toEqual(id);
    expect(user.email).toEqual(email);

    //calling self should also return the same user
    const { self: selfAfterLogin } = await sdk.self();
    expect(selfAfterLogin).not.toBeNull();
    expect(selfAfterLogin.id).toEqual(id);
    expect(selfAfterLogin.email).toEqual(email);
  });
});
