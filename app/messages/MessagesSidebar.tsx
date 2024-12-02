"use client";

import { Search } from "lucide-react";
import { User } from "~/app/utils/types";
import Link from "next/link";
import Image from "next/image";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";
import { app } from "../lib/firebaseClient";
import { useEffect, useState } from "react";
import { useChatExtensions } from "../ContextProvider/useChatExtensions";

async function fetchUsers() {
    const db = getFirestore(app);
    const messagesQuery = query(collection(db, "users"));
    const messagesSnapshot = await getDocs(messagesQuery);

    return messagesSnapshot.docs.map((doc) => {
        const data = doc.data() as User;
        return {
            id: doc.id,
            pfp: data.pfp,
            name: data.name,
            username: data.username,
        };
    });
}

export function MessagesSidebar() {
    const { closeChat } = useChatExtensions();

    const [conversations, setConversations] = useState<
        | {
              id: string;
              pfp: string;
              name: string;
              username: string;
          }[]
        | null
    >(null);

    useEffect(() => {
        async function getUsers() {
            setConversations(await fetchUsers());
        }

        getUsers();
        closeChat();
    });

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
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
