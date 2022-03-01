import { verify } from 'jsonwebtoken';

export function tokenConverter(token: string): any {
  const reader = token.replace('Bearer ', '');

  return verify(reader, String(process.env.TOKEN));
}
