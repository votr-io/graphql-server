import { Context } from '../context';
import { Election, ElectionStatus } from './types';
import { ForbiddenError } from 'apollo-server';
import * as tokens from '../tokens';
import { createElection } from './handlers/createElection';
import { getElections } from './handlers/getElections';
import { updateElection } from './handlers/updateElection';
import { deleteElections } from './handlers/deleteElections';
import * as db from '../db/election';
import { setStatus } from './handlers/setStatus';

export interface ElectionForm {
  name: string;
  description?: string;
  candidates: CandidateForm[];
}

export interface CandidateForm {
  id?: string;
  name: string;
  description?: string;
}

export interface ElectionService {
  getElections(ctx: Context, ids: string[]): Promise<Election[]>;
  createElection(
    ctx: Context,
    input: {
      electionForm: ElectionForm;
      email: string;
    }
  ): Promise<Election>;
  updateElection(
    ctx: Context,
    input: {
      id: string;
      name?: string;
      description?: string;
      candidates?: CandidateForm[];
    }
  ): Promise<Election>;
  deleteElections(ctx: Context, ids: string[]): Promise<void>;
  setStatus(
    ctx: Context,
    input: { id: string; status: ElectionStatus }
  ): Promise<Election>;
  //TODO: replace setStatus
  //   startElection(ctx: Context, id: string): Promise<Election>;
  //   stopElection(ctx: Context, id: string): Promise<Election>;
}

export const electionService: ElectionService = {
  getElections,
  createElection,
  updateElection,
  deleteElections,
  setStatus,
};

export async function getElectionAndCheckPermissionsToUpdate(
  token: string,
  electionId: string
): Promise<Election> {
  const claims = tokens.validate(token);
  const election = await db.getElection(electionId).then(db.withNotFound);

  if (election.created_by !== claims.userId) {
    throw new ForbiddenError('403');
  }
  if (tokens.isWeakClaims(claims) && claims.electionId !== election.id) {
    throw new ForbiddenError('403');
  }

  return election;
}
