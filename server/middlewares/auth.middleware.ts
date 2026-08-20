import User from "../models/user.model";
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1]

            const decoded = jwt.verify(token, process.env.JWT_SECRET as string)

            req.user = await User.findById(decoded.id).select("-password")

            return next()
        } catch (error as Error) {
            console.error("Token verification failed", error.message)
            return res.status(401).json({
                success: false,
                message: "Not authorized, token failed"
            })
        }
    }
    return res.status(401).json({
        success: false,
        message: "Not authorized, token failed"
    })
}