import { Election, Context, Results } from '../types';
import * as store from '../store';
import * as tokens from '../../tokens';
import * as altVote from '../../lib/alt-vote';
import { getBallotStream } from '../store/getBallotStream';

interface Input {
  id: string;
}

interface Output {
  election: Election;
}

export async function stopElection(ctx: Context, input: Input): Promise<Output> {
  const { id } = input;
  const claims = tokens.validateUserAccessToken(ctx.token);

  const election = await store.getElection(ctx, id);

  if (!election) {
    throw new Error(`could not find election with id ${id}`);
  }

  if (election.createdBy !== claims.id) {
    throw new Error('not authorized');
  }

  if (election.status === 'CLOSED' || election.status === 'TALLYING') {
    return { election };
  }

  if (election.status !== 'OPEN') {
    throw new Error(`cannot start an election that has status ${election.status}`);
  }

  await store.upsertElection(ctx, {
    ...election,
    dateUpdated: new Date(),
    status: 'TALLYING',
  });

  /**
   * Now that the election has been closed (so no more votes can come in)
   * we can calculate the results of this election.  Doing this here for now
   * is probably fine, but if load testing proves that this is too slow,
   * calculating results should be moved to a background task.
   */
  const results = await getResults(ctx, election.id);

  const updatedElection: Election = {
    ...election,
    dateUpdated: new Date(),
    status: 'CLOSED',
    results,
  };

  await store.upsertElection(ctx, updatedElection);

  return { election: updatedElection };
}

async function getResults(ctx: Context, electionId: string): Promise<Results> {
  const results = await altVote.getResults({
    getBallotStream: () => getBallotStream(ctx, electionId),
  });

  return {
    winner: results.winner,
    rounds: results.rounds.map((round) => ({
      candidateTotals: Object.keys(round).map((candidateId) => ({
        candidateId,
        votes: round[candidateId],
      })),
    })),
  };
}
