import { Handler } from './../ElectionService';
import { Context } from '../../context';
import * as db from '../../db/election';
import { Election } from '../types';

export const getElectionsHandler: Handler<Context, string[], Promise<Election[]>> = {
  handleRequest: (ctx, ids) => {
    return db.getElections({ ids });
  },
};
