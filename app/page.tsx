import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { PostsFetcher } from "./components/Post/PostsFetcher";
import { database } from "~/app/lib/database";

export const metadata: Metadata = {
    title: "Home",
};

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

    return (
        <>
            <div className="flex min-h-screen">
                <div className="hidden md:block md:w-64 lg:w-72">
                    <Sidebar
                        name={user.displayName}
                        username={user.customClaims.username}
                        avatar="https://cdn.bsky.app/img/avatar/plain/did:plc:kuh5pbumsg6amawjlwmac4bq/bafkreigi3rh6iprnbgysxiqsp3ov3gn63mv3f7yvgscv2oeu2xbtur5bey@jpeg"
                        unreadNotifications={5}
                        unreadMessages={2}
                    />
                </div>

                <div className="flex-1 flex justify-center">
                    <main
                        id="posts-container"
                        className="w-full max-w-xl px-4 py-4 mb-16 md:mb-0"
                    >
                        <PostsFetcher
                            location="home"
                            currentUser={user.customClaims.username}
                        />
                    </main>
                </div>
            </div>
        </>
    );
}
