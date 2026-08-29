"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const nasaApod_controller_1 = require("../controllers/nasaApod.controller");
const nasaApiRouter = (0, express_1.Router)();
nasaApiRouter.get('/apod', nasaApod_controller_1.getAPOD);
nasaApiRouter.get('/apod/range', nasaApod_controller_1.getNasaAPODRange);
exports.default = nasaApiRouter;
//# sourceMappingURL=nasaApi.routes.js.map