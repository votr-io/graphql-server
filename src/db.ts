import * as _ from 'lodash';

const users: [User?] = [];
const elections: [Election?] = [];

export interface Election {
  name: string;
  createdBy: String;
}

export interface User {
  username: string;
  password: string;
}

export interface Db {
  createUser: (input: { username: string; password: string }) => User;
  getUser: (input: { username: string }) => User | null;
  deleteUser: (username: string) => void;

  createElection: (input: { name: string; username: string }) => Election;
  listElections: () => [Election?];
}

export const db: Db = {
  createUser: input => {
    users.push(input);
    return input;
  },
  getUser: ({ username }) => {
    return _.find(users, user => user.username === username) || null;
  },
  deleteUser: username => {
    _.remove(users, user => user.username == username);
  },

  createElection: ({ name, username }) => {
    elections.push({ name, createdBy: username });
    return { name, createdBy: username };
  },
  listElections: () => {
    return elections;
  },
};
