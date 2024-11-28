import { Readable } from "stream";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { database } from "~/app/lib/database";
import { Post } from "~/app/utils/types";
import { verifyToken } from "~/app/utils/verify";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const db = database.db;

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

    const formData = await req.formData();
    const content = formData.get("content");
    const file = formData.get("image") as File | null;

    if (!content) {
        return NextResponse.json(
            {
                error: "Content is required",
            },
            { status: 400 },
        );
    }

    let imageUrl: string | null = null;

    if (file) {
        const allowedMimeTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
        ];

        if (!allowedMimeTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type" },
                { status: 400 },
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        try {
            const result = await uploadToCloudinary(buffer);
            imageUrl = result.secure_url;
        } catch (err) {
            console.error("Error uploading image:", err);
            return NextResponse.json(
                { error: "Failed to upload image" },
                { status: 500 },
            );
        }
    }

    const author = db.collection("users").doc(token!.uid);
    const newPost: Post = {
        postID: uuidv4(),
        userRef: author,
        content: content.toString(),
        image: imageUrl,
        likes: 0,
        likers: {},
        reposts: 0,
        replies: 0,
        createdAt: new Date(),
    };

    try {
        await db.collection("posts").doc(newPost.postID).set(newPost);
    } catch (e) {
        console.error("Error saving post to Firestore:", e);
        return NextResponse.json(
            {
                error: "Failed to save the post",
            },
            {
                status: 500,
            },
        );
    }

    return NextResponse.json({
        success: true,
        postID: newPost.postID,
    });
}

function uploadToCloudinary(
    buffer: Buffer,
): Promise<{ secure_url: string; public_id: string }> {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
                if (error) return reject(error);
                if (result) return resolve(result);
                reject(new Error("Upload failed"));
            },
        );
        const readableStream = new Readable({
            read() {
                this.push(buffer);
                this.push(null);
            },
        });
        readableStream.pipe(stream);
    });
}
