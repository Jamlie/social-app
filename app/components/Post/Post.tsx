"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart } from "./Icons/Heart";
import { Verified } from "./Icons/Verified";
import { MessageCircle, Repeat2 } from "lucide-react";
import {
    collection,
    doc,
    DocumentReference,
    getDoc,
    getDocs,
    getFirestore,
} from "firebase/firestore";
import { app } from "~/app/lib/firebaseClient";
import { User } from "~/app/utils/types";
import { getDefaultPfp } from "~/app/utils/profile";
import { CommentSection } from "./CommentSection";
import NextImage from "next/image";
import { ImagePreview } from "./ImagePreview";

type PostsProps = {
    id: string;
    userRef: DocumentReference;
    timestamp: string;
    content: string;
    image?: string;
    likes?: number;
    reposts?: number;
    replies?: number;
    verified?: boolean;
    isLiked?: boolean;
};

export function Post(props: PostsProps) {
    const router = useRouter();
    const [hasLiked, setHasLiked] = useState(props.isLiked!);
    const [numOfLikes, setNumOfLikes] = useState(props.likes);
    const [numOfComments, setNumOfComments] = useState(props.replies);
    const [user, setUser] = useState<User | null>(null);
    const [showComments, setShowComments] = useState(false);
    const [modalPhoto, setModalPhoto] = useState<{
        url: string;
        id: string;
    } | null>(null);

    async function getUserData() {
        const db = getFirestore(app);
        const userDoc = doc(db, props.userRef.path);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
            setUser(userSnapshot.data() as User);
        }
    }

    async function likePost() {
        const response = await fetch("/api/post/like", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                postID: props.id,
                userID: user?.username,
                likes: props.likes,
            }),
        });

        const likesResp = await response.json();

        setNumOfLikes(likesResp.newLikes);
        setHasLiked((prev) => !prev);
    }

    async function fetchCommentCount() {
        const db = getFirestore(app);
        const commentsRef = collection(db, "posts", props.id, "comments");
        const commentsSnapshot = await getDocs(commentsRef);
        setNumOfComments(commentsSnapshot.size);
    }

    useEffect(() => {
        getUserData();
        fetchCommentCount();
    }, []);

    return (
        <>
            <div className="max-w-xl mx-auto bg-white dark:bg-background border border-gray-200 dark:border-gray-800 rounded-lg p-4 my-4">
                <div className="flex items-start space-x-3">
                    <img
                        src={user?.pfp || getDefaultPfp()}
                        alt={`${user?.name}'s avatar`}
                        onClick={() => router.push(`/${user?.username}`)}
                        className="w-12 h-12 rounded-full cursor-pointer"
                    />

                    <div className="flex-1">
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                                <span
                                    className="font-bold text-black dark:text-white cursor-pointer"
                                    onClick={() =>
                                        router.push(`/${user?.username}`)
                                    }
                                >
                                    {user?.name}
                                </span>
                                {props.verified ? <Verified /> : ""}
                            </div>
                            <span
                                onClick={() =>
                                    router.push(`/${user?.username}`)
                                }
                                className="font-bold text-black dark:text-white cursor-pointer"
                            >
                                @{user?.username}
                            </span>
                            <span className="text-gray-400">·</span>
                            <span className="text-gray-400">
                                {props.timestamp}
                            </span>
                        </div>

                        <p className="mt-2 text-black dark:text-white">
                            {props.content}
                        </p>

                        {props.image && (
                            <div className="mt-3 mb-3">
                                <NextImage
                                    src={props.image}
                                    alt="Post image"
                                    width={600}
                                    height={400}
                                    className="w-full max-h-96 object-cover rounded-lg cursor-pointer"
                                    priority
                                    onClick={() =>
                                        setModalPhoto({
                                            url: props.image!,
                                            id: props.id,
                                        })
                                    }
                                />
                            </div>
                        )}

                        <div className="flex items-center justify-start space-x-10 mt-3">
                            <button
                                className="flex items-center space-x-2 text-gray-400 hover:text-blue-500 group"
                                onClick={() => setShowComments(!showComments)}
                            >
                                <MessageCircle size={20} />
                                <span>{numOfComments}</span>
                            </button>
                            <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-500 group">
                                <Repeat2
                                    size={20}
                                    className={`group-hover:text-green-500`}
                                />
                                <span>{props.reposts}</span>
                            </button>
                            <button
                                className="flex items-center space-x-2 text-gray-400 hover:text-blue-500 group"
                                onClick={likePost}
                            >
                                <Heart hasLiked={hasLiked} />
                                <span>{numOfLikes}</span>
                            </button>
                        </div>

                        {showComments && <CommentSection postId={props.id} />}
                    </div>
                </div>
            </div>

            {modalPhoto && (
                <ImagePreview
                    photo={modalPhoto}
                    onClose={() => setModalPhoto(null)}
                    timestamp={props.timestamp}
                />
            )}
        </>
    );
}
