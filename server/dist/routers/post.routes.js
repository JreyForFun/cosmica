"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
const express_1 = require("express");
const post_controller_1 = require("../controllers/post.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
exports.postRouter = (0, express_1.Router)();
exports.postRouter.use(auth_middleware_1.authenticate);
exports.postRouter.post('/', post_controller_1.createUserPostHandler);
exports.postRouter.get('/', post_controller_1.getAllPostHandler);
exports.postRouter.get('/user', post_controller_1.getUserPostsHandler);
exports.postRouter.get('/:postId', post_controller_1.getPostByIdAndUserIdHandler);
exports.postRouter.put('/:postId', post_controller_1.updateUserPostHandler);
exports.postRouter.delete('/:postId', post_controller_1.deleteUserPostHandler);
//# sourceMappingURL=post.routes.js.map