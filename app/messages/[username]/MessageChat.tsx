"use client";

import { useEffect, useRef, useState } from "react";
import {
    fetchMessages,
    listenForTypingStatus,
    markMessagesAsRead,
    Message,
    sendMessage,
    updateTypingStatus,
} from "./chatUtils";
import { useChatExtensions } from "~/app/ContextProvider/useChatExtensions";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { formatMessageTime } from "~/app/utils/date";

type MessageChatProps = {
    currentUser: string;
    chatWithName: string;
    chatWithUID: string;
    chatWithPic: string;
};

export function MessageChat({
    currentUser,
    chatWithName,
    chatWithUID,
    chatWithPic,
}: MessageChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const { openChat, closeChat } = useChatExtensions();
    const scrollDownDiv = useRef<HTMLDivElement>(null);
    const textInputRef = useRef<HTMLInputElement>(null);

    scrollDownDiv.current?.scrollIntoView({
        behavior: "smooth",
    });

    useEffect(() => {
        openChat();

        textInputRef.current?.focus();

        return () => closeChat();
    }, []);

    useEffect(() => {
        const unsubscribeFetchMessages = fetchMessages(
            currentUser,
            chatWithUID,
            setMessages,
        );

        const unsubscribeMarkAsRead = markMessagesAsRead(
            currentUser,
            chatWithUID,
        );

        const unsubscribeTypingStatus = listenForTypingStatus(
            currentUser,
            chatWithUID,
            setIsTyping,
        );

        return () => {
            unsubscribeFetchMessages();
            unsubscribeMarkAsRead();
            unsubscribeTypingStatus();
        };
    }, [currentUser, chatWithUID]);

    async function handleSendMessage() {
        if (newMessage.trim()) {
            await sendMessage(currentUser, chatWithUID, newMessage);
            setNewMessage("");
            scrollDownDiv.current?.scrollIntoView({ behavior: "smooth" });
            updateTypingStatus(currentUser, chatWithUID, false);
        }
    }

    function handleTyping(e: React.ChangeEvent<HTMLInputElement>) {
        setNewMessage(e.target.value);
        if (e.target.value.trim()) {
            updateTypingStatus(currentUser, chatWithUID, true);
        } else {
            updateTypingStatus(currentUser, chatWithUID, false);
        }
    }

    return (
        <div className="flex flex-col h-screen dark:bg-black">
            <div className="p-4 border-b border-gray-200 flex items-center">
                <div className="mr-4 p-2 rounded-full hover:bg-gray-100 hover:dark:bg-gray-700 focus:outline-none lg:hidden">
                    <Link href="/messages">
                        <ArrowLeft className="dark:text-white" />
                    </Link>
                </div>
                <div className="avatar mr-4">
                    <div className="w-12 h-12 rounded-full">
                        <Image
                            src={chatWithPic}
                            alt="User Profile"
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                    </div>
                </div>
                <div>
                    <h2 className="font-bold dark:text-gray-200">
                        {chatWithName}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Active now
                    </p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${
                            message.sender === currentUser
                                ? "justify-end"
                                : "justify-start"
                        }`}
                    >
                        <div
                            className={`max-w-[70%] p-3 rounded-2xl ${
                                message.sender === currentUser
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 dark:bg-gray-700 dark:text-gray-100"
                            }`}
                        >
                            {message.text}
                            <div className="text-xs text-opacity-70 mt-1 text-right">
                                {formatMessageTime(message.timestamp)}
                            </div>
                        </div>
                    </div>
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={scrollDownDiv}></div>
            </div>

            <div className="p-4 border-t border-gray-200 flex items-center space-x-2">
                <input
                    type="text"
                    placeholder="Start a message"
                    value={newMessage}
                    onChange={handleTyping}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                    className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:text-white dark:bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ref={textInputRef}
                />
                <button
                    onClick={handleSendMessage}
                    className="text-blue-500 hover:bg-blue-100 dark:hover:bg-background rounded-full p-2"
                >
                    Send
                </button>
            </div>
        </div>
    );
}

function TypingIndicator() {
    return (
        <div className="flex items-center space-x-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-xl max-w-fit">
            <div className="flex items-center">
                <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce animation-delay-0"></div>
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce animation-delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce animation-delay-200"></div>
                </div>
            </div>
        </div>
    );
}
