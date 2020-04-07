import * as uuid from 'uuid';
import { sdk } from '../graphql/sdk';
describe('updating a user', () => {
  it('can upate the email address of a user', async () => {
    const input = {
      id: uuid.v4(),
      email: `${uuid.v4()}@test.com`,
      password: 'boggle',
    };

    //create
    const response1 = await sdk.upsertUser({
      input,
    });

    expect(response1.upsertUser.user.id).toEqual(input.id);
    expect(response1.upsertUser.user.email).toEqual(input.email);

    //update
    input.email = `${uuid.v4()}@test.com`;
    const response2 = await sdk.upsertUser({
      input,
    });

    expect(response2.upsertUser.user.id).toEqual(input.id);
    expect(response2.upsertUser.user.email).toEqual(input.email);
  });
});
