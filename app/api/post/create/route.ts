import { getFirestore } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { app } from "~/app/lib/firebaseServer";
import { Post } from "~/app/utils/types";
import { verifyToken } from "~/app/utils/verify";

const db = getFirestore(app);

export async function POST(req: NextRequest) {
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

    const body = await req.formData();
    const content = body.get("content");
    if (!content) {
        return NextResponse.json(
            {
                error: "Content is required",
            },
            { status: 400 },
        );
    }

    const author = db.collection("users").doc(token!.uid);

    const newPost: Post = {
        postID: uuidv4(),
        userRef: author,
        content: content.toString(),
        likes: 0,
        likers: {},
        reposts: 0,
        replies: 0,
        createdAt: new Date(),
    };

    try {
        await db.collection("posts").doc(newPost.postID!).set(newPost);
    } catch (e) {
        return NextResponse.json(
            {
                error: "Failed to post the post",
            },
            {
                status: 500,
            },
        );
    }

    revalidatePath("/");
    const response = NextResponse.redirect(new URL("/", req.url));

    return response;
}
