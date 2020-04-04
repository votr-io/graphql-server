import { Resolvers, ElectionStatus, Election } from './generated/resolvers';
import { Context } from './context';
import { service as electionService } from '../election/service';
import * as types from '../election/types';

export const resolvers: Resolvers<Context> = {
  Query: {
    election: async (_, args, ctx) => {
      const { elections } = await electionService.listElections(ctx, {
        where: {
          ids: [args.id],
        },
      });

      return toGqlElection(elections[0]);
    },
  },
  Mutation: {
    upsertElection: async (_, args, ctx) => {
      const { election } = await electionService.upsertElection(ctx, args.input);
      return {
        election: toGqlElection(election),
        electionAccessToken: '',
      };
    },
  },
};

//helper to take our domain types that have cursors on them and convert them to GQL "edges"
function toEdges<T extends { cursor?: string }>(tt: T[]): { node: T; cursor?: string }[] {
  return tt.map(t => ({
    node: t,
    cursor: t.cursor,
  }));
}

function toGqlStatus(status: types.Status): ElectionStatus {
  const mapping = {
    [types.Status.SETUP]: ElectionStatus.Setup,
    [types.Status.OPEN]: ElectionStatus.Open,
    [types.Status.TALLYING]: ElectionStatus.Tallying,
    [types.Status.CLOSED]: ElectionStatus.Closed,
  };

  const ret = mapping[status];
  if (!ret) {
    throw new Error(`${status} does not have a mapping set`);
  }

  return ret;
}

function toGqlElection(election?: types.Election): Election {
  if (!election) {
    return null;
  }

  return {
    ...election,
    dateCreated: election.dateCreated.toISOString(),
    dateUpdated: election.dateUpdated.toISOString(),
    status: toGqlStatus(election.status),
    results: null, //TODO
  };
}
