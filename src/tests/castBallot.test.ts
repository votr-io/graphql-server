import { ElectionStatus } from './generated/globalTypes';
import { makePublicElection } from './createElection.test';
const uuidv4 = require('uuid/v4');
import * as _ from 'lodash';

test(`cast ballot -  election pending`, async () => {
  const { election, service, cleanUp } = await makePublicElection();
  const electionId = election.id;
  const candidateIds = election.candidates.map(({ id }) => id);

  try {
    await expect(service.CastBallot({ electionId, candidateIds })).rejects.toThrow();
  } finally {
    await cleanUp();
  }
});

test(`cast ballot - election tallying`, async () => {
  const { election, service, cleanUp } = await makePublicElection();
  const electionId = election.id;
  const candidateIds = election.candidates.map(({ id }) => id);

  try {
    await service.SetStatus({ electionId, status: ElectionStatus.OPEN });
    await service.SetStatus({ electionId, status: ElectionStatus.TALLYING });
    await expect(service.CastBallot({ electionId, candidateIds })).rejects.toThrow();
  } finally {
    await cleanUp();
  }
});

test(`cast ballot - candidates not on election`, async () => {
  const { election, service, cleanUp } = await makePublicElection();
  const electionId = election.id;
  const candidateIds = election.candidates.map(({ id }) => id);

  try {
    await service.SetStatus({ electionId, status: ElectionStatus.OPEN });
    candidateIds.push(uuidv4());
    await expect(service.CastBallot({ electionId, candidateIds })).rejects.toThrow();
  } finally {
    await cleanUp();
  }
});

test(`cast ballot - no candidates`, async () => {
  const { election, service, cleanUp } = await makePublicElection();
  const electionId = election.id;
  const candidateIds = election.candidates.map(({ id }) => id);

  try {
    await service.SetStatus({ electionId, status: ElectionStatus.OPEN });
    candidateIds.push(uuidv4());
    await expect(service.CastBallot({ electionId, candidateIds: [] })).rejects.toThrow();
  } finally {
    await cleanUp();
  }
});

test(`ballot with all the candidates`, async () => {
  const { election, service, cleanUp } = await makePublicElection();
  const electionId = election.id;
  const candidateIds = election.candidates.map(({ id }) => id);

  try {
    await service.SetStatus({ electionId, status: ElectionStatus.OPEN });
    await service.CastBallot({ electionId, candidateIds });
  } finally {
    await cleanUp();
  }
});

test(`ballot with all one candidate`, async () => {
  const { election, service, cleanUp } = await makePublicElection();
  const electionId = election.id;
  const candidateIds = election.candidates.map(({ id }) => id);

  try {
    await service.SetStatus({ electionId, status: ElectionStatus.OPEN });
    await service.CastBallot({ electionId, candidateIds: [candidateIds[0]] });
  } finally {
    await cleanUp();
  }
});

test(`multiple ballots can be cast per election`, async () => {
  const { election, service, cleanUp } = await makePublicElection();
  const electionId = election.id;
  const candidateIds = election.candidates.map(({ id }) => id);

  try {
    await service.SetStatus({ electionId, status: ElectionStatus.OPEN });

    for (let i = 0; i < 10; i++) {
      await service.CastBallot({ electionId, candidateIds: shuffle(candidateIds) });
    }
  } finally {
    await cleanUp();
  }
});

//https://bost.ocks.org/mike/shuffle/
function shuffle<T>(ogArray: T[]) {
  const array = _.cloneDeep(ogArray);
  var m = array.length,
    t,
    i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}
