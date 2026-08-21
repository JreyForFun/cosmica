export type UserTypes = {
    _id: string;
    email: string;
    username: string;
    favorites: string[];
    createdAt: Date;
}

export type DBUserRow = {
    _id: string;
    email: string;
    username: string;
    favorites: string[];
    createdAt: Date;
}

export type DBUserWithPasswordRow = DBUserRow & {
    passwordHash: string | null
}

export type TokenPayLoad = {
    userId: string,
    email: string,
}