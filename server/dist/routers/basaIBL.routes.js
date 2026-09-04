"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const nasaIBL_controller_1 = require("../controllers/nasaIBL.controller");
const nasaApiRouter = (0, express_1.Router)();
nasaApiRouter.get('/ivl/images', nasaIBL_controller_1.getNasaIBL);
exports.default = nasaApiRouter;
//# sourceMappingURL=basaIBL.routes.js.map