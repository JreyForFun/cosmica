import { loginUser, registerUser, toggleFavorite } from '../services/auth.service';
import { NextFunction, Request, Response } from 'express';
import { signAccessToken } from '../lib/jwt';
import { AppError } from '../lib/errors';
import { findUserById } from '../repositories/user.repository';


export async function registerUserHandler(req: Request, res: Response, next: NextFunction){
    try{
        const {username, email, password} = req.body
        const user = await registerUser(username, email, password)
        const accessToken = signAccessToken({ userId: user._id, email: user.email })

        res.status(201).json({
            success: true,
            message: "Register Complete",
            accessToken,
            user,
        })
    }catch(error){
        next(error)
    }
};

export async function loginUserHandler(req: Request, res: Response, next: NextFunction){
    try {
        const { email, password } = req.body

        const { accessToken, user } = await loginUser(email, password)

        res.status(200).json({
            success: true,
            accessToken,
            user,
        })
    } catch(err){
        next(err)
    }
}

export async function getMeHandler(req: Request, res: Response, next: NextFunction){
    try {
        if (!req.user) {
            throw new AppError(401, 'Authentication is required');
        }

        const user = await findUserById(req.user.userId);
        if (!user) {
            throw new AppError(404, 'User not found');
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        next(error);
    }
}

export async function toggleFavoriteHandler(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw new AppError(401, 'Authentication is required');
        }

        const { favorite, category } = req.body ?? {};
        const normalizedCategory = category === 'elcovek' || category === 'vibteo' || category === 'apod'
          ? category
          : 'apod';

        const { favorites } = await toggleFavorite(req.user.userId, favorite, normalizedCategory);

        res.status(200).json({
            success: true,
            favorites,
        });
    } catch (error) {
        next(error);
    }
}