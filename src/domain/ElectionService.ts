import {
  updateElection,
  getElections,
  createElection,
  deleteElections,
  getElection,
  withNotFound,
} from './../db/election';
import { Context } from '../context';
import { Election, ElectionStatus } from './types';
import lodash = require('lodash');
import { UserInputError, ForbiddenError } from 'apollo-server';
import { getUsersByEmail, createUser } from '../db/user';
import * as tokens from '../tokens';
import { tallyElection } from '../tallyElection';
const uuid = require('uuid/v4');

interface ElectionForm {
  name: string;
  description?: string;
  candidates: CandidateForm[];
}

interface CandidateForm {
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
    input: Pick<Election, 'id' | 'name' | 'description' | 'candidates'>
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
  getElections: async (ctx, ids) => {
    return getElections({ ids });
  },
  createElection: async (ctx, input) => {
    const { name, description, candidates } = input.electionForm;
    const { email } = input;

    //TODO: move this validation somewhere better
    const errors: string[] = [];
    if (name === '') {
      errors.push('name is required');
    }
    if (email == null || email === '') {
      errors.push('email is required if you do not have an account');
    }
    if (candidates.length < 2) {
      errors.push('at least two candidates are required');
    }
    if (candidates.filter(({ name }) => name === '').length !== 0) {
      errors.push('candidate.name is required');
    }
    if (
      lodash(candidates)
        .filter(({ id }) => id != null)
        .uniqBy(({ id }) => id.toLowerCase())
        .value().length !=
      lodash(candidates)
        .filter(({ id }) => id != null)
        .value().length
    ) {
      errors.push('candidates cannot have duplicate ods');
    }
    if (
      lodash.uniqBy(candidates, ({ name }) => name.toLowerCase()).length !=
      candidates.length
    ) {
      errors.push('candidates cannot have duplicate names');
    }
    if (errors.length > 0) {
      throw new UserInputError(`createElection error: ${errors.join(', ')}`);
    }

    const now = new Date().toISOString();

    //TODO: go through users service
    let [user] = await getUsersByEmail({ emails: [email] });
    if (!user) {
      user = await createUser({
        user: { id: uuid(), email, date_created: now, type: 'WEAK' },
      });
    }

    let election = await createElection({
      election: {
        id: uuid(),
        name,
        description,
        created_by: user.id,
        date_created: now,
        date_updated: now,
        candidates: candidates.map(({ id, name, description }) => ({
          id: id ? id : uuid(),
          name,
          description: description ? description : '',
        })),
        status: 'PENDING',
        status_transitions: [
          {
            on: now,
            status: 'PENDING',
          },
        ],
      },
    });

    return election;
  },
  updateElection: async (ctx, input) => {
    const { id, name, description, candidates } = input;
    const election = await getElectionAndCheckPermissionsToUpdate(ctx.token, id);

    if (election.status != 'PENDING') {
      throw new UserInputError('cannot change an election after it has begun');
    }

    const now = new Date().toISOString();

    const updatedElection = await updateElection({
      election: {
        ...election,
        date_updated: now,
        name: name ? name : election.name,
        description: description ? description : election.description,
        candidates: candidates
          ? candidates.map(({ id, name, description }) => ({
              id: id ? id : uuid(),
              name,
              description: description ? description : '',
            }))
          : election.candidates,
      },
    });

    return updatedElection;
  },
  deleteElections: async (ctx, ids) => {
    const claims = tokens.validate(ctx.token);

    const elections = await getElections({ ids });
    const electionsAuthorizedForDeletion = elections
      .filter(({ created_by }) => created_by === claims.userId)
      .filter(
        ({ id }) => (tokens.isWeakClaims(claims) ? id === claims.electionId : true) //if the claims are weak, there's only one election they can delete
      )
      .map(({ id }) => id);

    if (electionsAuthorizedForDeletion.length == 0) {
      return;
    }

    await deleteElections({ ids: electionsAuthorizedForDeletion });
  },
  setStatus: async (ctx, input) => {
    const { id, status } = input;

    const election = await getElectionAndCheckPermissionsToUpdate(ctx.token, id);

    if (election.status === status) {
      return election;
    }

    //TODO: clean up this validation and make it data driven with good error messaging
    if (election.status === 'PENDING' && status !== 'OPEN') {
      throw new UserInputError('invalid status transition');
    }
    if (election.status === 'OPEN' && status !== 'TALLYING') {
      throw new UserInputError('invalid status transition');
    }

    const now = new Date().toISOString();
    const updatedElection = await updateElection({
      election: {
        ...election,
        status,
        date_updated: now,
        status_transitions: [...election.status_transitions, { status, on: now }],
      },
    });

    //TODO: move this someplace else and handle tallying failure
    if (updatedElection.status === 'TALLYING') {
      await tallyElection(election.id);
    }

    return updatedElection;
  },
};

async function getElectionAndCheckPermissionsToUpdate(
  token: string,
  electionId: string
): Promise<Election> {
  const claims = tokens.validate(token);
  const election = await getElection(electionId).then(withNotFound);

  if (election.created_by !== claims.userId) {
    throw new ForbiddenError('403');
  }
  if (tokens.isWeakClaims(claims) && claims.electionId !== election.id) {
    throw new ForbiddenError('403');
  }

  return election;
}
