"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserHandler = registerUserHandler;
exports.loginUserHandler = loginUserHandler;
exports.getMeHandler = getMeHandler;
exports.toggleFavoriteHandler = toggleFavoriteHandler;
const auth_service_1 = require("../services/auth.service");
const jwt_1 = require("../lib/jwt");
const errors_1 = require("../lib/errors");
const user_repository_1 = require("../repositories/user.repository");
async function registerUserHandler(req, res, next) {
    try {
        const { username, email, password } = req.body;
        const user = await (0, auth_service_1.registerUser)(username, email, password);
        const accessToken = (0, jwt_1.signAccessToken)({ userId: user._id, email: user.email });
        res.status(201).json({
            success: true,
            message: "Register Complete",
            accessToken,
            user,
        });
    }
    catch (error) {
        next(error);
    }
}
;
async function loginUserHandler(req, res, next) {
    try {
        const { email, password } = req.body;
        const { accessToken, user } = await (0, auth_service_1.loginUser)(email, password);
        res.status(200).json({
            success: true,
            accessToken,
            user,
        });
    }
    catch (err) {
        next(err);
    }
}
async function getMeHandler(req, res, next) {
    try {
        if (!req.user) {
            throw new errors_1.AppError(401, 'Authentication is required');
        }
        const user = await (0, user_repository_1.findUserById)(req.user.userId);
        if (!user) {
            throw new errors_1.AppError(404, 'User not found');
        }
        res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        next(error);
    }
}
async function toggleFavoriteHandler(req, res, next) {
    try {
        if (!req.user) {
            throw new errors_1.AppError(401, 'Authentication is required');
        }
        const { favorite } = req.body ?? {};
        const { favorites } = await (0, auth_service_1.toggleFavorite)(req.user.userId, favorite);
        res.status(200).json({
            success: true,
            favorites,
        });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=auth.controller.js.map