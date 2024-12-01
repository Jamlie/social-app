import { cookies } from "next/headers";
import { database } from "../lib/database";
import MessagesLayout from "./MessagesLayout";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Messages",
};

export default async function Messages() {
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

    return <MessagesLayout />;
}
