import { getAuth } from "firebase-admin/auth";
import { NextRequest, NextResponse } from "next/server";
import { app } from "~/app/lib/firebaseServer";

export async function POST(request: NextRequest) {
    const auth = getAuth(app);

    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
        return NextResponse.json(
            { error: "Invalid credentails: No token found" },
            { status: 401 },
        );
    }

    const idToken = authHeader.split("Bearer ")[1];

    if (!idToken) {
        return NextResponse.json(
            { error: "Invalid credentails: No token found" },
            { status: 401 },
        );
    }

    try {
        await auth.verifyIdToken(idToken);
    } catch (e) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const fiveDays = 5 * 24 * 60 * 60 * 1000;
    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: fiveDays,
    });

    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set("__session", sessionCookie, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    });

    return response;
}
