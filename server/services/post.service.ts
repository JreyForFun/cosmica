import { AppError } from "../lib/errors";
import NodeCache from "node-cache";
import { PostTypes } from "../types/post.types";
import {
  createPost,
  getAllPosts as getAllPostsFromDatabase,
  getPostsByUserId,
  getPostByIdAndUserId as fetchPostByIdAndUserId,
  updatePost,
  deletePost
} from "../repositories/post.repository";

const cache = new NodeCache({ stdTTL: 60 }); // cache entries expire after 60s
const TASK_CACHE_TTL = 60;

function validateTitle(title: string): string{
    if(typeof title !== 'string' || !title.trim()){
        throw new AppError(400, "Title is required");
    }

    const trimmedTitle = title.trim();
    if(trimmedTitle.length < 3 || trimmedTitle.length > 100){
        throw new AppError(400, "Title must be between 3 and 100 characters");
    }
    return trimmedTitle;
}

export async function createUserPost(
    title: string,
    tags: string[],
    description: string,
    category: string,
    photoUrl: string,
    timeCaptured: number,
    userId: string
): Promise<PostTypes> {
    const validatedTitle = validateTitle(title);
  const post = await createPost(validatedTitle, tags, description, category, photoUrl, timeCaptured, userId);
  cache.del("posts:all");
  return post;
}

export async function getUserPosts(userId: string): Promise<PostTypes[]>{
  return getPostsByUserId(userId);
}

export async function getAllPosts(
  filter?: { search?: string }
): Promise<PostTypes[]> {
  const cacheKey = "posts:all";
  let posts: PostTypes[];

  // 1. Check in-memory cache first
  const cachedPosts = cache.get<PostTypes[]>(cacheKey);

  if (cachedPosts) {
    console.log(`Cache HIT: ${cacheKey}`);
    posts = cachedPosts;
  } else {
    console.log(`Cache MISS: ${cacheKey}`);
    posts = await getAllPostsFromDatabase();
    cache.set(cacheKey, posts, TASK_CACHE_TTL);
  }

  // 2. Fast in-memory filter
  if (filter?.search?.trim()) {
    const searchLower = filter.search.trim().toLowerCase();
    return posts.filter(post => post.title.toLowerCase().includes(searchLower));
  }

  return posts;
}

export async function getPostByIdAndUserId(
  postId: string, userId: string
): Promise<PostTypes | null> {
  const cacheKey = `post:${postId}:id:${userId}`;
  const cachedPosts = cache.get<PostTypes | null>(cacheKey);

  if (cachedPosts) {
    console.log(`Cache HIT: ${cacheKey}`);
    return cachedPosts;
  }
  console.log(`Cache MISS: ${cacheKey}`);
  const post = await fetchPostByIdAndUserId(postId, userId);
  if(post){
    cache.set(cacheKey, post, TASK_CACHE_TTL);
  }
  return post;
}

export async function updateUserPost(
  postId: string,
  userId: string,
  updateData: Partial<PostTypes>
): Promise<PostTypes | null> {
  const validTitle = updateData.title === undefined
    ? undefined
    : validateTitle(updateData.title);
  const post = await updatePost(postId, userId, {
    ...updateData,
    ...(validTitle === undefined ? {} : { title: validTitle }),
  });
  if(!post){
    throw new AppError(404, "Post not found or you are not authorized to update it");
  }
  cache.del(`post:${postId}:id:${userId}`);
  cache.del("posts:all");
  return post;
}

export async function deleteTaskCache(
  userId: string, taskId?: string
): Promise<void> {
  await cache.del(`post:id:${userId}`);
  if(taskId){
    await cache.del(`post:${taskId}:id:${userId}`);
  }
  console.log(`Cache cleared for userId: ${userId}, taskId: ${taskId || "N/A"}`);
}

export async function deleteUserPost(
  userId: string, postId: string
): Promise<void> {
  const deleted = await deletePost(postId, userId);
  if(!deleted){
    throw new AppError(404, "Post not found or you are not authorized to delete it");
  }
  await deleteTaskCache(userId, postId);
  cache.del("posts:all");
}