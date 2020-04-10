import { sdk } from '../graphql/sdk';
import { createUserAndLogin } from '../user/util';
import { createElection } from './util';
import { ElectionStatus } from '../graphql/generated/sdk';

describe('starting an election', () => {
  it('should throw an error if trying start an election that was created by another user', async () => {
    await createUserAndLogin();
    const { id: electionId } = await createElection();
    await sdk.logout();

    await createUserAndLogin();
    expect(
      sdk.startElection({
        input: {
          electionId,
        },
      })
    ).rejects.toThrow('not authorized');
  });

  it('should change the status to open', async () => {
    await createUserAndLogin();
    const { id: electionId, status } = await createElection();
    expect(status).toEqual(ElectionStatus.Setup);

    const response = await sdk.startElection({
      input: {
        electionId,
      },
    });

    const election = response.startElection.election;
    expect(election.status).toEqual(ElectionStatus.Open);
  });

  it('starting an election should be idempotent', async () => {
    await createUserAndLogin();
    const { id: electionId } = await createElection();

    await sdk.startElection({
      input: {
        electionId,
      },
    });

    await expect(
      sdk.startElection({
        input: {
          electionId,
        },
      })
    ).resolves.not.toThrow();
  });
});
