"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserPostHandler = createUserPostHandler;
exports.getUserPostsHandler = getUserPostsHandler;
exports.getAllPostHandler = getAllPostHandler;
exports.getPostByIdAndUserIdHandler = getPostByIdAndUserIdHandler;
exports.updateUserPostHandler = updateUserPostHandler;
exports.deleteUserPostHandler = deleteUserPostHandler;
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
async function getAllPostHandler(req, res, next) {
    try {
        const { search } = req.query;
        const filter = search ? { search: String(search) } : undefined;
        const posts = await (0, post_service_1.getAllPosts)(filter);
        res.status(200).json({
            success: true,
            posts,
        });
    }
    catch (e) {
        next(e);
    }
}
async function getPostByIdAndUserIdHandler(req, res, next) {
    try {
        if (!req.user) {
            throw new errors_1.AppError(401, "Authentication is required");
        }
        const { postId } = req.params;
        if (typeof postId !== 'string' || !postId.trim()) {
            throw new errors_1.AppError(400, "Post ID is required");
        }
        const post = await (0, post_service_1.getPostByIdAndUserId)(postId, req.user.userId);
        if (!post) {
            throw new errors_1.AppError(404, "Post not found");
        }
        res.status(200).json({
            success: true,
            post
        });
    }
    catch (e) {
        next(e);
    }
}
async function updateUserPostHandler(req, res, next) {
    try {
        if (!req.user) {
            throw new errors_1.AppError(401, "Authentication is required");
        }
        const { postId } = req.params;
        if (typeof postId !== 'string' || !postId.trim()) {
            throw new errors_1.AppError(400, "Post ID is required");
        }
        const { title, tags, description, category, photoUrl, timeCaptured } = req.body;
        const post = await (0, post_service_1.updateUserPost)(postId, req.user.userId, {
            title,
            tags,
            description,
            category,
            photoUrl,
            timeCaptured,
        });
        if (!post) {
            throw new errors_1.AppError(404, "Post not found or you are not authorized to update it");
        }
        res.status(200).json({
            success: true,
            post
        });
    }
    catch (error) {
        next(error);
    }
}
async function deleteUserPostHandler(req, res, next) {
    try {
        if (!req.user) {
            throw new errors_1.AppError(401, "Authentication is required");
        }
        const { postId } = req.params;
        const { userId } = req.user;
        if (typeof postId !== 'string' || !postId.trim()) {
            throw new errors_1.AppError(400, "Post ID is required");
        }
        await (0, post_service_1.deleteUserPost)(userId, postId);
        res.status(200).json({
            success: true,
            message: "Post deleted successfully"
        });
    }
    catch (e) {
        next(e);
    }
}
//# sourceMappingURL=post.controller.js.map