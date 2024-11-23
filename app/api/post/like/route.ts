import { getFirestore } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { app } from "~/app/lib/firebaseServer";
import { Like, Post } from "~/app/utils/types";
import { verifyToken } from "~/app/utils/verify";

const db = getFirestore(app);

export async function POST(req: NextRequest) {
    try {
        const [token, err] = await verifyToken(req);
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

        const username = token!.username;
        const body = await req.json();
        const like: Like = body;

        const docRef = db.collection("posts").doc(like.postID);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 },
            );
        }

        const post = docSnap.data() as Post;

        if (post.likers && post.likers[username]) {
            post.likes!--;
            delete post.likers[username];
        } else {
            post.likes!++;
            post.likers = { ...post.likers, [username]: {} };
        }

        await docRef.set(post);

        return NextResponse.json({ newLikes: post.likes });
    } catch (e) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
        );
    }
}
