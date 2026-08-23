import { loginUser, registerUser } from '../services/auth.service';
import { NextFunction, Request, Response } from 'express';


export async function registerUserHandler(req: Request, res: Response, next: NextFunction){
    try{
        const {username, email, password} = req.body
        await registerUser(username, email, password)
        res.status(201).json({
            success: true,
            message: "Register Complete"
        })
    }catch(error){
        next(error)
    }
};

export async function loginUserHandler(req: Request, res: Response, next: NextFunction){
    try {
        const { email, password } = req.body

        const { accessToken } = await loginUser(email, password)

        res.status(200).json({
            success: true,
            accessToken
        })
    } catch(err){
        next(err)
    }
}

export async function getMeHandler(req: Request, res: Response){
    res.status(200).json({
        success: true,
            user: req.user,
    })
}