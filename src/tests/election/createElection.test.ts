import * as uuid from 'uuid';
import { sdk } from '../graphql/sdk';
import { createUserAndLogin } from '../user/util';

const id = uuid.v4();
const name = `Test Election`;
const description = 'This is a test election.';
const candidates = [
  {
    id: uuid.v4(),
    name: 'A',
    description: 'A has long stood before the other candiates.',
  },
  {
    id: uuid.v4(),
    name: 'B',
    description: 'Typeically in second place, B is poised to win this election.',
  },
  {
    id: uuid.v4(),
    name: 'C',
    description: 'Always the underdog.',
  },
];

const input = { id, name, description, candidates };

describe('creating a user', () => {
  it('should throw an error if the user is not logged in when trying to create an election', async () => {
    await expect(
      sdk.upsertElection({
        input,
      })
    ).rejects.toThrow();
  });

  it('obeys client ids for creation', async () => {
    await createUserAndLogin();
    const response = await sdk.upsertElection({
      input,
    });

    expect(response.upsertElection.election.id).toEqual(id);
    expect(response.upsertElection.election.name).toEqual(name);
    expect(response.upsertElection.election.description).toEqual(description);
    expect(response.upsertElection.election.candidates).toEqual(candidates);
  });

  it('generates an id if one is not provided', async () => {
    await createUserAndLogin();
    const response = await sdk.upsertElection({
      input: { ...input, id: undefined },
    });

    expect(response.upsertElection.election.id.length).toEqual(36);
    expect(response.upsertElection.election.name).toEqual(name);
    expect(response.upsertElection.election.description).toEqual(description);
    expect(response.upsertElection.election.candidates).toEqual(candidates);
  });
});
