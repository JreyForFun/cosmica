import { TokenPayLoad } from "./users.types.ts";

declare global {
    namespace Express {
        interface Request {
            user?: TokenPayLoad
        }
    }
}

export {};