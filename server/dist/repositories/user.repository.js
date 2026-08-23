"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByEmail = findUserByEmail;
exports.createUser = createUser;
exports.findUserByEmailWithPassword = findUserByEmailWithPassword;
const user_model_1 = __importDefault(require("../models/user.model"));
async function findUserByEmail(email) {
    // Implementation for finding user by email
    const result = await user_model_1.default.findOne({ email })
        .select("_id email username favorites createdAt")
        .lean();
    return result ?? null;
}
async function createUser(username, email, passwordHash) {
    const user = await user_model_1.default.create({ username, email, password: passwordHash });
    const result = await user_model_1.default.findById(user._id)
        .select("_id email username favorites createdAt")
        .lean();
    return result ?? null;
}
async function findUserByEmailWithPassword(email) {
    // Implementation for finding user by email with password
    const result = await user_model_1.default.findOne({ email })
        .select("_id email username password favorites createdAt")
        .lean();
    return result ?? null;
}
//# sourceMappingURL=user.repository.js.map