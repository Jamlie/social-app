"use client";

import { Search } from "lucide-react";
import { User } from "~/app/utils/types";
import Link from "next/link";
import Image from "next/image";
import {
    collection,
    getDocs,
    getFirestore,
    limit,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";
import { app } from "../lib/firebaseClient";
import { useEffect, useState } from "react";
import { useChatExtensions } from "../ContextProvider/useChatExtensions";

async function fetchUsersWithLastMessage(currentUserUID: string) {
    const db = getFirestore(app);
    const usersQuery = query(collection(db, "users"));
    const usersSnapshot = await getDocs(usersQuery);

    const usersData = await Promise.all(
        usersSnapshot.docs.map(async (doc) => {
            const userData = doc.data() as User;
            const userId = doc.id;

            const chatId = [currentUserUID, userId].sort().join("-");
            const messagesRef = collection(db, "chats", chatId, "messages");
            const lastMessageQuery = query(
                messagesRef,
                orderBy("timestamp", "desc"),
                limit(1),
            );

            const lastMessageSnapshot = await getDocs(lastMessageQuery);
            let lastMessage = null;
            if (!lastMessageSnapshot.empty) {
                const messageDoc = lastMessageSnapshot.docs[0];
                lastMessage = {
                    text: messageDoc.data().text,
                    timestamp: new Date(
                        messageDoc.data().timestamp.seconds * 1000,
                    ),
                    sender: messageDoc.data().sender,
                };
            }

            return {
                id: userId,
                pfp: userData.pfp,
                name: userData.name,
                username: userData.username,
                lastMessage,
            };
        }),
    );
    return usersData;
}

export function MessagesSidebar({ userId }: { userId: string }) {
    const { closeChat } = useChatExtensions();
    const [conversations, setConversations] = useState<
        | {
              id: string;
              pfp: string;
              name: string;
              username: string;
              lastMessage: {
                  text: string;
                  timestamp: Date;
                  sender: string;
              } | null;
          }[]
        | null
    >(null);

    useEffect(() => {
        async function getUsers() {
            const usersWithLastMessages =
                await fetchUsersWithLastMessage(userId);
            setConversations(usersWithLastMessages);
            closeChat();
        }

        getUsers();
    }, [conversations, userId]);

    useEffect(() => {
        const unsubscribeFromChats = conversations?.map((conversation) => {
            const db = getFirestore(app);
            const chatId = [userId, conversation.id].sort().join("-");
            const messagesRef = collection(db, "chats", chatId, "messages");
            const q = query(
                messagesRef,
                orderBy("timestamp", "desc"),
                limit(1),
            );

            return onSnapshot(q, (querySnapshot) => {
                if (!querySnapshot.empty) {
                    const messageDoc = querySnapshot.docs[0];
                    const lastMessage = {
                        text: messageDoc.data().text,
                        timestamp: new Date(
                            messageDoc.data().timestamp.seconds * 1000,
                        ),
                        sender: messageDoc.data().sender,
                    };

                    setConversations((prevConversations) => {
                        if (!prevConversations) {
                            return [];
                        }

                        return prevConversations.map((conv) => {
                            if (conv.id === conversation.id) {
                                return { ...conv, lastMessage };
                            }
                            return conv;
                        });
                    });
                }
            });
        });

        return () => {
            unsubscribeFromChats?.forEach((unsubscribe) => unsubscribe());
        };
    }, [conversations, userId]);

    return (
        <div className="flex flex-col h-screen">
            <div className="p-4 border-b border-gray-200 dark:text-gray-100 dark:border-gray-800">
                <h2 className="text-2xl font-bold mb-4">Messages</h2>

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search direct messages"
                        className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            <div className="overflow-y-auto flex-1">
                {conversations?.map((conversation) => (
                    <Link
                        href={`/messages/${conversation.username}`}
                        key={conversation.id}
                        className="flex p-4 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-800"
                    >
                        <div className="relative mr-4">
                            <div className="avatar">
                                <div className="w-12 h-12 rounded-full">
                                    <Image
                                        src={conversation.pfp}
                                        alt={conversation.name}
                                        width={48}
                                        height={48}
                                        className="rounded-full"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold">
                                    {conversation.name}
                                </h3>
                                {conversation.lastMessage && (
                                    <span className="text-sm text-gray-500">
                                        {formatMessageTime(
                                            new Date(
                                                conversation.lastMessage.timestamp,
                                            ),
                                        )}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-500 truncate">
                                {conversation.lastMessage?.text ||
                                    "No messages yet"}
                            </p>
                        </div>
                    </Link>
                ))}
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
