import { Router } from 'express';
import { getNasaIBL } from '../controllers/nasaIBL.controller';

const nasaApiRouter = Router();

nasaApiRouter.get('/ivl/images', getNasaIBL);

export default nasaApiRouter;