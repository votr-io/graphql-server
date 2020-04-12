import { createStartedElection } from './util';
import { sdk } from '../graphql/sdk';

(async () => {
  const response = await sdk.getElection({ id: '27064f58-7c15-4ab6-b314-8bf5d08bea98' });

  const { id, candidates } = response.election;

  const candidateIds = candidates.map(({ id }) => id);

  for (let i = 0; i < 1000; i++) {
    console.log(`${i}: casting ballots...`);
    await Promise.all([
      sdk.castBallot({ input: { electionId: id, candidateIds: shuffle(candidateIds) } }),
      sdk.castBallot({ input: { electionId: id, candidateIds: shuffle(candidateIds) } }),
      sdk.castBallot({ input: { electionId: id, candidateIds: shuffle(candidateIds) } }),
      sdk.castBallot({ input: { electionId: id, candidateIds: shuffle(candidateIds) } }),
      sdk.castBallot({ input: { electionId: id, candidateIds: shuffle(candidateIds) } }),
      sdk.castBallot({ input: { electionId: id, candidateIds: shuffle(candidateIds) } }),
      sdk.castBallot({ input: { electionId: id, candidateIds: shuffle(candidateIds) } }),
      sdk.castBallot({ input: { electionId: id, candidateIds: shuffle(candidateIds) } }),
      sdk.castBallot({ input: { electionId: id, candidateIds: shuffle(candidateIds) } }),
      sdk.castBallot({ input: { electionId: id, candidateIds: shuffle(candidateIds) } }),
      sdk.castBallot({ input: { electionId: id, candidateIds: shuffle(candidateIds) } }),
      sdk.castBallot({ input: { electionId: id, candidateIds: shuffle(candidateIds) } }),
      sdk.castBallot({ input: { electionId: id, candidateIds: shuffle(candidateIds) } }),
      sdk.castBallot({ input: { electionId: id, candidateIds: shuffle(candidateIds) } }),
      sdk.castBallot({ input: { electionId: id, candidateIds: shuffle(candidateIds) } }),
      sdk.castBallot({ input: { electionId: id, candidateIds: shuffle(candidateIds) } }),
      sdk.castBallot({ input: { electionId: id, candidateIds: shuffle(candidateIds) } }),
      sdk.castBallot({ input: { electionId: id, candidateIds: shuffle(candidateIds) } }),
      sdk.castBallot({ input: { electionId: id, candidateIds: shuffle(candidateIds) } }),
      sdk.castBallot({ input: { electionId: id, candidateIds: shuffle(candidateIds) } }),
      sdk.castBallot({ input: { electionId: id, candidateIds: shuffle(candidateIds) } }),
      sdk.castBallot({ input: { electionId: id, candidateIds: shuffle(candidateIds) } }),
    ]);
  }
})();

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
