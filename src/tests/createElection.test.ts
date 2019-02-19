import { service as baseService, createServiceWithAccessToken } from './service';
import { CreateElectionVariables } from './generated/CreateElection';

export async function makePublicElection(
  input: {
    name?: string;
    description?: string;
    email?: string;
    candidates?: {
      name: string;
      description?: string;
    }[];
  } = {}
) {
  const name = input.name || 'create election test';
  const description = input.description || 'this sure is an election';
  const candidates = input.candidates || [
    {
      name: 'Tiger',
    },
    {
      name: 'Gorilla',
    },
    {
      name: 'Turtle',
    },
    {
      name: 'Leopard',
    },
    {
      name: 'Owl',
    },
  ];
  const email = input.email || 'test@fake.com';

  //create the election and run our tests
  const res = await baseService.CreateElection({
    name,
    description,
    candidates,
    email,
  });
  const { election, adminToken } = res.data.createElection;

  //info we sent in
  expect(election.name).toBe(name);
  expect(election.description).toBe(description);
  candidates.forEach(({ name }) =>
    expect(election.candidates.map(candidate => candidate.name)).toContain(name)
  );
  expect(election.createdBy.email).toBe(email);

  //stuff that the server automatically creates
  expect(election.status).toBe('PENDING');
  expect(election.statusTransitions[0].status).toBe('PENDING');
  expect(election.results).toBeNull();

  //perform a weak login with the adminToken we just got back
  const {
    data: {
      weakLogin: { accessToken },
    },
  } = await baseService.WeakLogin({ adminToken: adminToken });
  const service = createServiceWithAccessToken(accessToken);
  return {
    election,
    service,
    cleanUp: async () => {
      await service.DeleteElection({ id: election.id });
      const {
        data: {
          getElections: { elections },
        },
      } = await service.GetElections({ ids: [election.id] });
      expect(elections.length).toBe(0);
    },
  };
}

test('create election', async () => {
  const { cleanUp } = await makePublicElection();
  await cleanUp();
});

interface ValidationTest {
  input: CreateElectionVariables;
  expectedError: string;
}

const validationTestCases: ValidationTest[] = [
  {
    input: {
      name: '',
      description: '',
      email: 'test@fake.com',
      candidates: [{ name: 'Gorilla' }, { name: 'Tiger' }],
    },
    expectedError: 'name is required',
  },
  {
    input: {
      name: 'this sure is an election',
      description: '',
      email: '',
      candidates: [{ name: 'Gorilla' }, { name: 'Tiger' }],
    },
    expectedError: 'email is required',
  },
  {
    input: {
      name: 'this sure is an election',
      description: 'jkl',
      email: 'test@fake.com',
      candidates: [{ name: '' }, { name: 'Tiger' }],
    },
    expectedError: 'candidate.name is required',
  },
  {
    input: {
      name: 'this sure is an election',
      description: 'jkl',
      email: 'test@fake.com',
      candidates: [{ name: 'Tiger' }],
    },
    expectedError: 'at least two candidates',
  },
];

test('validation', async () => {
  validationTestCases.forEach(async ({ input, expectedError }) => {
    await expect(baseService.CreateElection(input)).rejects.toThrowError(expectedError);
  });
});
