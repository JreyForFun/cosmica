import { AppError } from "../lib/errors";
import { TokenPayLoad } from "../types/user.types";
import jwt, {SignOptions} from 'jsonwebtoken'

export function signAccessToken(payload: TokenPayLoad): string {
    const options: SignOptions = {
        expiresIn: process.env.JWT_ACCESS_EXPIRATION as SignOptions['expiresIn']
    }

    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, options)
}

export function verifyAccessToken(token: string): TokenPayLoad{
    try{
        return jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as TokenPayLoad
    }catch(err){
        throw new AppError(401, "Invalid or expires access token")
    }
}