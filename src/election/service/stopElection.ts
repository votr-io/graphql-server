import { Election, Context } from '../types';
import * as store from '../store';
import * as tokens from '../../tokens';

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

  const updatedElection: Election = {
    ...election,
    dateUpdated: new Date(),
    status: 'CLOSED',
  };

  await store.upsertElection(ctx, updatedElection);

  return { election: updatedElection };
}
