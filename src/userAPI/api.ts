export interface User {
  id: string;
  email: string;
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
interface IdMap<T> {
  [id: string]: T;
}

export interface API {
  createUser: (input: Omit<User, 'id'>) => Promise<User>;
  getUsers: (input: { ids: String[] }) => Promise<IdMap<User[]>>;
}
