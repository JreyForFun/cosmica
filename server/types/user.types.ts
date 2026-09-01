export type FavoriteCategory = "apod" | "elcovek" | "vibteo";

export type FavoriteMap = {
    apod: string[];
    elcovek: string[];
    vibteo: string[];
};

export type UserTypes = {
    _id: string;
    email: string;
    username: string;
    photoUrl?: string;
    favorites: FavoriteMap;
    createdAt: Date;
}

export type DBUserRow = {
    _id: string;
    email: string;
    username: string;
    photoUrl?: string;
    favorites: FavoriteMap;
    createdAt: Date;
}

export type DBUserWithPasswordRow = DBUserRow & {
    password: string | null
}

export type TokenPayLoad = {
    userId: string,
    email: string,
}