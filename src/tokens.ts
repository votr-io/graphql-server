import * as jwt from 'jsonwebtoken';
import { ENV } from './env';

export interface Claims {
  username: string;
}
export function sign(claims: Claims): string {
  return jwt.sign(claims, ENV.TOKEN_SECRET);
}

export function validate(token: string): Claims {
  try {
    return jwt.verify(token, ENV.TOKEN_SECRET) as Claims;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
