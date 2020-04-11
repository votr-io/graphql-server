import { sdk } from '../graphql/sdk';
import { createStartedElection } from './util';

describe('results', () => {
  it('results should be null until an election is closed', async () => {
    const { id } = await createStartedElection();

    const response = await sdk.getElection({ id });
    expect(response.election.results).toBeNull();
  });

  it('a closed election with no ballots cast should not have results', async () => {
    const { id } = await createStartedElection();
    await sdk.stopElection({ input: { electionId: id } });

    const response = await sdk.getElection({ id });
    expect(response.election.results).toBeNull();
  });

  it.skip('a closed election with cast ballots should have results', async () => {
    const { id, candidates } = await createStartedElection();
    const candidateIds = candidates.map(({ id }) => id);

    await sdk.castBallot({
      input: {
        electionId: id,
        candidateIds,
      },
    });

    await sdk.stopElection({ input: { electionId: id } });

    const response = await sdk.getElection({ id });
    expect(response.election.results).not.toBeNull();
  });
});
