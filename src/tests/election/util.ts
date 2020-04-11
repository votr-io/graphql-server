import * as uuid from 'uuid';
import { sdk } from '../graphql/sdk';
import { createUserAndLogin } from '../user/util';

export function newElectionInput() {
  const id = uuid.v4();
  const name = `Test Election`;
  const description = 'This is a test election.';
  const candidates = [
    {
      id: uuid.v4(),
      name: 'A',
      description: 'A has long stood before the other candiates.',
    },
    {
      id: uuid.v4(),
      name: 'B',
      description: 'Typeically in second place, B is poised to win this election.',
    },
    {
      id: uuid.v4(),
      name: 'C',
      description: 'Always the underdog.',
    },
  ];
  return { id, name, description, candidates };
}

export async function createElection({
  id = uuid.v4(),
  name = 'Test Election',
  description = 'This sure is a test election',
  candidates = [
    {
      id: uuid.v4(),
      name: 'A',
      description: 'A has long stood before the other candiates.',
    },
    {
      id: uuid.v4(),
      name: 'B',
      description: 'Typeically in second place, B is poised to win this election.',
    },
    {
      id: uuid.v4(),
      name: 'C',
      description: 'Always the underdog.',
    },
  ],
}: {
  id?: string;
  name?: string;
  description?: string;
  candidates?: { id?: string; name: string; description: string }[];
} = {}) {
  const response = await sdk.upsertElection({
    input: {
      id,
      name,
      description,
      candidates,
    },
  });

  return response.upsertElection.election;
}

export async function createStartedElection() {
  await createUserAndLogin();
  const { id: electionId } = await createElection();
  const response = await sdk.startElection({
    input: {
      electionId,
    },
  });
  return response.startElection.election;
}
