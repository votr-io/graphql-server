import { Resolvers, ElectionStatus } from './generated/resolvers';
import { Context } from './context';
import * as userService from '../user/service';
import * as electionService from '../election/service';

export const resolvers: Resolvers<Context> = {
  Query: {
    self: async (_, args, ctx) => {
      const { user } = await userService.self(ctx, {});
      return user;
    },
    election: async (_, args, ctx) => {
      const { election } = await electionService.getElection(ctx, args);
      return election;
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
      const { election } = await electionService.upsertElection(ctx, args.input);
      return { election };
    },
  },
  Election: {
    createdBy: ({ createdBy }, _, ctx) => ctx.userDataLoader.load(createdBy),
    status: ({ status }) => {
      const mapping = {
        SETUP: ElectionStatus.Setup,
        OPEN: ElectionStatus.Open,
        TALLYING: ElectionStatus.Tallying,
        CLOSED: ElectionStatus.Closed,
      };
      return mapping[status];
    },
  },
};
