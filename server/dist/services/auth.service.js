"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.toggleFavorite = toggleFavorite;
const bcrypt_1 = __importDefault(require("bcrypt"));
const errors_1 = require("../lib/errors");
const jwt_1 = require("../lib/jwt");
const user_repository_1 = require("../repositories/user.repository");
const emptyFavorites = () => ({
    apod: [],
    elcovek: [],
    vibteo: [],
});
async function registerUser(username, email, password) {
    if (!email || !username || !password) {
        throw new errors_1.AppError(400, "Email, username and password are required");
    }
    if (password.length < 8) {
        throw new errors_1.AppError(400, 'Password must be at least 8 characters');
    }
    const normalizeEmail = email.toLowerCase().trim();
    const existingUser = await (0, user_repository_1.findUserByEmail)(normalizeEmail);
    if (existingUser) {
        throw new errors_1.AppError(400, "Email already exists");
    }
    const createdUser = await (0, user_repository_1.createUser)(username, normalizeEmail, password);
    if (!createdUser) {
        throw new errors_1.AppError(500, 'Unable to create user');
    }
    return createdUser;
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
    const favorites = user.favorites && typeof user.favorites === 'object'
        ? {
            apod: Array.isArray(user.favorites.apod) ? user.favorites.apod : [],
            elcovek: Array.isArray(user.favorites.elcovek) ? user.favorites.elcovek : [],
            vibteo: Array.isArray(user.favorites.vibteo) ? user.favorites.vibteo : [],
        }
        : emptyFavorites();
    return {
        accessToken,
        user: {
            _id: user._id,
            email: user.email,
            username: user.username,
            favorites,
            createdAt: user.createdAt,
        },
    };
}
async function toggleFavorite(userId, favorite, category = 'apod') {
    const normalizedFavorite = favorite?.trim();
    if (!normalizedFavorite) {
        throw new errors_1.AppError(400, 'Favorite value is required');
    }
    const user = await (0, user_repository_1.findUserById)(userId);
    if (!user) {
        throw new errors_1.AppError(404, 'User not found');
    }
    const currentFavorites = user.favorites && typeof user.favorites === 'object'
        ? {
            apod: Array.isArray(user.favorites.apod) ? user.favorites.apod : [],
            elcovek: Array.isArray(user.favorites.elcovek) ? user.favorites.elcovek : [],
            vibteo: Array.isArray(user.favorites.vibteo) ? user.favorites.vibteo : [],
        }
        : emptyFavorites();
    const selectedFavorites = currentFavorites[category] ?? [];
    const nextCategoryFavorites = selectedFavorites.includes(normalizedFavorite)
        ? selectedFavorites.filter((item) => item !== normalizedFavorite)
        : [...selectedFavorites, normalizedFavorite];
    const nextFavorites = {
        apod: [...(currentFavorites.apod ?? [])],
        elcovek: [...(currentFavorites.elcovek ?? [])],
        vibteo: [...(currentFavorites.vibteo ?? [])],
    };
    nextFavorites[category] = nextCategoryFavorites;
    const updatedUser = await (0, user_repository_1.updateUserFavorites)(userId, nextFavorites);
    return {
        favorites: updatedUser?.favorites ?? nextFavorites,
    };
}
function createAccessTokenForUser(user) {
    return (0, jwt_1.signAccessToken)({
        userId: user._id,
        email: user.email,
    });
}
//# sourceMappingURL=auth.service.js.map