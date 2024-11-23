import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { app } from "~/app/lib/firebaseServer";

const db = getFirestore(app);

export async function POST(request: NextRequest) {
    const auth = getAuth(app);

    try {
        const formData = await request.formData();

        const usernameData = formData.get("username");
        const nameData = formData.get("name");
        const emailData = formData.get("email");
        const passwordData = formData.get("password");

        if (!usernameData || !nameData || !emailData || !passwordData) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 },
            );
        }

        const username = usernameData.toString();
        const name = nameData.toString();
        const email = emailData.toString();
        const password = passwordData.toString();

        const usernameDoc = await db
            .collection("users")
            .where("username", "==", username)
            .get();

        if (!usernameDoc.empty) {
            return NextResponse.json(
                { error: "Username already taken" },
                { status: 400 },
            );
        }

        const user = await auth.createUser({
            email,
            password,
            displayName: name,
        });
        await auth.setCustomUserClaims(user.uid, {
            username: username.toLowerCase(),
        });

        await db.collection("users").doc(user.uid).set({
            uid: user.uid,
            name: name,
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        return NextResponse.json({
            message: "User registered successfully!",
        });
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 },
        );
    }
}
