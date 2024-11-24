"use client";

import { useState } from "react";
import {
    getFirestore,
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove,
} from "firebase/firestore";
import { app } from "~/app/lib/firebaseClient";

type InteractionButtonsProps = {
    currentUserId: string;
    targetUserId: string;
    initialIsFollowing: boolean;
    initialIsBlocked: boolean;
};

export function InteractionButtons({
    currentUserId,
    targetUserId,
    initialIsFollowing,
    initialIsBlocked,
}: InteractionButtonsProps) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [isBlocked, setIsBlocked] = useState(initialIsBlocked);
    const [isLoading, setIsLoading] = useState(false);

    const handleFollow = async () => {
        if (isLoading || isBlocked) return;
        setIsLoading(true);

        const db = getFirestore(app);
        try {
            const currentUserRef = doc(db, "users", currentUserId);
            const targetUserRef = doc(db, "users", targetUserId);

            if (isFollowing) {
                await updateDoc(currentUserRef, {
                    following: arrayRemove(targetUserId),
                });
                await updateDoc(targetUserRef, {
                    followers: arrayRemove(currentUserId),
                });
            } else {
                await updateDoc(currentUserRef, {
                    following: arrayUnion(targetUserId),
                });
                await updateDoc(targetUserRef, {
                    followers: arrayUnion(currentUserId),
                });
            }

            setIsFollowing(!isFollowing);
        } catch (error) {
            console.error("Error updating follow status:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBlock = async () => {
        if (isLoading) return;
        setIsLoading(true);

        const db = getFirestore(app);
        try {
            const currentUserRef = doc(db, "users", currentUserId);
            const targetUserRef = doc(db, "users", targetUserId);

            if (isBlocked) {
                await updateDoc(currentUserRef, {
                    blockedUsers: arrayRemove(targetUserId),
                });
                await updateDoc(targetUserRef, {
                    blockedBy: arrayRemove(currentUserId),
                });
            } else {
                await updateDoc(currentUserRef, {
                    blockedUsers: arrayUnion(targetUserId),
                    following: arrayRemove(targetUserId),
                });
                await updateDoc(targetUserRef, {
                    blockedBy: arrayUnion(currentUserId),
                    followers: arrayRemove(currentUserId),
                });
                setIsFollowing(false);
            }

            setIsBlocked(!isBlocked);
        } catch (error) {
            console.error("Error updating block status:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={handleFollow}
                disabled={isLoading || isBlocked}
                className={`px-4 py-2 rounded-full font-medium ${
                    isFollowing
                        ? "bg-white text-black border border-gray-300 hover:bg-gray-100"
                        : "bg-black text-white hover:bg-gray-800"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                {isFollowing ? "Following" : "Follow"}
            </button>
            <button
                onClick={handleBlock}
                disabled={isLoading}
                className={`px-4 py-2 rounded-full font-medium ${
                    isBlocked
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-white text-red-600 border border-red-600 hover:bg-red-50"
                }`}
            >
                {isBlocked ? "Unblock" : "Block"}
            </button>
        </div>
    );
}
