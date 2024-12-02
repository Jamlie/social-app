"use client";

import { useEffect, useState } from "react";
import {
    fetchMessages,
    markMessagesAsRead,
    Message,
    sendMessage,
} from "./chatUtils";
import { ArrowLeft } from "lucide-react";
import { useChatExtensions } from "~/app/ContextProvider/useChatExtensions";
import Link from "next/link";
import Image from "next/image";

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
    const { openChat, closeChat } = useChatExtensions();

    useEffect(() => {
        openChat();

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

        return () => {
            unsubscribeFetchMessages();
            unsubscribeMarkAsRead();
        };
    }, [currentUser, chatWithUID]);

    async function handleSendMessage() {
        if (newMessage.trim()) {
            await sendMessage(currentUser, chatWithUID, newMessage);
            setNewMessage("");
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
                {messages.map((message) => {
                    return (
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
                    );
                })}
            </div>

            <div className="p-4 border-t border-gray-200 flex items-center space-x-2">
                <input
                    type="text"
                    placeholder="Start a message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                    className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:text-white dark:bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleSendMessage}
                    className="text-blue-500 hover:bg-blue-100 rounded-full p-2"
                >
                    Send
                </button>
            </div>
        </div>
    );
}

function formatMessageTime(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const oneDay = 24 * 60 * 60 * 1000;

    if (diff < 60000) return "Now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < oneDay) return `${Math.floor(diff / 3600000)}h`;

    return timestamp.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
}
