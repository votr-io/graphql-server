import { API, User } from './api';
import * as uuid from 'uuid/v4';
import { createUser, getUsers } from './store';

export const service: API = {
  createUser: async ({ email }) => {
    //TODO: validate email

    const id = uuid();
    const user = { id, email };
    await createUser(user);
    return user;
  },
  getUsers: async ({ ids }) => {
    const users = await getUsers(ids);
    return users.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});
  },
};
