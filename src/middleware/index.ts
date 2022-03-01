import * as dotenv from 'dotenv';
import expressJWT from 'express-jwt';

dotenv.config();

export const JWTCheck = expressJWT({
  secret: process.env.TOKEN as string,
  algorithms: ['HS256'],
}).unless({
  path: ['/user/login', '/status', '/user/register'],
});
