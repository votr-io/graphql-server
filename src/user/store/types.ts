export interface Context {
  token?: string;
}

export interface User {
  id: string;
  dateCreated: Date;
  dateUpdated: Date;
  email: string;
  encryptedPassword: string;
}
