"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function PostModal() {
    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const [postError, setPostError] = useState("");

    async function handleFormPost(e: React.FormEvent) {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);

        try {
            const response = await fetch("/api/post/create", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setOpenModal(false);
                router.push("/");
                return;
            }

            const resJson = (await response.json()) as {
                error: string;
            };

            setPostError(resJson.error);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <>
            <button
                onClick={() => setOpenModal(true)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full py-3 px-4 font-bold text-lg mt-4"
            >
                Tweet
            </button>
            {openModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50"
                    onClick={() => setOpenModal(false)}
                >
                    <div
                        className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-11/12 max-w-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setOpenModal(false)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 float-right"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold mb-4 dark:text-white">
                            Compose new Tweet
                        </h2>
                        <form onSubmit={handleFormPost} method="POST">
                            <textarea
                                name="content"
                                rows={4}
                                className="w-full text-black dark:text-white p-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800"
                                placeholder="What's happening?"
                                required
                            ></textarea>
                            <span className="text-red-600 text-sm">
                                {postError}
                            </span>
                            <div className="flex justify-end mt-4">
                                <button
                                    type="button"
                                    onClick={() => setOpenModal(false)}
                                    className="mr-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Tweet
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
