"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
const express_1 = require("express");
const auth_routes_1 = require("./auth.routes");
const post_routes_1 = require("./post.routes");
exports.apiRouter = (0, express_1.Router)();
exports.apiRouter.use('/auth', auth_routes_1.authRouter);
exports.apiRouter.use('/post', post_routes_1.postRouter);
//# sourceMappingURL=api.routes.js.map