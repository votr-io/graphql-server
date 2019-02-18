import { makePublicElection } from './createElection.test';
import * as _ from 'lodash';

interface AddCandidateTest {
  name: string;
  names: string[];
  duplicateNames?: string[];
}

const addCandidatesTests: AddCandidateTest[] = [
  { name: 'empty array', names: [] },
  { name: 'single', names: ['A'] },
  { name: 'multiple', names: ['A', 'B'] },
  { name: 'duplicate', names: ['A', 'B'], duplicateNames: ['A'] },
  { name: 'duplicate but different casing', names: ['A', 'B'], duplicateNames: ['a'] },
  {
    name: 'duplicate with alrady existing',
    names: ['A', 'B'],
    duplicateNames: ['Gorilla'],
  },
  {
    name: 'duplicate with alrady existing but with different casing',
    names: ['A', 'B'],
    duplicateNames: ['goRilla'],
  },
  { name: 'all duplicates', names: [], duplicateNames: ['gorilla', 'tiger'] },
];

addCandidatesTests.forEach(({ name, names, duplicateNames = [] }) => {
  test(`addCandidates - ${name}`, async () => {
    //make an election to work against
    const { election, service, cleanUp } = await makePublicElection();

    //build up the request input with all the names in this test case
    const candidates = [...names, ...duplicateNames].map(name => ({ name }));

    //make the api call and get the updated election
    const { data } = await service.AddCandidates({ electionId: election.id, candidates });
    const updatedElection = data.addCandidates.election;

    //we should only have created new cadidates that were not duplicates
    expect(updatedElection.candidates.length).toBe(
      election.candidates.length + names.length
    );
    //all the non-duped names sent in should now appear on the election as candidates
    names.forEach(name =>
      expect(updatedElection.candidates.map(({ name }) => name)).toContain(name)
    );

    //all the candidates should have unique ids
    expect(_.uniqBy(updatedElection.candidates, ({ id }) => id).length).toBe(
      updatedElection.candidates.length
    );

    await cleanUp();
  });
});
