import jwt, { SignOptions } from 'jsonwebtoken';
import config from 'config';
import fs from 'fs';
import path from 'path';

export const signJwt = (
  payload: object,
  key: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
  options: SignOptions = {}
) => {
  const keyValue = fs.readFileSync(
    path.join(__dirname, '../../', 'keys', config.get<string>(key)),
    'utf8'
  );

  return jwt.sign(payload, keyValue, {
    ...(options && options),
    algorithm: 'RS256',
  });
};

export const verifyJwt = <T>(
  token: string,
  key: 'accessTokenPublicKey' | 'refreshTokenPublicKey'
): T | null => {
  try {
    const keyValue = fs.readFileSync(
      path.join(__dirname, '../../', 'keys', config.get<string>(key)),
      'utf8'
    );
    return jwt.verify(token, keyValue) as T;
  } catch (error) {
    return null;
  }
};
