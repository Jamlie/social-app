"use client";

import {
    collection,
    DocumentReference,
    getDoc,
    getFirestore,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { app } from "~/app/lib/firebaseClient";
import { Post } from "./Post";
import { PostSkeleton } from "./PostSkeleton";

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
    image?: string;
};

type PostsFetcherProps = {
    currentUser: string;
    visitedUserId?: string;
    location: "home" | "profile";
    currentUserId: string;
};

export function PostsFetcher({
    visitedUserId,
    location,
    currentUser,
    currentUserId,
}: PostsFetcherProps) {
    const [posts, setPosts] = useState<(PostData | null)[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const db = getFirestore(app);

        const postsQuery = query(
            collection(db, "posts"),
            orderBy("createdAt", "desc"),
        );

        const unsubscribe = onSnapshot(postsQuery, async (querySnapshot) => {
            const postsData = await Promise.all(
                querySnapshot.docs.map(async (doc) => {
                    const data = doc.data() as PostData;

                    const userDoc = await getDoc(data.userRef);
                    const userData = userDoc.data();

                    if (userData?.isDeleted) {
                        return null;
                    }

                    return {
                        id: doc.id,
                        ...data,
                        username: userData?.username,
                    };
                }),
            );

            const filteredPosts =
                location === "profile"
                    ? postsData.filter(
                          (post) => post?.username === visitedUserId,
                      )
                    : postsData;

            if (filteredPosts) {
                setPosts(filteredPosts);
            }
            setLoading(false);
        });

        return () => {
            unsubscribe();
        };
    }, [visitedUserId, location]);

    if (loading) {
        return (
            <div>
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
            </div>
        );
    }

    return (
        <>
            {posts.map((post) => {
                if (!post) {
                    return null;
                }

                let isLiked = post.likers[currentUser];
                return (
                    <Post
                        key={post.postID}
                        id={post.postID!}
                        userRef={post.userRef!}
                        content={post.content!}
                        verified={false}
                        image={post.image}
                        timestamp={new Date(
                            post.createdAt.seconds! * 1000,
                        ).toLocaleString()}
                        replies={post.replies}
                        reposts={post.reposts}
                        likes={post.likes}
                        isLiked={isLiked ? true : false}
                        currentUserID={currentUserId}
                    />
                );
            })}
        </>
    );
}
