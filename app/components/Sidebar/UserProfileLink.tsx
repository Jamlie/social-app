"use client";

import { doc, getDoc, getFirestore, onSnapshot } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { app } from "~/app/lib/firebaseClient";
import { getDefaultPfp } from "~/app/utils/profile";

type SidebarUserData = {
    username: string;
    name: string;
    pfp: string;
};

export function UserProfileLink({ userId }: { userId: string }) {
    const [userData, setUserData] = useState<SidebarUserData | null>(null);

    useEffect(() => {
        const db = getFirestore(app);
        const userDocRef = doc(db, "users", userId);

        const unsubscribe = onSnapshot(
            userDocRef,
            (docSnapshot) => {
                if (docSnapshot.exists()) {
                    setUserData(docSnapshot.data() as SidebarUserData);
                } else {
                    console.error("No such user found!");
                    setUserData(null);
                }
            },
            (error) => {
                console.error("Error fetching user data:", error);
            },
        );

        return () => {
            unsubscribe();
        };
    }, [userId]);

    if (!userData) {
        return (
            <Link
                href="#"
                className="flex items-center w-full rounded-full p-3 mt-4 hover:bg-gray-100 dark:hover:bg-gray-800"
                type="button"
            >
                <img
                    src={getDefaultPfp()}
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                />
                <div className="ml-3 text-left">
                    <div className="font-bold text-gray-900 dark:text-white">
                        Anonymous
                    </div>
                    <div className="text-gray-500">@anonymous</div>
                </div>
            </Link>
        );
    }

    return (
        <Link
            href={`/${userData.username}`}
            className="flex items-center w-full rounded-full p-3 mt-4 hover:bg-gray-100 dark:hover:bg-gray-800"
            type="button"
        >
            <img
                src={userData.pfp}
                alt="Profile"
                className="w-10 h-10 rounded-full"
            />
            <div className="ml-3 text-left">
                <div className="font-bold text-gray-900 dark:text-white">
                    {userData.name}
                </div>
                <div className="text-gray-500">@{userData.username}</div>
            </div>
        </Link>
    );
}
