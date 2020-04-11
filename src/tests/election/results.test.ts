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

  it('a closed election with cast ballots should have results', async () => {
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

  it.only('multiple rounds', async () => {
    const { id, candidates } = await createStartedElection();
    const candidateIds = candidates.map(({ id }) => id);
    const A = candidateIds[0];
    const B = candidateIds[1];
    const C = candidateIds[2];

    await sdk.castBallot({
      input: {
        electionId: id,
        candidateIds: [A, C],
      },
    });

    await sdk.castBallot({
      input: {
        electionId: id,
        candidateIds: [A, C],
      },
    });

    await sdk.castBallot({
      input: {
        electionId: id,
        candidateIds: [B, C],
      },
    });

    await sdk.castBallot({
      input: {
        electionId: id,
        candidateIds: [C],
      },
    });
    await sdk.castBallot({
      input: {
        electionId: id,
        candidateIds: [C],
      },
    });

    await sdk.stopElection({ input: { electionId: id } });

    const response = await sdk.getElection({ id });
    expect(response.election.results).not.toBeNull();

    expect(response.election.results.winner.id).toEqual(C);
    expect(response.election.results.rounds.length).toEqual(2);
  });
});
