export type Post = {
    postID?: string;
    userID?: string;
    username?: string;
    name?: string;
    content?: string;
    likes?: number;
    replies?: number;
    reposts?: number;
    likers?: Record<string, any>;
    createdAt?: Date;
};

export type Like = {
    postID: string;
    userID: string;
    likes: number;
};
