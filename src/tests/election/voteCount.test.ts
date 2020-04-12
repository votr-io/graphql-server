import { sdk } from '../graphql/sdk';
import { createStartedElection } from './util';

describe('vote count', () => {
  it('increments vote count to 1 after the first ballot', async () => {
    const { id: electionId, candidates } = await createStartedElection();
    const candidateIds = candidates.map(({ id }) => id);
    await sdk.castBallot({
      input: {
        electionId,
        candidateIds,
      },
    });

    const { election } = await sdk.getElection({ id: electionId });
    expect(election.voteCount).toEqual(1);
  });

  it('as ballots are cast, the vote count goes up', async () => {
    const { id: electionId, candidates } = await createStartedElection();
    const candidateIds = candidates.map(({ id }) => id);
    await sdk.castBallot({
      input: {
        electionId,
        candidateIds,
      },
    });
    await sdk.castBallot({
      input: {
        electionId,
        candidateIds,
      },
    });
    await sdk.castBallot({
      input: {
        electionId,
        candidateIds,
      },
    });
    await sdk.castBallot({
      input: {
        electionId,
        candidateIds,
      },
    });

    const { election } = await sdk.getElection({ id: electionId });
    expect(election.voteCount).toEqual(4);
  });
});
