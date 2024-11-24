import {
    addDoc,
    collection,
    DocumentReference,
    getDoc,
    getFirestore,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { app } from "~/app/lib/firebaseClient";
import { getDefaultPfp } from "~/app/utils/profile";
import { User } from "~/app/utils/types";

type Comment = {
    id: string;
    content: string;
    userRef: DocumentReference;
    timestamp: {
        seconds: number;
        nanoseconds: number;
    };
    user?: User;
};

export function CommentSection({
    postId,
    userRef,
}: {
    postId: string;
    userRef: DocumentReference;
}) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const db = getFirestore(app);

    useEffect(() => {
        const commentsRef = collection(db, "posts", postId, "comments");
        const q = query(commentsRef, orderBy("timestamp", "desc"));

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const commentPromises = snapshot.docs.map(async (doc) => {
                const commentData = doc.data();
                const userDoc = await getDoc(commentData.userRef);
                const userData = userDoc.exists()
                    ? (userDoc.data() as User)
                    : null;

                return {
                    id: doc.id,
                    ...commentData,
                    user: userData,
                } as Comment;
            });

            const resolvedComments = await Promise.all(commentPromises);
            setComments(resolvedComments);
        });

        return () => unsubscribe();
    }, [postId]);

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const commentsRef = collection(db, "posts", postId, "comments");
            await addDoc(commentsRef, {
                content: newComment,
                userRef: userRef,
                timestamp: new Date(),
            });
            setNewComment("");
        } catch (error) {
            console.error("Error posting comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-4 border-t border-gray-200 dark:border-gray-600 pt-4">
            <form onSubmit={handleSubmitComment} className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-foreground text-black dark:text-white border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Send size={20} />
                </button>
            </form>

            <div className="space-y-4">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                        <img
                            src={comment.user?.pfp || getDefaultPfp()}
                            alt={`${comment.user?.name}'s avatar`}
                            className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1">
                            <div className="flex items-center space-x-2">
                                <span className="font-bold text-black dark:text-white">
                                    {comment.user?.name}
                                </span>
                                <span className="text-gray-400">
                                    @{comment.user?.username}
                                </span>
                                <span className="text-gray-400">·</span>
                                <span className="text-gray-400">
                                    {new Date(
                                        comment.timestamp.seconds,
                                    ).toLocaleString()}
                                </span>
                            </div>
                            <p className="text-black dark:text-white mt-1">
                                {comment.content}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
