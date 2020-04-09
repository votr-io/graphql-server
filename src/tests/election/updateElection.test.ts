import { sdk } from '../graphql/sdk';
import { createUserAndLogin } from '../user/util';
import { newElectionInput } from './util';

describe('updating an election', () => {
  it('should throw an error if trying to update an election that was created by another user', async () => {
    await createUserAndLogin();

    const input = newElectionInput();
    await sdk.upsertElection({
      input,
    });

    //create and login as a different user
    await createUserAndLogin();
    await expect(
      sdk.upsertElection({
        input: {
          //using the same input (incuding id) from election created by a different user
          ...input,
          name: 'some new name',
        },
      })
    ).rejects.toThrow();
  });

  it('should allow the name of the election to be updated', async () => {
    await createUserAndLogin();
    const input = newElectionInput();
    await sdk.upsertElection({
      input,
    });

    const newName = 'some new name';
    const response = await sdk.upsertElection({
      input: {
        ...input,
        name: newName,
      },
    });

    const updatedElection = response.upsertElection.election;
    expect(updatedElection.id).toEqual(input.id);
    expect(updatedElection.name).toEqual(newName);
    expect(updatedElection.description).toEqual(input.description);
  });

  it('should allow the description of the election to be updated', async () => {
    await createUserAndLogin();
    const input = newElectionInput();
    await sdk.upsertElection({
      input,
    });

    const newDescription = 'some new description';
    const response = await sdk.upsertElection({
      input: {
        ...input,
        description: newDescription,
      },
    });

    const updatedElection = response.upsertElection.election;
    expect(updatedElection.id).toEqual(input.id);
    expect(updatedElection.name).toEqual(input.name);
    expect(updatedElection.description).toEqual(newDescription);
  });

  it('should allow the candidates of the election to be updated', async () => {
    await createUserAndLogin();
    const input = newElectionInput();
    await sdk.upsertElection({
      input,
    });

    const newCandidates = [];
    const response = await sdk.upsertElection({
      input: {
        ...input,
        candidates: [],
      },
    });

    const updatedElection = response.upsertElection.election;
    expect(updatedElection.id).toEqual(input.id);
    expect(updatedElection.name).toEqual(input.name);
    expect(updatedElection.description).toEqual(input.description);
    expect(updatedElection.candidates).toEqual(newCandidates);
  });
});
