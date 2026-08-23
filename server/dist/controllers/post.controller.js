"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserPostHandler = createUserPostHandler;
exports.getUserPostsHandler = getUserPostsHandler;
const post_service_1 = require("../services/post.service");
const errors_1 = require("../lib/errors");
async function createUserPostHandler(req, res, next) {
    try {
        if (!req.user) {
            throw new errors_1.AppError(401, "Authentication is required");
        }
        const { title, tags, description, category, photoUrl, timeCaptured } = req.body;
        const post = await (0, post_service_1.createUserPost)(title, tags, description, category, photoUrl, timeCaptured, req.user.userId);
        res.status(201).json({
            success: true,
            data: {
                post,
            },
        });
    }
    catch (error) {
        next(error);
    }
}
async function getUserPostsHandler(req, res, next) {
    try {
        if (!req.user) {
            throw new errors_1.AppError(401, "Authentication is required");
        }
        const posts = await (0, post_service_1.getUserPosts)(req.user.userId);
        res.status(200).json({
            success: true,
            posts
        });
    }
    catch (e) {
        next(e);
    }
}
//# sourceMappingURL=post.controller.js.map