import { Router } from 'express';
import { getAPOD } from '../controllers/nasaApod.controller';

const nasaApiRouter = Router();

nasaApiRouter.get('/apod', getAPOD);

export default nasaApiRouter;