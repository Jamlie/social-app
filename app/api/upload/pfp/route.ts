import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import { database } from "~/app/lib/database";
import { verifyToken } from "~/app/utils/verify";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
    const file = formData.get("image") as File;

    if (!file) {
        return NextResponse.json(
            { error: "No file uploaded" },
            { status: 400 },
        );
    }

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
        const db = database.db;
        const usersCollection = db.collection("users");

        await usersCollection.doc(token!.uid).update({
            pfp: result.secure_url,
        });

        return NextResponse.json({
            success: true,
            pfp: result.secure_url,
        });
    } catch (err) {
        console.error("Error uploading:", err);
        return NextResponse.json(
            { error: "Failed to upload image" },
            { status: 500 },
        );
    }
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
