"use client";

import {
    collection,
    DocumentReference,
    getFirestore,
    onSnapshot,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { app } from "~/app/lib/firebaseClient";
import { Post } from "./Post";

type PostData = {
    postID: string;
    content: string;
    userRef: DocumentReference;
    likes: number;
    replies: number;
    reposts: number;
    createdAt: {
        seconds: number;
        nanoseconds: number;
    };
    likers: Record<string, any>;
};

type PostsFetcherProps = {
    currentUser: string;
    visitedUserId?: string;
    location: "home" | "profile";
};

export function PostsFetcher({
    visitedUserId,
    location,
    currentUser,
}: PostsFetcherProps) {
    const [posts, setPosts] = useState<PostData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const db = getFirestore(app);
        const postsQuery =
            location === "home"
                ? query(collection(db, "posts"), orderBy("createdAt", "desc"))
                : query(
                      collection(db, "posts"),
                      where("username", "==", visitedUserId),
                      orderBy("createdAt", "desc"),
                  );

        const unsubscribe = onSnapshot(postsQuery, (querySnapshot) => {
            const postsData = querySnapshot.docs.map((doc) => {
                const data = doc.data() as PostData;
                return {
                    id: doc.id,
                    ...data,
                };
            });
            setPosts(postsData);
            setLoading(false);
        });

        return () => {
            unsubscribe();
        };
    }, [visitedUserId, location]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {posts.map((post) => {
                let isLiked = post.likers[currentUser];
                return (
                    <Post
                        key={post.postID}
                        id={post.postID}
                        userRef={post.userRef}
                        content={post.content}
                        verified={false}
                        timestamp={new Date(
                            post.createdAt.seconds * 1000,
                        ).toLocaleString()}
                        replies={post.replies}
                        reposts={post.reposts}
                        likes={post.likes}
                        isLiked={isLiked ? true : false}
                    />
                );
            })}
        </>
    );
}
