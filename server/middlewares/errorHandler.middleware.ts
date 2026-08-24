import { NextFunction, Request, Response } from "express";
import { logger } from '../lib/logger'
import { AppError } from "../lib/errors";

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction 
): void {
    if(err instanceof AppError){
        res.status(err.statusCode).json({
            success: false,
            message: err.message
        })
        return;
    }
    logger.error({err}, "Unhandled error")


    res.status(500).json({
        success: false,
        message: "Internal server error"
    })
}