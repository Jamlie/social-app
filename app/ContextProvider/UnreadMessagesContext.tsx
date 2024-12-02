"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type UnreadMessagesContextType = {
    unreadCount: number;
    setUnreadCount: (count: number) => void;
};

const UnreadMessagesContext = createContext<
    UnreadMessagesContextType | undefined
>(undefined);

export const UnreadMessagesProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [unreadCount, setUnreadCount] = useState(0);

    return (
        <UnreadMessagesContext.Provider value={{ unreadCount, setUnreadCount }}>
            {children}
        </UnreadMessagesContext.Provider>
    );
};

export const useUnreadMessages = () => {
    const context = useContext(UnreadMessagesContext);
    if (!context) {
        throw new Error(
            "useUnreadMessages must be used within a UnreadMessagesProvider",
        );
    }
    return context;
};
