export type PostTypes = {
    _id: string;
    title: string;
    tags: string[];
    description: string;
    category: string;
    photoUrl: string;
    timeCaptured: number;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}