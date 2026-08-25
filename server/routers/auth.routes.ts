import { Router } from 'express';
import { registerUserHandler, loginUserHandler, getMeHandler } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

export const authRouter = Router();

authRouter.post('/register', registerUserHandler);
authRouter.post('/login', loginUserHandler);
authRouter.get('/me', authenticate, getMeHandler);