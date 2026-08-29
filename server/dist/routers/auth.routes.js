"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post('/register', auth_controller_1.registerUserHandler);
exports.authRouter.post('/login', auth_controller_1.loginUserHandler);
exports.authRouter.patch('/favorites', auth_middleware_1.authenticate, auth_controller_1.toggleFavoriteHandler);
exports.authRouter.get('/me', auth_middleware_1.authenticate, auth_controller_1.getMeHandler);
//# sourceMappingURL=auth.routes.js.map