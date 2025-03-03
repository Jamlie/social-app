import { NextRequest, NextResponse } from "next/server";
import { database } from "~/app/lib/database";

export async function POST(request: NextRequest) {
    if (request.method === "OPTIONS") {
        return NextResponse.json(
            {},
            {
                headers: {
                    "Access-Control-Allow-Origin":
                        "https://jam-social-app.netlify.app",
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
                    "Access-Control-Allow-Headers":
                        "Authorization, Content-Type",
                    "Access-Control-Allow-Credentials": "true",
                },
            },
        );
    }

    const auth = database.auth;

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
        expires: new Date(Date.now() + fiveDays),
        sameSite: "lax",
    });

    response.headers.set(
        "Access-Control-Allow-Origin",
        "https://jam-social-app.netlify.app",
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");

    return response;
}
