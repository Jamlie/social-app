import { DocumentReference } from "firebase-admin/firestore";

export type Post = {
    postID: string;
    userRef?: DocumentReference;
    content?: string;
    likes?: number;
    replies?: number;
    reposts?: number;
    likers?: Record<string, any>;
    createdAt?: Date;
    image?: string | null;
};

export type Like = {
    postID: string;
    userID: string;
    likes: number;
};

export type User = {
    uid: string;
    name: string;
    username: string;
    email: string;
    pfp: string;
    bio: string;
    following: string[];
    followers: string[];
    blockedUsers: string[];
    blockedBy: string[];
    isDeleted?: boolean;
};
