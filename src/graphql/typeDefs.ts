import { gql } from 'apollo-server-express';
import * as fs from 'fs';
import * as path from 'path';

const PATH_TO_GQL_DIR = '../../graphql/';

/**
 * helper script to read all of the .graphql files in a directory and
 * bring them together into a single schema.  This is useful, especially
 * if you like breaking up your .graphql files into logical pieces.
 * For example, I like to separate queries and mutations.
 */
const schemaDirectory = path.join(__dirname, PATH_TO_GQL_DIR);
const schema = fs
  .readdirSync(schemaDirectory)
  .filter(fileName => fileName.endsWith('.graphql'))
  .map(fileName => path.join(schemaDirectory, fileName))
  .map(filePath => fs.readFileSync(filePath, 'utf8'))
  .reduce((a, b) => {
    return a + '\n\n' + b;
  }, '');

export const typeDefs = gql`
  ${schema}
`;
