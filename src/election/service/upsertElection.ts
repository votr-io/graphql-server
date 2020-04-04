import { CoreFunction } from '../../lib/Core';
import { Context } from '../../context';
import { Election } from '../types';

interface Input {
  id: string;
  name: string;
  description: string;
  createdByEmail?: string;
  candidates: CandidateInput[];
}
interface CandidateInput {
  id: string;
  name: string;
  description: string;
}

interface Output {
  election: Election;
}

export const upsertElection: CoreFunction<Context, Input, Output> = async (
  ctx,
  input
) => {
  throw new Error('not implemented');
};
