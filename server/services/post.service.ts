import { AppError } from "../lib/errors";
import NodeCache from "node-cache";
import { PostTypes } from "../types/post.types";
import {
  createPost,
  getAllPosts as getAllPostsFromDatabase,
  getPostsByUserId,
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
    return createPost(validatedTitle, tags, description, category, photoUrl, timeCaptured, userId);
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