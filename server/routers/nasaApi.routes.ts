import { Router } from 'express';
import { getAPOD, getNasaAPODRange } from '../controllers/nasaApod.controller';

const nasaApiRouter = Router();

nasaApiRouter.get('/apod', getAPOD);
nasaApiRouter.get('/apod/range', getNasaAPODRange);

export default nasaApiRouter;