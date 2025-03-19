import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PostsFetcher } from "./components/Post/PostsFetcher";
import { database } from "~/app/lib/database";
import { User } from "./utils/types";
import { QuerySnapshot } from "firebase-admin/firestore";
import { Suspense } from "react";
import { PostSkeleton } from "./components/Post/PostSkeleton";

export const metadata: Metadata = {
    title: "Home",
};

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

export default async function Home() {
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

    let currentUserSnapshot: QuerySnapshot | null = null;
    currentUserSnapshot = await getUserData(user.customClaims.username);

    let currentUser: User | null = null;

    if (currentUserSnapshot && !currentUserSnapshot.empty) {
        currentUser = currentUserSnapshot.docs[0].data() as User;
    }

    return (
        <>
            <div className="flex-1 flex justify-center">
                <main className="w-full max-w-xl px-4 py-4 mb-16 md:mb-0">
                    <PostsFetcher
                        location="home"
                        currentUser={user.customClaims.username}
                        currentUserId={user.uid}
                    />
                </main>
            </div>
        </>
    );
}
