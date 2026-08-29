"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
const express_1 = require("express");
const auth_routes_1 = require("./auth.routes");
const post_routes_1 = require("./post.routes");
const nasaApi_routes_1 = __importDefault(require("./nasaApi.routes"));
exports.apiRouter = (0, express_1.Router)();
exports.apiRouter.use('/auth', auth_routes_1.authRouter);
exports.apiRouter.use('/post', post_routes_1.postRouter);
exports.apiRouter.use('/nasa', nasaApi_routes_1.default);
//# sourceMappingURL=api.routes.js.map