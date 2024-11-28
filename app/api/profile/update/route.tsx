import { NextRequest, NextResponse } from "next/server";
import { database } from "~/app/lib/database";
import { verifyToken } from "~/app/utils/verify";

export async function POST(request: NextRequest) {
    try {
        const [, err] = await verifyToken(request);
        if (err) {
            return NextResponse.json(
                {
                    error: "Error fetching user data",
                },
                {
                    status: 500,
                },
            );
        }

        const { name, bio, uid } = await request.json();

        const userRef = database.db.collection("users").doc(uid);
        const userSnapshot = await userRef.get();

        if (userSnapshot.exists) {
            await userSnapshot.ref.update({ name, bio });
        }

        return NextResponse.json({
            message: "Profile updated successfully",
        });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json(
            {
                message: "Failed to update profile",
            },
            { status: 500 },
        );
    }
}
