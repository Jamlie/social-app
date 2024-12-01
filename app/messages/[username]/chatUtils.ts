import {
    addDoc,
    collection,
    doc,
    getFirestore,
    onSnapshot,
    orderBy,
    query,
    setDoc,
} from "firebase/firestore";
import { app } from "~/app/lib/firebaseClient";

export type Message = {
    id: string;
    text: string;
    sender: string;
    timestamp: Date;
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

    // Real-time listener for updates
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messages: Message[] = [];
        querySnapshot.forEach((doc) => {
            messages.push({
                id: doc.id,
                text: doc.data().text,
                sender: doc.data().sender,
                timestamp: new Date(doc.data().timestamp.seconds * 1000),
            });
        });
        callback(messages);
    });

    return unsubscribe;
}
