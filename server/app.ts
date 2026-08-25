import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { notFound } from './middlewares/notFound.middleware';
import { apiRouter } from './routers/api.routes'; 

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use('/api', apiRouter);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}