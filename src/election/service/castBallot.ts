import { Election, Context } from '../types';
import * as store from '../store';

interface Input {
  electionId: string;
  candidateIds: string[];
}

interface Output {}

export async function castBallot(ctx: Context, input: Input): Promise<Output> {
  const { electionId, candidateIds } = input;
  validateInput(input);

  const election = await store.getElection(ctx, electionId);

  if (!election) {
    throw new Error(`could not find election with id ${electionId}`);
  }

  if (election.status !== 'OPEN') {
    throw new Error(`cannot vote in an election that is in status '${election.status}'`);
  }

  validateCandidateIds(candidateIds, election);

  await store.createBallot(ctx, { electionId, dateCreated: new Date(), candidateIds });

  return {};
}

function validateInput(input: Input) {
  const { candidateIds } = input;

  const errors: string[] = [];

  if (candidateIds.length === 0) {
    errors.push(
      'candidateIds is empty - you must vote for at least one candidate to cast a ballot'
    );
  }

  if (errors.length > 0) {
    throw new Error(`input validation failed: ${errors.join(', ')}`);
  }
}

function validateCandidateIds(candidateIds: string[], election: Election) {
  const bogusCandidateIds = candidateIds.filter(
    (candidateId) => !election.candidates.map(({ id }) => id).includes(candidateId)
  );

  if (bogusCandidateIds.length > 0) {
    throw new Error(
      `the following candidate ids do not exist in this election: ${bogusCandidateIds.join(
        ', '
      )}`
    );
  }

  const duplicateCandidateIds = getDuplicates(candidateIds);
  if (duplicateCandidateIds.length > 0) {
    throw new Error(
      `duplicate candidate ids are not allowd. the following candidate ids appear more than once: ${duplicateCandidateIds.join(
        ', '
      )}`
    );
  }
}

function getDuplicates(arr: string[]) {
  const countMap = arr.reduce((acc, s) => {
    if (!acc[s]) {
      acc[s] = 0;
    }
    acc[s]++;
    return acc;
  }, {});

  return Object.keys(countMap).filter((s) => countMap[s] > 1);
}
