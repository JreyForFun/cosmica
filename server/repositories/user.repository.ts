import User from '../models/user.model';
import { UserTypes, DBUserRow, DBUserWithPasswordRow } from '../types/user.types';

export async function findUserByEmail(email: string): Promise<UserTypes | null> {
  // Implementation for finding user by email
  const result = await User.findOne({email})
    .select("_id email username favorites createdAt")
    .lean<UserTypes>();
  return result ?? null;
}

export async function findUserById(userId: string): Promise<UserTypes | null> {
  const result = await User.findById(userId)
    .select("_id email username photoUrl favorites createdAt")
    .lean<UserTypes>();

  return result ?? null;
}

export async function createUser(
    username: string,
    email: string,
    passwordHash: string,
): Promise<UserTypes | null> {
    const user = await User.create(
        {username, email, password: passwordHash}
    )

    const result = await User.findById(user._id)
    .select("_id email username favorites photoUrl createdAt")
    .lean<UserTypes>();
    return result ?? null
}

export async function updateUserFavorites(
  userId: string,
  favorites: string[],
): Promise<UserTypes | null> {
  const result = await User.findByIdAndUpdate(
    userId,
    { favorites },
    { new: true },
  )
    .select("_id email username favorites createdAt")
    .lean<UserTypes>();

  return result ?? null;
}

export async function findUserByEmailWithPassword(email: string): Promise<DBUserWithPasswordRow | null> {
  // Implementation for finding user by email with password
    const result = await User.findOne({email})
      .select("_id email username password photoUrl favorites createdAt")
      .lean<DBUserWithPasswordRow>();

    return result ?? null
}