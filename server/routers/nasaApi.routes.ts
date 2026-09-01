import { Router } from 'express';
import { getAPOD, getNasaAPODRange } from '../controllers/nasaApod.controller';
import { getNasaIBL } from '../controllers/nasaIBL.controller';

const nasaApiRouter = Router();

nasaApiRouter.get('/apod', getAPOD);
nasaApiRouter.get('/apod/range', getNasaAPODRange);
nasaApiRouter.get('/ivl/images', getNasaIBL);

export default nasaApiRouter;