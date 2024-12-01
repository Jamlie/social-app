import "./globals.css";
import { cookies } from "next/headers";
import { database } from "./lib/database";
import { DecodedIdToken, UserRecord } from "firebase-admin/auth";
import { SidebarController } from "./components/SidebarController/SidebarController";
import { ChatExtensionsProvider } from "./ContextProvider/useChatExtensions";

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
    if (sessionCookie) {
        decodedCookie = await auth.verifySessionCookie(sessionCookie);
        user = await auth.getUser(decodedCookie.uid);
    }

    return (
        <html lang="en">
            <body>
                {!sessionCookie && children}
                {sessionCookie && (
                    <ChatExtensionsProvider>
                        <div className="flex min-h-screen bg-white dark:bg-black">
                            <SidebarController
                                userId={user!.uid}
                                username={user!.customClaims!.username || ""}
                                unreadNotifications={0}
                                unreadMessages={0}
                            />

                            {children}
                        </div>
                    </ChatExtensionsProvider>
                )}
            </body>
        </html>
    );
}
