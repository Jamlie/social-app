import "./globals.css";
import { cookies } from "next/headers";
import { database } from "./lib/database";
import { DecodedIdToken, UserRecord } from "firebase-admin/auth";
import { SidebarController } from "./components/SidebarController/SidebarController";
import { ChatExtensionsProvider } from "./ContextProvider/useChatExtensions";
import { UnreadMessagesProvider } from "./ContextProvider/UnreadMessagesContext";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const auth = database.auth;
    const cookie = await cookies();

    const sessionCookie = cookie.get("__session")?.value;

    let decodedCookie: DecodedIdToken | null = null;
    let user: UserRecord | null = null;

    try {
        if (sessionCookie) {
            decodedCookie = await auth.verifySessionCookie(sessionCookie);
            user = await auth.getUser(decodedCookie.uid);
        }
    } catch (error) {
        console.error("Session expired or invalid:", error);

        cookie.delete("__session");
    }

    return (
        <html lang="en">
            <body>
                {!sessionCookie && children}
                {sessionCookie && (
                    <ChatExtensionsProvider>
                        <UnreadMessagesProvider>
                            <div className="flex min-h-screen bg-white dark:bg-black">
                                <SidebarController
                                    userId={user!.uid}
                                    username={
                                        user!.customClaims!.username || ""
                                    }
                                    unreadNotifications={0}
                                    unreadMessages={0}
                                />

                                {children}
                            </div>
                        </UnreadMessagesProvider>
                    </ChatExtensionsProvider>
                )}
            </body>
        </html>
    );
}
