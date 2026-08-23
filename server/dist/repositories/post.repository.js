"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPost = createPost;
exports.getPostsByUserId = getPostsByUserId;
exports.getAllPosts = getAllPosts;
exports.getPostByIdAndUserId = getPostByIdAndUserId;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
const post_model_1 = __importDefault(require("../models/post.model"));
async function createPost(title, tags, description, category, photoUrl, timeCaptured, userId) {
    // Implementation for creating a post
    const post = await post_model_1.default.create({
        title,
        tags,
        description,
        category,
        photoUrl,
        timeCaptured,
        createdBy: userId
    });
    const result = await post_model_1.default.findById(post._id)
        .select("_id title tags description category photoUrl timeCaptured createdBy createdAt updatedAt")
        .lean();
    return result;
}
async function getPostsByUserId(userId) {
    // Implementation for getting posts by user ID
    const result = await post_model_1.default.find({ createdBy: userId })
        .select("_id title tags description category photoUrl timeCaptured createdBy createdAt updatedAt")
        .lean();
    return result;
}
async function getAllPosts() {
    const result = await post_model_1.default.find({})
        .select("_id title tags description category photoUrl timeCaptured createdBy createdAt updatedAt")
        .sort({ createdAt: -1 })
        .lean();
    return result;
}
async function getPostByIdAndUserId(postId, userId) {
    // Implementation for getting a post by ID and user ID
    const result = await post_model_1.default.findOne({ _id: postId, createdBy: userId })
        .select("_id title tags description category photoUrl timeCaptured createdBy createdAt updatedAt")
        .lean();
    return result ?? null;
}
async function updatePost(postId, userId, updateData) {
    const result = await post_model_1.default.findOneAndUpdate({ _id: postId, createdBy: userId }, { $set: updateData }, { new: true, runValidators: true }).lean();
    return result ?? null;
}
async function deletePost(postId, userId) {
    const result = await post_model_1.default.deleteOne({ _id: postId, createdBy: userId });
    return result.deletedCount === 1;
}
//# sourceMappingURL=post.repository.js.map