"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserHandler = registerUserHandler;
exports.loginUserHandler = loginUserHandler;
exports.getMeHandler = getMeHandler;
const auth_service_1 = require("../services/auth.service");
async function registerUserHandler(req, res, next) {
    try {
        const { username, email, password } = req.body;
        await (0, auth_service_1.registerUser)(username, email, password);
        res.status(201).json({
            success: true,
            message: "Register Complete"
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
        const { accessToken } = await (0, auth_service_1.loginUser)(email, password);
        res.status(200).json({
            success: true,
            accessToken
        });
    }
    catch (err) {
        next(err);
    }
}
async function getMeHandler(req, res) {
    res.status(200).json({
        success: true,
        user: req.user,
    });
}
//# sourceMappingURL=auth.controller.js.map