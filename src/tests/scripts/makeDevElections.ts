import { ElectionStatus } from './../generated/globalTypes';

import { service, createServiceWithAccessToken } from '../service';

interface TestElection {
  name: string;
  description: string;
  candidates: {
    name: string;
    description: string;
  }[];
}

const testElections: TestElection[] = [
  {
    name: 'The Animal Kingdom',
    description: '...you know the one from the CGPGray video.',
    candidates: [
      { name: 'Tiger', description: 'So feirce!' },
      { name: 'Gorilla', description: 'Pretty mellow guy.' },
      { name: 'Turtle', description: 'Chill AF.' },
      { name: 'Leopard', description: 'Real cool cat.' },
      { name: 'Owl', description: 'Who?' },
    ],
  },

  {
    name: 'Long Names',
    description: 'pushing the boundaries of text displays everywhere',
    candidates: [
      {
        name: 'Christopher Michael Langager',
        description: `It's a super day, so why not make a beautiful sky? This is your world, whatever makes you happy you can put in it. Go crazy. This painting comes right out of your heart. I will take some magic white, and a little bit of Vandyke brown and a little touch of yellow. This is your world. Let's get crazy.`,
      },
      {
        name: 'Julia Scarlett Elizabeth Louis-Dreyfus',
        description: `We'll do another happy little painting. Let all these things just sort of happen. Just beat the devil out of it.`,
      },
      {
        name: '徽因 Hui Yin',
        description: `See there how easy that is. If you didn't have baby clouds, you wouldn't have big clouds. All you need to paint is a few tools, a little instruction, and a vision in your mind. Follow the lay of the land. It's most important. It's so important to do something every day that will make you happy. Fluff it up a little and hypnotize it.`,
      },
    ],
  },

  {
    name: 'No descriptions, lots of candidates.',
    description: 'There should be 20 candidates.',
    candidates: [
      { name: 'A', description: '' },
      { name: 'B', description: '' },
      { name: 'C', description: '' },
      { name: 'D', description: '' },
      { name: 'E', description: '' },
      { name: 'F', description: '' },
      { name: 'G', description: '' },
      { name: 'H', description: '' },
      { name: 'I', description: '' },
      { name: 'J', description: '' },
      { name: 'K', description: '' },
      { name: 'L', description: '' },
      { name: 'M', description: '' },
      { name: 'N', description: '' },
      { name: 'O', description: '' },
      { name: 'P', description: '' },
      { name: 'Q', description: '' },
      { name: 'R', description: '' },
      { name: 'S', description: '' },
      { name: 'T', description: '' },
    ],
  },
];

async function createElections(testElections: TestElection[]) {
  console.log(`creating ${testElections.length} elections...`);
  testElections.forEach(async electionInput => {
    const { data } = await service.CreateElection({
      ...electionInput,
      email: 'test@fake.com',
    });
    const { election, adminToken } = data.createElection;
    const loginResponse = await service.WeakLogin({ adminToken });
    const serviceWithToken = createServiceWithAccessToken(
      loginResponse.data.weakLogin.accessToken
    );
    const electionId = election.id;
    await serviceWithToken.SetStatus({ electionId, status: ElectionStatus.OPEN });

    console.log(`[${electionId}] ${election.name}`);
  });
}

createElections(testElections);
