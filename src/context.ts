import { ElectionService, electionService } from './domain/ElectionService';

export interface Context {
  token: string;
  electionService: ElectionService;
}
export function context({ req }): Context {
  const token = req.headers['x-token'] || '';
  return { token, electionService };
}
