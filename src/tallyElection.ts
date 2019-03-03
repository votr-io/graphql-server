import { observeBallots, Results } from './db/election';
import { getResults, ElectionResults } from 'alt-vote';

export async function tallyElection(electionId: string) {
  console.log('tallyElection called...');
  const results = await getResults({
    fetchBallots: () => observeBallots('5380dac6-a88a-4116-9373-05f6fe93fba2'),
  });

  console.log(JSON.stringify(transformResults(results), null, 2));
  return transformResults(results);
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
