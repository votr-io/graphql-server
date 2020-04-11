import { sdk } from '../graphql/sdk';
import { createUserAndLogin } from './util';

describe('change password', () => {
  it('throws an error if you try to change the password without being logged in', async () => {
    const { id } = await createUserAndLogin();
    await sdk.logout();

    await expect(
      sdk.upsertUser({
        input: {
          id,
          password: 'some new password',
        },
      })
    ).rejects.toThrow();
  });

  it('throws an error if you try to change the password of a different user', async () => {
    const { id } = await createUserAndLogin();
    await sdk.logout();

    await createUserAndLogin();

    await expect(
      sdk.upsertUser({
        input: {
          id,
          password: 'some new password',
        },
      })
    ).rejects.toThrow('not authorized');
  });

  it('allows a user to change their password', async () => {
    const firstPassword = 'first password';
    const secondPassword = 'second password';

    const { id, email } = await createUserAndLogin({ password: firstPassword });
    await sdk.logout();

    //login to prove that our first password is working
    await sdk.login({ input: { email, password: firstPassword } });
    //change the password
    await sdk.upsertUser({
      input: {
        id,
        password: secondPassword,
      },
    });
    await sdk.logout();

    //try to login with the first password (should fail)
    await expect(
      sdk.login({ input: { email, password: firstPassword } })
    ).rejects.toThrow();

    //try to login with the first password (should work)
    const loginResponse = await sdk.login({ input: { email, password: secondPassword } });
    expect(loginResponse.login.user.id).toEqual(id);
  });
});
