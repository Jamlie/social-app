"use client";
import { Images } from "lucide-react";
import { useState, useRef } from "react";

export function PostModal() {
    const [openModal, setOpenModal] = useState(false);
    const [postError, setPostError] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    async function handleFormPost(e: React.FormEvent) {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);

        if (selectedImage) {
            formData.append("image", selectedImage);
        }

        try {
            setOpenModal(false);
            const response = await fetch("/api/post/create", {
                method: "POST",
                body: formData,
            });
            if (response.ok) {
                setSelectedImage(null);
                setImagePreview(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
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

    function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            const maxSize = 5 * 1024 * 1024; // 5MB
            const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

            if (file.size > maxSize) {
                setPostError("Image must be smaller than 5MB");
                return;
            }

            if (!allowedTypes.includes(file.type)) {
                setPostError("Only JPEG, PNG, and GIF images are allowed");
                return;
            }

            setSelectedImage(file);

            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);

            setPostError("");
        }
    }

    function handleImageRemove() {
        setSelectedImage(null);

        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }

        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    return (
        <>
            <button
                onClick={() => setOpenModal(true)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full py-3 px-4 font-bold text-lg mt-4"
            >
                Post
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
                            Compose new Post
                        </h2>
                        <form onSubmit={handleFormPost} method="POST">
                            <textarea
                                name="content"
                                rows={4}
                                className="w-full text-black dark:text-white p-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800"
                                placeholder="What's happening?"
                                required
                            ></textarea>

                            <div className="mt-4 flex items-center">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageSelect}
                                    accept="image/jpeg,image/png,image/gif"
                                    className="hidden"
                                    id="imageUpload"
                                />
                                <label
                                    htmlFor="imageUpload"
                                    className="cursor-pointer mr-2 text-blue-500 hover:text-blue-600"
                                >
                                    <Images size={20} />
                                </label>

                                {selectedImage && (
                                    <div className="flex items-center">
                                        <span className="text-sm mr-2">
                                            {selectedImage.name}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={handleImageRemove}
                                            className="text-red-500 hover:text-red-600"
                                        >
                                            ✖
                                        </button>
                                    </div>
                                )}
                            </div>

                            {imagePreview && (
                                <div className="mt-4">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="max-w-full h-40 object-cover rounded-md"
                                    />
                                </div>
                            )}

                            <span className="text-red-600 text-sm block mt-2">
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
                                    Post
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
