import * as _ from 'lodash';
const uuidv4 = require('uuid/v4');

const users: [User?] = [];
const elections: [Election?] = [];

export type ElectionStatus = 'PENDING' | 'OPEN' | 'TALLYING' | 'CLOSED';
export interface CandidateVotes {
  candidateId: string;
  votes: number;
}

export interface Election {
  id: string;
  name: string;
  createdBy: string;
  dateUpdated: string;
  candidates: {
    id: string;
    name: string;
    description: string;
  }[];
  status: ElectionStatus;
  statusTransitions: { on: string; status: ElectionStatus }[];
  results?: {
    winnder: string;
    replay: {
      candidateTotals: CandidateVotes[];
      redistribution: CandidateVotes[];
    }[];
  };
}

export interface User {
  id: string;
  username: string;
  password: string;
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface Db {
  createUser: (input: { username: string; password: string }) => User;
  getUsers: (input: { ids: string[] }) => User[];
  deleteUsers: (input: { ids: string[] }) => void;

  createElection: (input: { election: Election }) => Election;
  listElections: (input: { createdBy?: string }) => Election[];
  getElections: (intput: { ids: string[] }) => Election[];
  deleteElections: (input: { ids: string[] }) => void;
}

export const db: Db = {
  createUser: input => {
    const user = { ...input, id: uuidv4() };
    users.push(user);
    return user;
  },
  getUsers: ({ ids }) => {
    return _.filter(users, ({ id }) => _.includes(ids, id));
  },
  deleteUsers: ({ ids }) => {
    _.remove(users, ({ id }) => _.includes(ids, id));
  },

  createElection: ({ election }) => {
    console.log('create election in db hit');
    elections.push(election);
    return election;
  },
  listElections: ({ createdBy }) => {
    return _.filter(elections, election => election.createdBy === createdBy);
  },
  getElections: ({ ids }) => {
    return _.filter(elections, ({ id }) => _.includes(ids, id));
  },
  deleteElections: ({ ids }) => {
    _.remove(elections, ({ id }) => _.includes(ids, id));
  },
};
