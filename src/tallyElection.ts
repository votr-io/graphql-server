import { observeBallots, getElection, updateElection } from './db/election';
import { getResults, ElectionResults } from 'alt-vote';
import { Results } from './types';

export async function tallyElection(electionId: string) {
  console.log('tallyElection called...');

  //get the election
  const election = await getElection(electionId);
  if (election.status !== 'TALLYING') {
    console.log(
      `tallyElection called on election '${electionId}' in status ${
        election.status
      }.  early returning.`
    );
    console.log(JSON.stringify(election, null, 2));
    return;
  }

  const results = await getResults({
    fetchBallots: () => observeBallots(electionId),
  });
  election.results = transformResults(results);
  election.status = 'CLOSED';

  await updateElection({ election });
  const updatedElection = await getElection(electionId);
  console.log(JSON.stringify(updatedElection, null, 2));
}

function transformResults({ winner, rounds }: ElectionResults): Results {
  return {
    winner,
    replay: rounds.map(round => {
      return {
        candidate_totals: Object.keys(round).map(candidate_id => ({
          candidate_id,
          votes: round[candidate_id],
        })),
        redistribution: [], //TODO
      };
    }),
  };
}
