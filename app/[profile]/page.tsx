import { redirect } from "next/navigation";
import { UserRecord } from "firebase-admin/auth";
import { cookies } from "next/headers";
import { PostsFetcher } from "~/app/components/Post/PostsFetcher";
import { Metadata } from "next";
import { database } from "~/app/lib/database";
import { QuerySnapshot } from "firebase-admin/firestore";

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

    let currentUser: UserRecord | null = null;
    const sessionCookie = cookie.get("__session")?.value;

    if (sessionCookie) {
        try {
            const auth = database.auth;
            const decodedCookie = await auth.verifySessionCookie(sessionCookie);
            currentUser = await auth.getUser(decodedCookie.uid);
        } catch (error) {
            console.error("Error verifying session cookie:", error);
        }
    }

    let user = null;

    user = userSnapshot.docs[0].data();

    const name =
        currentUser &&
        currentUser.customClaims &&
        currentUser.customClaims.username === username
            ? "You"
            : user.name;

    return (
        <>
            <div className="flex justify-center py-10">
                <div className="w-full max-w-3xl bg-white rounded-lg shadow-md dark:bg-gray-800">
                    <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="avatar">
                            <div className="w-16 h-16 rounded-full">
                                <img
                                    src="https://cdn.bsky.app/img/avatar/plain/did:plc:kuh5pbumsg6amawjlwmac4bq/bafkreigi3rh6iprnbgysxiqsp3ov3gn63mv3f7yvgscv2oeu2xbtur5bey@jpeg"
                                    alt="User Avatar"
                                />
                            </div>
                        </div>
                        <div className="ml-4">
                            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                                {name}
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400">
                                @{username}
                            </p>
                        </div>
                    </div>
                    <div className="p-4 text-gray-700 dark:text-gray-300">
                        <p>
                            {currentUser?.customClaims?.bio ||
                                "No bio available"}
                        </p>
                    </div>
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                            Recent Posts
                        </h3>
                        <div id="posts-container">
                            <PostsFetcher
                                currentUser={
                                    currentUser?.customClaims?.username
                                }
                                visitedUserId={username}
                                location="profile"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
