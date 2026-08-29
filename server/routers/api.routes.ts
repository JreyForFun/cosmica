import {Router} from 'express';
import { authRouter } from './auth.routes';
import { postRouter } from './post.routes';
import nasaApiRouter from './nasaApi.routes';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/post', postRouter);
apiRouter.use('/nasa', nasaApiRouter);