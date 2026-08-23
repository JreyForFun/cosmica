"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const errors_1 = require("../lib/errors");
const jwt_1 = require("../lib/jwt");
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        next(new errors_1.AppError(401, "Access token is required"));
        return;
    }
    const token = authHeader.split(" ")[1];
    req.user = (0, jwt_1.verifyAccessToken)(token);
    next();
}
//# sourceMappingURL=auth.middleware.js.map