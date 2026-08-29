import { NextFunction, Request, Response } from "express";
import {
  createUserPost,
  getUserPosts,
  getAllPosts,
  getPostByIdAndUserId,
  updateUserPost,
  deleteUserPost
} from "../services/post.service";
import { AppError } from "../lib/errors";

export async function createUserPostHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AppError(401, "Authentication is required");
    }

    const { title, tags, description, category, photoUrl, timeCaptured } =
      req.body;
    const post = await createUserPost(
      title,
      tags,
      description,
      category,
      photoUrl,
      timeCaptured,
      req.user.userId,
    );

    res.status(201).json({
      success: true,
        post
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserPostsHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AppError(401, "Authentication is required");
    }

    const posts = await getUserPosts(req.user.userId);

    res.status(200).json({
      success: true,
        posts
    });
  } catch (e) {
    next(e);
  }
}

export async function getAllPostHandler(
  req: Request,
  res: Response,
  next: NextFunction,){
    try {
      const { search } = req.query;
      const filter = search ? { search: String(search) } : undefined;
      const posts = await getAllPosts(filter);
  
      res.status(200).json({
        success: true,
        posts,
      });
    } catch(e){
      next(e);
    }
  }

export async function getPostByIdAndUserIdHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AppError(401, "Authentication is required");
    }

    const { postId } = req.params;
    if(typeof postId !== 'string' || !postId.trim()){
      throw new AppError(400, "Post ID is required");
    }
    
    const post = await getPostByIdAndUserId(postId, req.user.userId);

    if (!post) {
      throw new AppError(404, "Post not found");
    }

    res.status(200).json({
      success: true,
        post
    });
  } catch (e) {
    next(e);
  }
}

export async function updateUserPostHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AppError(401, "Authentication is required");
    }

    const { postId } = req.params;
    if(typeof postId !== 'string' || !postId.trim()){
      throw new AppError(400, "Post ID is required");
    }

    const { title, tags, description, category, photoUrl, timeCaptured } =
      req.body;
    const post = await updateUserPost(postId, req.user.userId, {
      title,
      tags,
      description,
      category,
      photoUrl,
      timeCaptured,
    });

    if(!post){
      throw new AppError(404, "Post not found or you are not authorized to update it");
    }
    res.status(200).json({
      success: true,
        post
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteUserPostHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try{
    if (!req.user) {
      throw new AppError(401, "Authentication is required");
    }
    const { postId } = req.params;
    const { userId } = req.user
    if(typeof postId !== 'string' || !postId.trim()){
      throw new AppError(400, "Post ID is required");
    }
    await deleteUserPost(userId, postId);
    res.status(200).json({
      success: true,
      message: "Post deleted successfully"
    });
  } catch(e){
    next(e);
  }
}