"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const nasaApod_controller_1 = require("../controllers/nasaApod.controller");
const nasaIBL_controller_1 = require("../controllers/nasaIBL.controller");
const nasaVideo_controller_1 = require("../controllers/nasaVideo.controller");
const nasaApiRouter = (0, express_1.Router)();
nasaApiRouter.get('/apod', nasaApod_controller_1.getAPOD);
nasaApiRouter.get('/apod/range', nasaApod_controller_1.getNasaAPODRange);
nasaApiRouter.get('/ivl/images', nasaIBL_controller_1.getNasaIBL);
nasaApiRouter.get('/ivl/videos', nasaVideo_controller_1.getNasaVideos);
exports.default = nasaApiRouter;
//# sourceMappingURL=nasaApi.routes.js.map