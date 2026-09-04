import { Router } from 'express';
import { getAPOD, getNasaAPODRange } from '../controllers/nasaApod.controller';
import { getNasaIBL } from '../controllers/nasaIBL.controller';
import { getNasaVideos } from '../controllers/nasaVideo.controller';

const nasaApiRouter = Router();

nasaApiRouter.get('/apod', getAPOD);
nasaApiRouter.get('/apod/range', getNasaAPODRange);
nasaApiRouter.get('/ivl/images', getNasaIBL);
nasaApiRouter.get('/ivl/videos', getNasaVideos);

export default nasaApiRouter;