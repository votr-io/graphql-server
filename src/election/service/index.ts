import { upsertElection } from './upsertElection';
import { listElections } from './listElections';

const core = {
  upsertElection,
  listElections,
};

export const service = core;
