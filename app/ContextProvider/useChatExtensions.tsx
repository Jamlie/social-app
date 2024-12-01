"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type ChatExtensionsProps = {
    isOpened: boolean;
    openChat(): void;
    closeChat(): void;
};

const ChatExtensionContext = createContext<ChatExtensionsProps>({
    isOpened: false,
    openChat: () => {},
    closeChat: () => {},
});

export function ChatExtensionsProvider({ children }: { children: ReactNode }) {
    const [isOpened, setIsOpened] = useState(false);

    function openChat() {
        setIsOpened(true);
    }

    function closeChat() {
        setIsOpened(false);
    }

    return (
        <ChatExtensionContext.Provider
            value={{ isOpened, openChat, closeChat }}
        >
            {children}
        </ChatExtensionContext.Provider>
    );
}

export function useChatExtensions() {
    return useContext(ChatExtensionContext);
}
