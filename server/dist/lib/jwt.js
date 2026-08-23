"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = signAccessToken;
exports.verifyAccessToken = verifyAccessToken;
const errors_1 = require("../lib/errors");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function signAccessToken(payload) {
    const options = {
        expiresIn: process.env.JWT_ACCESS_EXPIRATION
    };
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_ACCESS_SECRET, options);
}
function verifyAccessToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
    }
    catch (err) {
        throw new errors_1.AppError(401, "Invalid or expires access token");
    }
}
//# sourceMappingURL=jwt.js.map