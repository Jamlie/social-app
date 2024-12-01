"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "../Sidebar/Sidebar";
import { MessagesSidebar } from "~/app/messages/MessagesSidebar";
import { MobileSidebar } from "../Sidebar/MobileSidebar";
import { MobilePostModal } from "../Post/MobilePostButton";
import { useChatExtensions } from "~/app/ContextProvider/useChatExtensions";
import { useEffect, useState } from "react";

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

    return (
        <div className="flex">
            <div className="hidden md:block md:w-64 lg:w-64">
                <Sidebar
                    userId={userId}
                    username={username}
                    unreadNotifications={unreadNotifications}
                    unreadMessages={unreadMessages}
                />
            </div>

            {(isMessagesRoute || !isChatRoute) && (
                <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 md:hidden">
                    <MobileSidebar username={username} />
                </div>
            )}

            {isMessagesRoute && (
                <div className="w-screen h-screen lg:block lg:w-80 border-l border-gray-200 dark:border-gray-800">
                    <MessagesSidebar />
                </div>
            )}

            {isChatRoute && (
                <div
                    className={`${
                        !isOpened ? "hidden" : ""
                    } w-screen h-screen lg:block lg:w-80 border-l border-gray-200 dark:border-gray-800`}
                >
                    <MessagesSidebar />
                </div>
            )}

            {!isMessagesRoute && !isChatRoute && <MobilePostModal />}
        </div>
    );
}
