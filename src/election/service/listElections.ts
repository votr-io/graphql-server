import { CoreFunction } from '../../lib/Core';
import { Context } from '../../context';
import { Election } from '../types';

interface Input {
  where?: ElectionFilters;
}
interface ElectionFilters {
  ids?: string[];
}

interface Output {
  elections: Election[];
}

export const listElections: CoreFunction<Context, Input, Output> = async (ctx, input) => {
  throw new Error('not implemented');
};
