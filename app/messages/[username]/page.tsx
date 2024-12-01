import { QuerySnapshot } from "firebase-admin/firestore";
import { MessageChat } from "./MessageChat";
import { database } from "~/app/lib/database";
import MessagesLayout from "../MessagesLayout";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { User } from "~/app/utils/types";
import { Metadata } from "next";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ username: string }>;
}): Promise<Metadata> {
    const username = (await params).username;

    const userSnapshot = await getUserData(username);

    if (!userSnapshot) {
        redirect("/");
    }

    const user = userSnapshot.docs[0]?.data();

    return {
        title: user ? `Messaging (@${username})` : "Messages",
        description: `View the profile of ${user?.name || "a user"}`,
    };
}

export default async function Chat({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    const username = (await params).username;

    const auth = database.auth;
    const cookie = await cookies();

    const sessionCookie = cookie.get("__session")?.value;
    if (!sessionCookie) {
        redirect("/login");
    }

    const decodedCookie = await auth.verifySessionCookie(sessionCookie);
    const user = await auth.getUser(decodedCookie.uid);

    if (!user) {
        redirect("/login");
    }

    if (!user.displayName) {
        redirect("/login");
    }
    if (!(user.customClaims && "username" in user.customClaims)) {
        redirect("/login");
    }

    const otherUserData = await getUserData(username);

    let currentUser: User | null = null;

    if (otherUserData && !otherUserData.empty) {
        currentUser = otherUserData.docs[0].data() as User;
    }

    const chatWithUID = currentUser?.uid;
    const chatWithName = currentUser?.name;
    const chatWithPic = currentUser?.pfp;

    return (
        <MessagesLayout>
            <MessageChat
                currentUser={user.uid}
                chatWithName={chatWithName!}
                chatWithUID={chatWithUID!}
                chatWithPic={chatWithPic!}
            />
        </MessagesLayout>
    );
}

async function getUserData(username: string): Promise<QuerySnapshot | null> {
    const userSnapshot = await database.db
        .collection("users")
        .where("username", "==", username)
        .get();

    if (userSnapshot.empty) {
        return null;
    }

    return userSnapshot;
}
