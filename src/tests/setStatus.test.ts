import { makePublicElection } from './createElection.test';
import { ElectionStatus } from './generated/globalTypes';

interface TestCase {
  name: string;
  statuses: {
    status: ElectionStatus;
    error?: string;
  }[];
}

const tests: TestCase[] = [
  {
    name: 'pending->open',
    statuses: [{ status: ElectionStatus.OPEN }],
  },
  {
    name: 'pending->tallying',
    statuses: [{ status: ElectionStatus.TALLYING, error: 'invalid status transition' }],
  },
  {
    name: 'pending->tallying',
    statuses: [{ status: ElectionStatus.TALLYING, error: 'invalid status transition' }],
  },
  {
    name: 'pending->tallying',
    statuses: [{ status: ElectionStatus.TALLYING, error: 'invalid status transition' }],
  },
  {
    name: 'pending->tallying',
    statuses: [{ status: ElectionStatus.TALLYING, error: 'invalid status transition' }],
  },
  {
    name: 'pending->closed',
    statuses: [{ status: ElectionStatus.CLOSED, error: 'invalid status transition' }],
  },
  {
    name: 'pending->pending',
    statuses: [{ status: ElectionStatus.PENDING }],
  },
  {
    name: 'pending->open->tallying',
    statuses: [{ status: ElectionStatus.OPEN }, { status: ElectionStatus.TALLYING }],
  },
  {
    name: 'idempotent',
    statuses: [
      { status: ElectionStatus.OPEN },
      { status: ElectionStatus.OPEN },
      { status: ElectionStatus.OPEN },
      { status: ElectionStatus.OPEN },
      { status: ElectionStatus.TALLYING },
      { status: ElectionStatus.TALLYING },
      { status: ElectionStatus.TALLYING },
      { status: ElectionStatus.TALLYING },
    ],
  },
];

tests.forEach(({ name, statuses }) => {
  test(`setStatus - ${name}`, async () => {
    //make an election to work against
    const { election, service, cleanUp } = await makePublicElection();
    try {
      for (let i = 0; i < statuses.length; i++) {
        const { status, error } = statuses[i];
        // if the API call is expected to fail we can check that it does and then early return
        if (error) {
          await expect(
            service.SetStatus({
              electionId: election.id,
              status,
            })
          ).rejects.toThrowError(error);
          return;
        }
        const { data } = await service.SetStatus({ electionId: election.id, status });
        expect(data.setStatus.election.status).toBe(status);
      }
    } finally {
      await cleanUp();
    }
  });
});
