"use client";
import { Images } from "lucide-react";
import { useState, useRef } from "react";

export function MobilePostModal() {
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
            const maxSize = 5 * 1024 * 1024;
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
                className="fixed right-4 bottom-20 md:hidden bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg"
            >
                <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    ></path>
                </svg>
            </button>
            {openModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50"
                    onClick={() => setOpenModal(false)}
                >
                    <div
                        className="bg-white dark:bg-foreground w-full h-full flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                            <button
                                onClick={() => setOpenModal(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                Cancel
                            </button>
                            <h2 className="text-xl font-bold dark:text-white">
                                Compose new Post
                            </h2>
                            <button
                                type="submit"
                                form="mobilePostForm"
                                className="text-blue-500 hover:text-blue-600 font-semibold"
                            >
                                Post
                            </button>
                        </div>
                        <form
                            id="mobilePostForm"
                            onSubmit={handleFormPost}
                            method="POST"
                            className="flex-grow flex flex-col p-4"
                        >
                            <textarea
                                name="content"
                                rows={6}
                                className="w-full flex-grow text-black dark:text-white p-2 border-none resize-none focus:outline-none"
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
                                    id="mobileImageUpload"
                                />
                                <label
                                    htmlFor="mobileImageUpload"
                                    className="cursor-pointer mr-2 text-blue-500 hover:text-blue-600"
                                >
                                    <Images size={24} />
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
                                <div className="mt-4 relative">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-64 object-cover rounded-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleImageRemove}
                                        className="absolute top-2 right-2 bg-gray-700 bg-opacity-50 text-white rounded-full p-1"
                                    >
                                        ✖
                                    </button>
                                </div>
                            )}

                            {postError && (
                                <span className="text-red-600 text-sm block mt-2">
                                    {postError}
                                </span>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
