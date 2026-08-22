import bcrypt from 'bcrypt';
import { AppError } from '../lib/errors';
import { signAccessToken } from '../lib/jwt';
import { UserTypes } from '../types/user.types';
import { findUserByEmail, createUser, findUserByEmailWithPassword } from '../repositories/user.repository';

export async function registerUser(username: string, email: string, password: string): Promise<void> {
  if(!email || !username || !password) {
    throw new AppError(400, "Email, username and password are required");
  }

  if(password.length < 6){
        throw new AppError(400, 'Password must be atleast 6 character')
  }

  const normalizeEmail = email.toLowerCase().trim();
  const existingUser = await findUserByEmail(normalizeEmail);
  if(existingUser) {
    throw new AppError(400, "Email already exists");
  }

  //const passwordHash = await bcrypt.hash(password, 10);

  await createUser(username, normalizeEmail, password);
}

export async function loginUser(email: string, password: string): Promise<{ accessToken: string }> {
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

  return { accessToken };
}

function createAccessTokenForUser(user: UserTypes): string{
    return signAccessToken({
        userId: user._id,
        email: user.email,
    })
}