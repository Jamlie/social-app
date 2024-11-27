import { DecodedIdToken } from "firebase-admin/auth";
import { NextRequest } from "next/server";
import { database } from "~/app/lib/database";

type Result<T> = [T, Error | null];

const auth = database.auth;

export async function verifyToken(
    req: NextRequest,
): Promise<Result<DecodedIdToken | null>> {
    const sessionCookie = req.cookies.get("__session");
    if (!sessionCookie) {
        return [null, new Error("Session does not exist")];
    }

    const sessionCookieValue = sessionCookie.value;

    try {
        const decodedToken = await auth.verifySessionCookie(sessionCookieValue);
        return [decodedToken, null];
    } catch (e) {
        return [null, new Error("Invalid session")];
    }
}
