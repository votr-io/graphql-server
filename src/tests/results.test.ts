import { makePublicElection } from './createElection.test';
import { ElectionStatus } from './generated/globalTypes';

test(`results`, async () => {
  const { election, service, cleanUp } = await makePublicElection();
  const electionId = election.id;
  const candidateIds = election.candidates.map(({ id }) => id);

  try {
    await service.SetStatus({ electionId, status: ElectionStatus.OPEN });
    for (let i = 0; i < 10; i++) {
      await service.CastBallot({ electionId, candidateIds });
    }
    await service.SetStatus({ electionId, status: ElectionStatus.TALLYING });
    const electionWithResults = await service.GetElections({ ids: [electionId] });
    expect(electionWithResults.data.getElections.elections[0].results.winner.id).toBe(
      candidateIds[0]
    );
  } finally {
    await cleanUp();
  }
});
