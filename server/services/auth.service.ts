import bcrypt from 'bcrypt';
import { AppError } from '../lib/errors';
import { signAccessToken } from '../lib/jwt';
import { UserTypes } from '../types/user.types';
import {
  findUserByEmail,
  createUser,
  findUserByEmailWithPassword,
  findUserById,
  updateUserFavorites,
} from '../repositories/user.repository';

export async function registerUser(username: string, email: string, password: string): Promise<UserTypes> {
  if(!email || !username || !password) {
    throw new AppError(400, "Email, username and password are required");
  }

  if(password.length < 8){
        throw new AppError(400, 'Password must be at least 8 characters')
  }

  const normalizeEmail = email.toLowerCase().trim();
  const existingUser = await findUserByEmail(normalizeEmail);
  if(existingUser) {
    throw new AppError(400, "Email already exists");
  }

  const createdUser = await createUser(username, normalizeEmail, password);
  if(!createdUser) {
    throw new AppError(500, 'Unable to create user');
  }

  return createdUser;
}

export async function loginUser(email: string, password: string): Promise<{ accessToken: string; user: UserTypes }> {
  if(!email || !password) {
    throw new AppError(400, "Email and password are required");
  }
  const normalizeEmail = email.toLocaleLowerCase().trim()
  const user = await findUserByEmailWithPassword(normalizeEmail)
  if(!user?.password){
    throw new AppError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if(!isPasswordValid){
    throw new AppError(401, "Invalid email or password");
  }

  const accessToken = signAccessToken({userId: user._id, email: user.email});

  return {
    accessToken,
    user: {
      _id: user._id,
      email: user.email,
      username: user.username,
      favorites: user.favorites ?? [],
      createdAt: user.createdAt,
    },
  };
}

export async function toggleFavorite(userId: string, favorite: string): Promise<{ favorites: string[] }> {
  const normalizedFavorite = favorite?.trim();

  if (!normalizedFavorite) {
    throw new AppError(400, 'Favorite value is required');
  }

  const user = await findUserById(userId);
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const currentFavorites = user.favorites ?? [];
  const nextFavorites = currentFavorites.includes(normalizedFavorite)
    ? currentFavorites.filter((item) => item !== normalizedFavorite)
    : [...currentFavorites, normalizedFavorite];

  const updatedUser = await updateUserFavorites(userId, nextFavorites);

  return {
    favorites: updatedUser?.favorites ?? nextFavorites,
  };
}

function createAccessTokenForUser(user: UserTypes): string{
    return signAccessToken({
        userId: user._id,
        email: user.email,
    })
}