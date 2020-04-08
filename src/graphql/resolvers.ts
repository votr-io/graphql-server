import { Resolvers, ElectionStatus, Election } from './generated/resolvers';
import { Context } from './context';
import * as userService from '../user/service';
import { service as electionService } from '../election/service';
import * as types from '../election/types';

export const resolvers: Resolvers<Context> = {
  Query: {
    self: async (_, args, ctx) => {
      const { user } = await userService.self(ctx, {});
      return user;
    },
    election: async (_, args, ctx) => {
      throw new Error('not implemented yet');
    },
  },
  Mutation: {
    login: async (_, args, ctx) => {
      const { user, token } = await userService.login(ctx, args);
      ctx.login(token);
      return { user };
    },
    logout: (_, __, ctx) => {
      ctx.logout();
      return true;
    },
    upsertUser: async (_, args, ctx) => {
      const { user, token } = await userService.upsertUser(ctx, args.input);
      ctx.login(token);
      return { user };
    },
    upsertElection: async (_, args, ctx) => {
      throw new Error('not implemented yet');
    },
  },
};

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

// function toGqlElection(election?: types.Election): Election {
//   if (!election) {
//     return null;
//   }

//   return {
//     ...election,
//     dateCreated: election.dateCreated.toISOString(),
//     dateUpdated: election.dateUpdated.toISOString(),
//     status: toGqlStatus(election.status),
//     results: null, //TODO
//   };
// }
