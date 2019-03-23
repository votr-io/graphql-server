import * as db from '../../db/election';
import { Context } from '../../context';
import { Election } from '../types';
import lodash = require('lodash');
import { UserInputError } from 'apollo-server';
import { getUsersByEmail, createUser } from '../../db/user';
import { ElectionForm } from '../ElectionService';

const uuid = require('uuid/v4');

export async function createElection(
  ctx: Context,
  input: {
    electionForm: ElectionForm;
    email: string;
  }
): Promise<Election> {
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

  let election = await db.createElection({
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
}
