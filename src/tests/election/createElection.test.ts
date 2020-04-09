import { sdk } from '../graphql/sdk';
import { createUserAndLogin } from '../user/util';
import { newElectionInput } from './util';

describe('creating an election', () => {
  it('should throw an error if the user is not logged in when trying to create an election', async () => {
    await expect(
      sdk.upsertElection({
        input: newElectionInput(),
      })
    ).rejects.toThrow();
  });

  it('obeys client ids for creation', async () => {
    await createUserAndLogin();

    const input = newElectionInput();
    const response = await sdk.upsertElection({
      input,
    });

    expect(response.upsertElection.election.id).toEqual(input.id);
    expect(response.upsertElection.election.name).toEqual(input.name);
    expect(response.upsertElection.election.description).toEqual(input.description);
    expect(response.upsertElection.election.candidates).toEqual(input.candidates);
  });

  it('generates an id if one is not provided', async () => {
    await createUserAndLogin();

    const input = newElectionInput();
    const response = await sdk.upsertElection({
      input: { ...input, id: undefined },
    });

    expect(response.upsertElection.election.id.length).toEqual(36);
    expect(response.upsertElection.election.name).toEqual(input.name);
    expect(response.upsertElection.election.description).toEqual(input.description);
    expect(response.upsertElection.election.candidates).toEqual(input.candidates);
  });
});
