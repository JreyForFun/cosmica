import { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/errors";
import { verifyAccessToken } from "../lib/jwt";


export function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
): void{
    const authHeader = req.headers.authorization

    if(!authHeader?.startsWith("Bearer ")){
        next(new AppError(401, "Access token is required"))
        return
    }

    const token = authHeader.split(" ")[1]

    req.user = verifyAccessToken(token)

    next()
}