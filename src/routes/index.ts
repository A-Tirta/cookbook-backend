import { Router } from 'express';

const routes = Router();

import status from '../controller/status';
routes.use('/status', status);

import user from '../controller/user';
routes.use('/user', user);

import comments from '../controller/comments';
routes.use('/comments', comments);

import recepies from '../controller/recepies';
routes.use('/recepies', recepies);

export default routes;
