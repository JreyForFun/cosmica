"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByEmail = findUserByEmail;
exports.findUserById = findUserById;
exports.createUser = createUser;
exports.updateUserFavorites = updateUserFavorites;
exports.findUserByEmailWithPassword = findUserByEmailWithPassword;
const user_model_1 = __importDefault(require("../models/user.model"));
async function findUserByEmail(email) {
    const result = await user_model_1.default.findOne({ email })
        .select("_id email username favorites createdAt")
        .lean();
    return result ?? null;
}
async function findUserById(userId) {
    const result = await user_model_1.default.findById(userId)
        .select("_id email username photoUrl favorites createdAt")
        .lean();
    return result ?? null;
}
async function createUser(username, email, passwordHash) {
    const user = await user_model_1.default.create({ username, email, password: passwordHash });
    const result = await user_model_1.default.findById(user._id)
        .select("_id email username favorites photoUrl createdAt")
        .lean();
    return result ?? null;
}
async function updateUserFavorites(userId, favorites) {
    const result = await user_model_1.default.findByIdAndUpdate(userId, { favorites }, { new: true })
        .select("_id email username favorites createdAt")
        .lean();
    return result ?? null;
}
async function findUserByEmailWithPassword(email) {
    const result = await user_model_1.default.findOne({ email })
        .select("_id email username password photoUrl favorites createdAt")
        .lean();
    return result ?? null;
}
//# sourceMappingURL=user.repository.js.map