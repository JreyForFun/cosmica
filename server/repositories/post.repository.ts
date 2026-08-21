import User from "../models/user.model";
import Post from "../models/post.model";
import { UserTypes, DBUserRow, DBUserWithPasswordRow } from "../types/user.types";
import { PostTypes } from "../types/post.types";

export async function createPost(
  title: string,
  tags: string[],
  description: string,
  category: string,
  photoUrl: string,
  timeCaptured: number,
  userId: string
): Promise<PostTypes | null> {
  // Implementation for creating a post
  const post = await Post.create({
    title,
    tags,
    description,
    category,
    photoUrl,
    timeCaptured,
    createdBy: userId
  });

  const result = await Post.findById(post._id)
    .select("_id title tags description category photoUrl timeCaptured createdBy createdAt updatedAt")
    .lean<PostTypes>();

  return result ?? null;
}

export async function getPostsByUserId(userId: string): Promise<PostTypes[]> {
  // Implementation for getting posts by user ID
  const result = await Post.find({ createdBy: userId })
    .select("_id title tags description category photoUrl timeCaptured createdBy createdAt updatedAt")
    .lean<PostTypes[]>();

  return result;
}

export async function getPostByIdAndUserId(postId: string, userId: string): Promise<PostTypes | null> {
  // Implementation for getting a post by ID and user ID
  const result = await Post.findOne({ _id: postId, createdBy: userId })
    .select("_id title tags description category photoUrl timeCaptured createdBy createdAt updatedAt")
    .lean<PostTypes>();

  return result ?? null;
}

export async function updatePost(
  postId: string,
  userId: string,
  title?: string,
  tags?: string[],
  description?: string,
  category?: string,
  photoUrl?: string,
  timeCaptured?: number
): Promise<PostTypes | null> {
  const post = await Post.findById(postId);
  if (!post) return null;

  // Optional: ensure only the owner can update
  if (post.createdBy.toString() !== userId) {
    return null; // or throw an error
  }

  post.title = title ?? post.title;
  post.tags = tags ?? post.tags;
  post.description = description ?? post.description;
  post.category = category ?? post.category;
  post.photoUrl = photoUrl ?? post.photoUrl;
  post.timeCaptured = timeCaptured ?? post.timeCaptured;

  await post.save();

  const result = await Post.findById(post._id)
    .select("_id title tags description category photoUrl timeCaptured createdBy createdAt updatedAt")
    .lean<PostTypes>();

  return result ?? null;
}

export async function deletePost(postId: string, userId: string): Promise<boolean> {
  const result = await Post.deleteOne({ _id: postId, createdBy: userId });
  return result.deletedCount === 1;
}