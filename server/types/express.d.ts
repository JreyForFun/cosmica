import { TokenPayLoad } from "./user.types";

declare global {
    namespace Express {
        interface Request {
            user?: TokenPayLoad
        }
    }
}

export {};