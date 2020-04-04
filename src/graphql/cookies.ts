import { Request, Response } from 'express';
import { parse } from 'cookie';

const TOKEN = 'token';
const ONE_MONTH = 2592000000;

export function login(res: Response, token: String) {
  res.cookie(TOKEN, token, {
    maxAge: ONE_MONTH,
    httpOnly: true,
  });
}

export function logout(res: Response) {
  res.clearCookie(TOKEN);
}

export function getToken(req: Request) {
  if (!req.headers.cookie) {
    return;
  }
  const { token } = parse(req.headers.cookie);
  return token;
}
