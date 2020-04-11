import { sdk } from '../graphql/sdk';
import { createUserAndLogin } from '../user/util';
import { createElection } from './util';
import { ElectionStatus } from '../graphql/generated/sdk';

describe('stopping an election', () => {
  it('should throw an error if not in the open status', async () => {
    await createUserAndLogin();
    const { id: electionId } = await createElection();
    await expect(
      sdk.stopElection({
        input: {
          electionId,
        },
      })
    ).rejects.toThrow('SETUP');
  });

  it('should throw an error if trying stop an election that was created by another user', async () => {
    await createUserAndLogin();
    const { id: electionId } = await createElection();
    await sdk.startElection({ input: { electionId } });
    await sdk.logout();

    await createUserAndLogin();
    expect(
      sdk.stopElection({
        input: {
          electionId,
        },
      })
    ).rejects.toThrow('not authorized');
  });

  it('should change the status from open', async () => {
    await createUserAndLogin();
    const { id: electionId } = await createElection();
    await sdk.startElection({ input: { electionId } });
    const response = await sdk.stopElection({ input: { electionId } });

    const election = response.stopElection.election;
    expect(election.status).toEqual(ElectionStatus.Closed);
  });

  it('stopping an election should be idempotent', async () => {
    await createUserAndLogin();
    const { id: electionId } = await createElection();
    await sdk.startElection({ input: { electionId } });
    await sdk.stopElection({ input: { electionId } });
    const response = await sdk.stopElection({ input: { electionId } });

    const election = response.stopElection.election;
    expect(election.status).toEqual(ElectionStatus.Closed);
  });
});
