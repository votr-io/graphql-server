import { CONFIG } from '../config';
import {
  createPool,
  TaggedTemplateLiteralInvocationType,
  QueryResultRowType,
} from 'slonik';

export const pool = createPool(CONFIG.DATABASE_URL, {
  typeParsers: [
    //NOTE: passing an empty array here disables default type parsers
    //this is usefull because the default parser turns timestamps in postgres to numbers
    //without the default parser, it is a Date, which is what we want to use in code
    //https://github.com/gajus/slonik#default-type-parsers
  ],
});

//not sure about this, but I'm using this type in a lot of places and it sure is long
export type Sql = TaggedTemplateLiteralInvocationType<QueryResultRowType<string>>;
