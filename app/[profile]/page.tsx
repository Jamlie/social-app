import { redirect } from "next/navigation";
import { UserRecord } from "firebase-admin/auth";
import { cookies } from "next/headers";
import { PostsFetcher } from "~/app/components/Post/PostsFetcher";
import { Metadata } from "next";
import { database } from "~/app/lib/database";
import { QuerySnapshot } from "firebase-admin/firestore";
import { User } from "~/app/utils/types";
import { Avatar } from "./Avatar";
import { EditProfileClient } from "./EditProfileClient";

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

export async function generateMetadata({
    params,
}: {
    params: Promise<{ profile: string }>;
}): Promise<Metadata> {
    const username = (await params).profile;

    const userSnapshot = await getUserData(username);

    if (!userSnapshot) {
        redirect("/");
    }

    const user = userSnapshot.docs[0]?.data();

    return {
        title: user ? `${user.name} (@${username})` : "Profile",
        description: `View the profile of ${user?.name || "a user"}`,
    };
}

export default async function Profile({
    params,
}: {
    params: Promise<{ profile: string }>;
}) {
    const username = (await params).profile;

    const userSnapshot = await getUserData(username);
    if (!userSnapshot) {
        redirect("/");
    }

    const cookie = await cookies();

    let currentUserRecord: UserRecord | null = null;
    let currentUserSnapshot: QuerySnapshot | null = null;
    const sessionCookie = cookie.get("__session")?.value;

    if (sessionCookie) {
        try {
            const auth = database.auth;
            const decodedCookie = await auth.verifySessionCookie(sessionCookie);
            currentUserRecord = await auth.getUser(decodedCookie.uid);
            currentUserSnapshot = await getUserData(
                currentUserRecord.customClaims?.username,
            );
        } catch (error) {
            console.error("Error verifying session cookie:", error);
        }
    }

    let user: User | null = null;

    user = userSnapshot.docs[0].data() as User;
    let currentUser: User | null = null;

    if (currentUserSnapshot && !currentUserSnapshot.empty) {
        currentUser = currentUserSnapshot.docs[0].data() as User;
    }

    const name =
        currentUser && currentUser.username === username ? "You" : user.name;

    return (
        <>
            <div className="flex-1 flex justify-center">
                <main
                    id="profile-container"
                    className="w-full max-w-3xl px-4 py-4 mb-16 md:mb-0"
                >
                    <div className="bg-white rounded-lg shadow-md dark:bg-foreground">
                        <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
                            {currentUser &&
                            currentUser.username === user.username ? (
                                <Avatar pfp={user.pfp} />
                            ) : (
                                <div className="avatar">
                                    <div className="w-16 h-16 rounded-full">
                                        <img src={user.pfp} alt="User Avatar" />
                                    </div>
                                </div>
                            )}
                            <div className="ml-4 flex-1">
                                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                                    {name}
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400">
                                    @{username}
                                </p>
                            </div>
                            {currentUser &&
                                currentUser.username === user.username &&
                                currentUserRecord && (
                                    <div className="ml-auto">
                                        <EditProfileClient
                                            userId={currentUser.uid}
                                            initialName={user.name}
                                            initialBio={currentUser.bio}
                                        />
                                    </div>
                                )}
                        </div>
                        <div className="p-4 text-gray-700 dark:text-gray-300">
                            <p>{user.bio}</p>
                        </div>
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                                Recent Posts
                            </h3>
                            <div id="posts-container">
                                <PostsFetcher
                                    currentUser={
                                        currentUserRecord?.customClaims
                                            ?.username
                                    }
                                    currentUserId={currentUserRecord?.uid!}
                                    visitedUserId={username}
                                    location="profile"
                                />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
