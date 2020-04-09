import * as uuid from 'uuid';

export function newElectionInput() {
  const id = uuid.v4();
  const name = `Test Election`;
  const description = 'This is a test election.';
  const candidates = [
    {
      id: uuid.v4(),
      name: 'A',
      description: 'A has long stood before the other candiates.',
    },
    {
      id: uuid.v4(),
      name: 'B',
      description: 'Typeically in second place, B is poised to win this election.',
    },
    {
      id: uuid.v4(),
      name: 'C',
      description: 'Always the underdog.',
    },
  ];
  return { id, name, description, candidates };
}
