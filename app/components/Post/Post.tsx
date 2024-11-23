"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart } from "./Icons/Heart";
import { Reposts } from "./Icons/Reposts";
import { Replies } from "./Icons/Replies";
import { Verified } from "./Icons/Verified";

type PostsProps = {
    id: string;
    name: string;
    username: string;
    timestamp: string;
    content: string;
    likes?: number;
    reposts?: number;
    replies?: number;
    avatar?: string;
    verified?: boolean;
    isLiked?: boolean;
};

async function fetchHasUserLiked(props: { id: string; username: string }) {
    const response = await fetch("/api/post/has-liked", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            postID: props.id,
            userID: props.username,
        }),
    });

    return (await response.json()) as {
        hasLiked: boolean;
    };
}

export function Post(props: PostsProps) {
    const router = useRouter();
    const [hasLiked, setHasLiked] = useState(props.isLiked!);
    const [numOfLikes, setNumOfLikes] = useState(props.likes);

    async function likePost() {
        const response = await fetch("/api/post/like", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                postID: props.id,
                userID: props.username,
                likes: props.likes,
            }),
        });

        const likesResp = await response.json();

        setNumOfLikes(likesResp.newLikes);
        setHasLiked((prev) => !prev);
    }

    return (
        <>
            <div className="max-w-xl mx-auto bg-white dark:bg-[#13151a] border border-gray-200 dark:border-gray-800 rounded-lg p-4 my-4">
                <div className="flex items-start space-x-3">
                    <img
                        src={props.avatar}
                        alt={`${props.name}'s avatar`}
                        onClick={() => router.push(`/${props.username}`)}
                        className="w-12 h-12 rounded-full cursor-pointer"
                    />

                    <div className="flex-1">
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                                <span
                                    className="font-bold text-black dark:text-white cursor-pointer"
                                    onClick={() =>
                                        router.push(`/${props.username}`)
                                    }
                                >
                                    {props.name}
                                </span>
                                {props.verified ? <Verified /> : ""}
                            </div>
                            <span
                                onClick={() =>
                                    router.push(`/${props.username}`)
                                }
                                className="font-bold text-black dark:text-white cursor-pointer"
                            >
                                @{props.username}
                            </span>
                            <span className="text-gray-400">.</span>
                            <span className="text-gray-400">
                                {props.timestamp}
                            </span>
                        </div>

                        <p className="mt-2 text-black dark:text-white">
                            {props.content}
                        </p>

                        <div className="flex items-center justify-start space-x-10 mt-3">
                            <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-500 group">
                                <Replies />
                                <span>{props.replies}</span>
                            </button>
                            <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-500 group">
                                <Reposts />
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
                    </div>
                </div>
            </div>
        </>
    );
}
