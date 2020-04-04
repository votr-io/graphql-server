import { Resolvers } from './generated/resolvers';
import { Context } from './context';

export const resolvers: Resolvers<Context> = {
  Query: {},
  Mutation: {},
};

//helper to take our domain types that have cursors on them and convert them to GQL "edges"
function toEdges<T extends { cursor?: string }>(tt: T[]): { node: T; cursor?: string }[] {
  return tt.map(t => ({
    node: t,
    cursor: t.cursor,
  }));
}
