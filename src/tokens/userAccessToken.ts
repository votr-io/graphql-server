import * as jwt from 'jsonwebtoken';
import { CONFIG } from '../config';
import { pick } from 'lodash';

export interface Claims {
  id: string;
}

export function createUserAccessToken(claims: Claims) {
  return jwt.sign(pick(claims, 'id'), CONFIG.TOKEN_SECRET);
}

export function validateUserAccessToken(token: string): Claims {
  try {
    return jwt.verify(token, CONFIG.TOKEN_SECRET) as Claims;
  } catch (e) {
    //TODO: throw structurd error based on token error
    throw e;
  }
}
