import * as _ from 'lodash';

const users: [User?] = [];
const elections: [Election?] = [];

export type ElectionStatus = 'PENDING' | 'ACTIVE' | 'TALLYING' | 'COMPLETE';
export interface CandidateVotes {
  candidateId: string;
  votes: number;
}

export interface Election {
  id: string;
  name: string;
  createdBy: string;
  dateUpdated: string;
  candidates: [
    {
      id: string;
      name: string;
      description: string;
    }
  ];
  status: ElectionStatus;
  statusTransitions: [{ on: string; status: ElectionStatus }];
  results?: {
    winnder: string;
    replay: [
      {
        candidateTotals: [CandidateVotes];
        redistribution: [CandidateVotes];
      }
    ];
  };
}

export interface User {
  username: string;
  password: string;
}

export interface Db {
  createUser: (input: { username: string; password: string }) => User;
  getUsers: (input: { ids: [string] }) => [User];
  deleteUsers: (input: { ids: [string] }) => void;

  createElection: (input: { election: Election }) => Election;
  listElections: () => [Election?];
  getElections: (intput: { ids: [string] }) => [Election];
  deleteElections: (input: { ids: [string] }) => void;
}

export const db: Db = {
  createUser: input => {
    users.push(input);
    return input;
  },
  getUsers: ({ ids }) => {
    throw new Error('not imp');
    // return _.find(users, user => user.username === username) || null;
  },
  deleteUsers: ({ ids }) => {
    throw new Error('not imp');
    // _.remove(users, user => user.username == username);
  },

  createElection: ({ election }) => {
    elections.push(election);
    return election;
  },
  listElections: () => {
    return elections;
  },
  getElections: ({ ids }) => {
    throw new Error('not imp');
  },
  deleteElections: ({ ids }) => {
    throw new Error('not imp');
  },
};
