import { makePublicElection } from './createElection.test';
import { ElectionStatus } from './generated/globalTypes';

interface TestCase {
  testName: string;
  name?: string;
  description?: string;
}

const testCases: TestCase[] = [
  {
    testName: 'nothing',
  },
  { testName: 'just name', name: 'new name' },
  { testName: 'just description', description: 'new description, who this?' },
  { testName: 'both', name: 'new name', description: 'new description, who this?' },
];

testCases.forEach(({ testName, name, description }) => {
  test(`updateElection - ${testName}`, async () => {
    const { election, service, cleanUp } = await makePublicElection();
    const electionId = election.id;
    const ogName = election.name;
    const ogDesciption = election.description;

    const { data } = await service.UpdateElection({ electionId, name, description });
    const updatedElection = data.updateElection.election;

    expect(updatedElection.name).toBe(name ? name : ogName);
    expect(updatedElection.description).toBe(description ? description : ogDesciption);

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
