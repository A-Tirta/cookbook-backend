import { Router, Request, Response, NextFunction } from 'express';
import { genSalt, hash, compare } from 'bcryptjs';
import { body, validationResult } from 'express-validator';

import { prismaClient } from '../config';
import { returnResponse } from '../interface/';
import { prisma } from '@prisma/client';

const router = Router();

let resObject: returnResponse;

//input code here

export default router;
