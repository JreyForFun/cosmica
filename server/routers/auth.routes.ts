import { Router } from 'express';
import { registerUserHandler, loginUserHandler, getMeHandler } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';