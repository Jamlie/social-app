import "./globals.css";
import { cookies } from "next/headers";
import { database } from "./lib/database";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { DecodedIdToken, UserRecord } from "firebase-admin/auth";

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
                    <div className="flex min-h-screen bg-white dark:bg-black">
                        <div className="hidden md:block md:w-64 lg:w-72">
                            <Sidebar
                                userId={user!.uid}
                                username={user!.customClaims!.username || ""}
                                unreadNotifications={0}
                                unreadMessages={0}
                            />
                        </div>

                        {children}
                    </div>
                )}
            </body>
        </html>
    );
}
