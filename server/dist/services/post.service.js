"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserPost = createUserPost;
exports.getUserPosts = getUserPosts;
exports.getAllPosts = getAllPosts;
const errors_1 = require("../lib/errors");
const node_cache_1 = __importDefault(require("node-cache"));
const post_repository_1 = require("../repositories/post.repository");
const cache = new node_cache_1.default({ stdTTL: 60 }); // cache entries expire after 60s
const TASK_CACHE_TTL = 60;
function validateTitle(title) {
    if (typeof title !== 'string' || !title.trim()) {
        throw new errors_1.AppError(400, "Title is required");
    }
    const trimmedTitle = title.trim();
    if (trimmedTitle.length < 3 || trimmedTitle.length > 100) {
        throw new errors_1.AppError(400, "Title must be between 3 and 100 characters");
    }
    return trimmedTitle;
}
async function createUserPost(title, tags, description, category, photoUrl, timeCaptured, userId) {
    const validatedTitle = validateTitle(title);
    return (0, post_repository_1.createPost)(validatedTitle, tags, description, category, photoUrl, timeCaptured, userId);
}
async function getUserPosts(userId) {
    return (0, post_repository_1.getPostsByUserId)(userId);
}
async function getAllPosts(filter) {
    const cacheKey = "posts:all";
    let posts;
    // 1. Check in-memory cache first
    const cachedPosts = cache.get(cacheKey);
    if (cachedPosts) {
        console.log(`Cache HIT: ${cacheKey}`);
        posts = cachedPosts;
    }
    else {
        console.log(`Cache MISS: ${cacheKey}`);
        posts = await (0, post_repository_1.getAllPosts)();
        cache.set(cacheKey, posts, TASK_CACHE_TTL);
    }
    // 2. Fast in-memory filter
    if (filter?.search?.trim()) {
        const searchLower = filter.search.trim().toLowerCase();
        return posts.filter(post => post.title.toLowerCase().includes(searchLower));
    }
    return posts;
}
//# sourceMappingURL=post.service.js.map