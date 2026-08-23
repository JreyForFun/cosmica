import Post from "../models/post.model";
import { PostTypes } from "../types/post.types";

export async function createPost(
  title: string,
  tags: string[],
  description: string,
  category: string,
  photoUrl: string,
  timeCaptured: number,
  userId: string
): Promise<PostTypes> {
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

  return result!;
}

export async function getPostsByUserId(userId: string): Promise<PostTypes[]> {
  // Implementation for getting posts by user ID
  const result = await Post.find({ createdBy: userId })
    .select("_id title tags description category photoUrl timeCaptured createdBy createdAt updatedAt")
    .lean<PostTypes[]>();

  return result;
}

export async function getAllPosts(): Promise<PostTypes[]> {
  const result = await Post.find({})
    .select("_id title tags description category photoUrl timeCaptured createdBy createdAt updatedAt")
    .sort({ createdAt: -1 })
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
  updateData: Partial<PostTypes>
): Promise<PostTypes | null> {
  const result = await Post.findOneAndUpdate(
    { _id: postId, createdBy: userId },
    { $set: updateData },
    { new: true, runValidators: true }
  ).lean<PostTypes>();

  return result ?? null;
}

export async function deletePost(postId: string, userId: string): Promise<boolean> {
  const result = await Post.deleteOne({ _id: postId, createdBy: userId });
  return result.deletedCount === 1;
}