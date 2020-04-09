import { sdk } from '../graphql/sdk';
import { createUserAndLogin } from '../user/util';
import { newElectionInput } from './util';

describe('getting an election', () => {
  it('returns nothing if the id passed in does not match an existing election', async () => {
    const { election } = await sdk.getElection({ id: 'asdf' });
    expect(election).toBeNull();
  });

  it('can get election after it is created', async () => {
    await createUserAndLogin();

    const input = newElectionInput();
    const upsertElectionResponse = await sdk.upsertElection({
      input,
    });

    const id = upsertElectionResponse.upsertElection.election.id;

    const electionResponse = await sdk.getElection({ id });

    expect(upsertElectionResponse.upsertElection.election).toEqual(
      electionResponse.election
    );
  });

  it('does not require the user to be logged in to get an election, but the email address of the user who created the election will be hidden', async () => {
    await createUserAndLogin();

    const input = newElectionInput();
    const upsertElectionResponse = await sdk.upsertElection({
      input,
    });

    const id = upsertElectionResponse.upsertElection.election.id;

    await sdk.logout();
    const { election } = await sdk.getElection({ id });

    expect(election.createdBy.email).toBeNull();
    expect(election.name).toEqual(upsertElectionResponse.upsertElection.election.name);
    expect(election.description).toEqual(
      upsertElectionResponse.upsertElection.election.description
    );
    expect(election.candidates).toEqual(
      upsertElectionResponse.upsertElection.election.candidates
    );
  });
});
