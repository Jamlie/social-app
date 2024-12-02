import {
    addDoc,
    collection,
    doc,
    getFirestore,
    onSnapshot,
    orderBy,
    query,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore";
import { app } from "~/app/lib/firebaseClient";

export type Message = {
    id: string;
    text: string;
    sender: string;
    timestamp: Date;
    isRead: boolean;
};

export async function sendMessage(
    currentUser: string,
    chatWithUID: string,
    messageText: string,
) {
    const db = getFirestore(app);
    const chatId = [currentUser, chatWithUID].sort().join("-");

    const chatRef = doc(db, "chats", chatId);
    await setDoc(
        chatRef,
        {
            participants: [currentUser, chatWithUID],
        },
        { merge: true },
    );

    const messagesRef = collection(chatRef, "messages");
    await addDoc(messagesRef, {
        sender: currentUser,
        text: messageText,
        timestamp: new Date(),
        isRead: false,
    });
}

export function fetchMessages(
    currentUser: string,
    chatWithUID: string,
    callback: (messages: Message[]) => void,
) {
    const db = getFirestore(app);
    const chatId = [currentUser, chatWithUID].sort().join("-");

    const chatRef = doc(db, "chats", chatId);
    const messagesRef = collection(chatRef, "messages");

    const q = query(messagesRef, orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messages: Message[] = [];
        querySnapshot.forEach((doc) => {
            messages.push({
                id: doc.id,
                text: doc.data().text,
                sender: doc.data().sender,
                timestamp: new Date(doc.data().timestamp.seconds * 1000),
                isRead: doc.data().isRead,
            });
        });
        callback(messages);
    });

    return unsubscribe;
}

export function markMessagesAsRead(currentUser: string, chatWithUID: string) {
    const db = getFirestore(app);
    const chatId = [currentUser, chatWithUID].sort().join("-");

    const chatRef = doc(db, "chats", chatId);
    const messagesRef = collection(chatRef, "messages");

    const q = query(messagesRef, where("isRead", "==", false));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
            if (doc.data().sender !== currentUser) {
                await updateDoc(doc.ref, {
                    isRead: true,
                });
            }
        });
    });

    return unsubscribe;
}
