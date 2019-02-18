import { makePublicElection } from './createElection.test';
import * as _ from 'lodash';

interface RemoveCandidateTest {
  name: string;
  remove: string[];
  error?: string;
}

const startingCandidates = ['A', 'B', 'C', 'D'];
const error = 'at least two candidates';
const tests: RemoveCandidateTest[] = [
  { name: 'one', remove: ['A'] },
  { name: 'none', remove: [] },
  { name: 'two', remove: ['A', 'B'] },
  { name: 'one too many', remove: ['A', 'B', 'C'], error },
  { name: 'duplicates', remove: ['A', 'A', 'A'] },
];

tests.forEach(({ name, remove, error }) => {
  test(`removeCandidates - ${name}`, async () => {
    //make an election to work against

    const { election, service, cleanUp } = await makePublicElection({
      candidates: startingCandidates.map(name => ({ name })),
    });

    const idsToRemove = remove.map(
      name => election.candidates.find(candidate => candidate.name === name).id
    );

    //if the API call is expected to fail we can check that it does and then early return
    if (error) {
      await expect(
        service.RemoveCandidates({
          electionId: election.id,
          candidateIds: idsToRemove,
        })
      ).rejects.toThrowError(error);
      await cleanUp();
      return;
    }

    //make the api call and get the updated election
    const { data } = await service.RemoveCandidates({
      electionId: election.id,
      candidateIds: idsToRemove,
    });
    const updatedElection = data.removeCandidates.election;

    const expectedRemainingCandidateIds = election.candidates
      .filter(({ id }) => !idsToRemove.includes(id))
      .map(({ id }) => id);

    //the election should have the same number of candidates that we expect
    expect(updatedElection.candidates.length).toBe(expectedRemainingCandidateIds.length);

    //check to make sure that the candidates that should still be there are there
    expectedRemainingCandidateIds.forEach(id =>
      expect(updatedElection.candidates.map(({ id }) => id)).toContain(id)
    );

    //check to make sure the ones we removed are not there
    idsToRemove.forEach(id =>
      expect(updatedElection.candidates.map(({ id }) => id)).not.toContain(id)
    );

    await cleanUp();
  });
});
