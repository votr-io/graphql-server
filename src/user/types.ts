export interface Context {}

export interface User {
  id: string;
  dateCreated: Date;
  dateUpdated: Date;
  email: string;
  encryptedPassword: string;
}
