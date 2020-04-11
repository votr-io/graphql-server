import { sdk } from '../graphql/sdk';
import { createUserAndLogin } from '../user/util';
import { createElection, createStartedElection } from './util';

describe('casting ballots', () => {
  it('errors if you try to cast a ballot in an election that does not exist', async () => {
    const electionId = 'there is no way this is the id of an election';
    await expect(
      sdk.castBallot({
        input: {
          electionId,
          candidateIds: ['123'],
        },
      })
    ).rejects.toThrow(electionId);
  });

  it('errors if any of the candidate ids do not exist in the election', async () => {
    const { id: electionId, candidates } = await createStartedElection();
    await expect(
      sdk.castBallot({
        input: {
          electionId,
          candidateIds: ['123'],
        },
      })
    ).rejects.toThrow('123');
  });

  it('errors if there are any duplicate candidate ids', async () => {
    const { id: electionId, candidates } = await createStartedElection();
    const candidateId = candidates[0].id;
    await expect(
      sdk.castBallot({
        input: {
          electionId,
          candidateIds: [candidateId, candidateId],
        },
      })
    ).rejects.toThrow(candidateId);
  });

  it('throws an error if you try to cast a ballot for an election that is in setup status', async () => {
    await createUserAndLogin();
    const { id: electionId, candidates } = await createElection();
    const candidateIds = candidates.map(({ id }) => id);

    await expect(
      sdk.castBallot({
        input: {
          electionId,
          candidateIds,
        },
      })
    ).rejects.toThrow('cannot vote in an election');
  });

  it('throws an error if you try to cast a ballot for an election that is closed', async () => {
    const { id: electionId, candidates } = await createStartedElection();
    await sdk.stopElection({ input: { electionId } });
    const candidateIds = candidates.map(({ id }) => id);

    await expect(
      sdk.castBallot({
        input: {
          electionId,
          candidateIds,
        },
      })
    ).rejects.toThrow('cannot vote in an election');
  });

  it('throws an error if a ballot is cast with no candidateIds', async () => {
    const { id: electionId } = await createStartedElection();
    await expect(
      sdk.castBallot({
        input: {
          electionId,
          candidateIds: [],
        },
      })
    ).rejects.toThrow('candidateIds');
  });

  it('allows casting of ballots if not logged in', async () => {
    const { id: electionId, candidates } = await createStartedElection();
    await sdk.logout();
    const candidateIds = candidates.map(({ id }) => id);

    await sdk.castBallot({
      input: {
        electionId,
        candidateIds,
      },
    });
  });
});
