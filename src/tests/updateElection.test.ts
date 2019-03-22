import { CreateCandidateInput } from './../generated/resolvers';
import { makePublicElection } from './createElection.test';
import { ElectionStatus } from './generated/globalTypes';

interface TestCase {
  testName: string;
  name?: string;
  description?: string;
  candidates?: CreateCandidateInput[];
}

const testCases: TestCase[] = [
  {
    testName: 'nothing',
  },
  { testName: 'just name', name: 'new name' },
  { testName: 'just description', description: 'new description, who this?' },
  { testName: 'both', name: 'new name', description: 'new description, who this?' },
  {
    testName: 'clobber candidates',
    name: 'new name',
    description: 'new description, who this?',
    candidates: [{ id: '1', name: 'Tiger' }, { id: '2', name: 'Gorilla' }],
  },
];

testCases.forEach(({ testName, name, description, candidates }) => {
  test(`updateElection - ${testName}`, async () => {
    const { election, service, cleanUp } = await makePublicElection();
    const electionId = election.id;
    const ogName = election.name;
    const ogDesciption = election.description;
    const ogCandidates = election.candidates;

    const { data } = await service.UpdateElection({
      electionId,
      name,
      description,
      candidates,
    });
    const updatedElection = data.updateElection.election;

    expect(updatedElection.name).toBe(name ? name : ogName);
    expect(updatedElection.description).toBe(description ? description : ogDesciption);

    const expectedCandidates = candidates ? candidates : ogCandidates;
    expectedCandidates.forEach(expectedCandidate => {
      expect(
        updatedElection.candidates.find(({ id }) => id === expectedCandidate.id).name
      ).toEqual(expectedCandidate.name);
    });

    await cleanUp();
  });
});

test(`update election - invalid election status`, async () => {
  const { election, service, cleanUp } = await makePublicElection();
  const electionId = election.id;

  try {
    await service.SetStatus({ electionId, status: ElectionStatus.OPEN });
    await expect(service.UpdateElection({ electionId })).rejects.toThrow();
  } finally {
    await cleanUp();
  }
});
