import * as uuid from 'uuid';
import * as isValidUuid from 'uuid-validate';
import { Election, Context } from '../types';
import * as tokens from '../../tokens';
import * as store from '../store';
import { RecursiveRequired } from '../../util';

interface Input {
  id?: string;
  name: string;
  description?: string;
  candidates: CandidateInput[];
}
interface CandidateInput {
  id?: string;
  name: string;
  description?: string;
}
type ValidatedInput = RecursiveRequired<Input>;

interface Output {
  election: Election;
}

export async function upsertElection(ctx: Context, input: Input): Promise<Output> {
  const validatedInput = validate(setDefaults(input));
  const { id } = validatedInput;

  const existingElection = await store.getElection(ctx, id);

  const election = existingElection
    ? await updateElection(ctx, validatedInput, existingElection)
    : await createElection(ctx, validatedInput);

  await store.upsertElection(ctx, election);

  return { election };
}

async function createElection(ctx: Context, input: ValidatedInput) {
  const { id, name, description, candidates } = input;
  const claims = tokens.validateUserAccessToken(ctx.token);
  const now = new Date();

  const election: Election = {
    id,
    dateCreated: now,
    dateUpdated: now,
    createdBy: claims.id,
    name,
    description,
    candidates,
    status: 'SETUP',
    results: null,
  };

  return election;
}

async function updateElection(
  ctx: Context,
  input: ValidatedInput,
  existingElection: Election
) {
  const { name, description, candidates } = input;
  const claims = tokens.validateUserAccessToken(ctx.token);

  if (claims.id !== existingElection.createdBy) {
    throw new Error('not authorized');
  }

  const election: Election = {
    ...existingElection,
    dateUpdated: new Date(),
    name,
    description,
    candidates,
  };

  return election;
}

function setDefaults(input: Input): RecursiveRequired<Input> {
  return {
    ...input,
    id: input.id || uuid.v4(),
    description: input.description || '',
    candidates: input.candidates.map((candidate) => ({
      ...candidate,
      id: candidate.id || uuid.v4(),
      description: candidate.description || '',
    })),
  };
}

function validate(input: RecursiveRequired<Input>): RecursiveRequired<Input> {
  const errors: string[] = [];
  const { id, candidates } = input;

  if (!isValidUuid(input.id)) {
    errors.push(`${id} is not a valid uuid`);
  }

  candidates
    .filter((candidate) => !isValidUuid(candidate.id))
    .forEach((candidate) => {
      errors.push(`${candidate.id} (on candidate ${candidate.name}) is not a valid uuid`);
    });

  return input;
}
