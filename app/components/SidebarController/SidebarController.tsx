"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "../Sidebar/Sidebar";
import { MessagesSidebar } from "~/app/messages/MessagesSidebar";
import { MobileSidebar } from "../Sidebar/MobileSidebar";
import { MobilePostModal } from "../Post/MobilePostButton";
import { useChatExtensions } from "~/app/ContextProvider/useChatExtensions";
import { useEffect, useState } from "react";
import {
    collection,
    getFirestore,
    onSnapshot,
    query,
    where,
} from "firebase/firestore";
import { app } from "~/app/lib/firebaseClient";

type Props = {
    userId: string;
    username: string;
    unreadNotifications: number;
    unreadMessages: number;
};

export function SidebarController({
    userId,
    username,
    unreadNotifications = 0,
    unreadMessages = 0,
}: Props) {
    const pathname = usePathname();
    const isMessagesRoute = pathname === "/messages";
    const isChatRoute = pathname.startsWith("/messages/");
    const { isOpened } = useChatExtensions();

    const [unreadCount, setUnreadCount] = useState(unreadMessages);

    useEffect(() => {
        const cleanup = getUnreadMessagesCount(userId, setUnreadCount);

        return cleanup;
    }, [userId]);

    return (
        <div className="flex">
            <div className="hidden md:block md:w-64 lg:w-64">
                <Sidebar
                    userId={userId}
                    username={username}
                    unreadNotifications={unreadNotifications}
                    unreadMessages={unreadCount}
                />
            </div>

            {(isMessagesRoute || !isChatRoute) && (
                <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 md:hidden">
                    <MobileSidebar
                        username={username}
                        unreadMessages={unreadCount}
                    />
                </div>
            )}

            {isMessagesRoute && (
                <div className="xs:w-screen md:w-80 h-screen lg:block lg:w-80 border-l border-gray-200 dark:border-gray-800">
                    <MessagesSidebar userId={userId} />
                </div>
            )}

            {isChatRoute && (
                <div
                    className={`${
                        !isOpened ? "hidden" : ""
                    } w-screen h-screen lg:block lg:w-80 border-l border-gray-200 dark:border-gray-800`}
                >
                    <MessagesSidebar userId={userId} />
                </div>
            )}

            {!isMessagesRoute && !isChatRoute && <MobilePostModal />}
        </div>
    );
}

function getUnreadMessagesCount(
    userId: string,
    setUnreadCount: React.Dispatch<React.SetStateAction<number>>,
) {
    const db = getFirestore(app);
    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, where("participants", "array-contains", userId));

    const unsubscribeChats = onSnapshot(q, (querySnapshot) => {
        let totalUnreadCount = 0;

        querySnapshot.forEach((chatDoc) => {
            const messagesRef = collection(chatDoc.ref, "messages");
            const messagesQuery = query(
                messagesRef,
                where("isRead", "==", false),
            );

            const unsubscribeMessages = onSnapshot(
                messagesQuery,
                (messagesSnapshot) => {
                    const unreadMessages = messagesSnapshot.docs.filter(
                        (messageDoc) => messageDoc.data().sender !== userId,
                    );

                    totalUnreadCount += unreadMessages.length;
                    setUnreadCount(totalUnreadCount);
                },
            );

            return () => unsubscribeMessages();
        });
    });

    return () => unsubscribeChats();
}
