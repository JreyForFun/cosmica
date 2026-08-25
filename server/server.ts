import express from 'express';
import { createServer } from './app';
import dotenv from 'dotenv';
import { logger } from './lib/logger';
import connectDB from './config/connectDb';

dotenv.config();

const app = createServer();
async function startServer() {
  await connectDB();

  app.listen(process.env.PORT, () => {
    logger.info(`Server is running on port ${process.env.PORT}`);
  });
}

startServer().catch((error) => {
  logger.error('Error starting server:', error);
});
