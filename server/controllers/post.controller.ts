import { NextFunction, Request, Response } from "express";
import {
  createUserPost,
  getUserPosts,
  getAllPosts,
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
      data: {
        post,
      },
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
  res: Response,)