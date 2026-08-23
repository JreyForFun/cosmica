"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
const bcrypt_1 = __importDefault(require("bcrypt"));
const errors_1 = require("../lib/errors");
const jwt_1 = require("../lib/jwt");
const user_repository_1 = require("../repositories/user.repository");
async function registerUser(username, email, password) {
    if (!email || !username || !password) {
        throw new errors_1.AppError(400, "Email, username and password are required");
    }
    if (password.length < 6) {
        throw new errors_1.AppError(400, 'Password must be atleast 6 character');
    }
    const normalizeEmail = email.toLowerCase().trim();
    const existingUser = await (0, user_repository_1.findUserByEmail)(normalizeEmail);
    if (existingUser) {
        throw new errors_1.AppError(400, "Email already exists");
    }
    //const passwordHash = await bcrypt.hash(password, 10);
    await (0, user_repository_1.createUser)(username, normalizeEmail, password);
}
async function loginUser(email, password) {
    if (!email || !password) {
        throw new errors_1.AppError(400, "Email and password are required");
    }
    const normalizeEmail = email.toLocaleLowerCase().trim();
    const user = await (0, user_repository_1.findUserByEmailWithPassword)(normalizeEmail);
    if (!user?.password) {
        throw new errors_1.AppError(401, "Invalid email or password");
    }
    const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new errors_1.AppError(401, "Invalid email or password");
    }
    const accessToken = (0, jwt_1.signAccessToken)({ userId: user._id, email: user.email });
    return { accessToken };
}
function createAccessTokenForUser(user) {
    return (0, jwt_1.signAccessToken)({
        userId: user._id,
        email: user.email,
    });
}
//# sourceMappingURL=auth.service.js.map