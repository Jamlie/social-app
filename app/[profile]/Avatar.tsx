"use client";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";

export function Avatar({ pfp }: { pfp: string }) {
    const router = useRouter();
    const [profilePic, setProfilePic] = useState(pfp);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node)
            ) {
                handleCancel();
            }
        }

        if (isModalOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isModalOpen]);

    function handleFileSelect(file: File) {
        if (!file.type.startsWith("image/")) {
            alert("Please select an image file");
            return;
        }

        setSelectedFile(file);
        const preview = URL.createObjectURL(file);
        setPreviewUrl(preview);
    }

    async function handleSave() {
        if (!selectedFile) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("image", selectedFile);

        try {
            const response = await fetch("/api/upload/pfp", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Upload failed");

            const photoData = await response.json();
            setProfilePic(photoData.pfp);
            handleCancel();
            router.refresh();
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload image");
        } finally {
            setIsUploading(false);
        }
    }

    const handleCancel = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setSelectedFile(null);
        setPreviewUrl(null);
        setIsModalOpen(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <>
            <div className="avatar">
                <div className="w-16 h-16 rounded-full">
                    <img
                        src={profilePic}
                        alt="User Avatar"
                        className="cursor-pointer hover:opacity-80 transition-opacity w-full h-full object-cover rounded-full"
                        onClick={() => setIsModalOpen(true)}
                    />
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div
                        ref={modalRef}
                        className="bg-white dark:bg-background rounded-lg p-6 w-full max-w-md mx-4 shadow-xl"
                    >
                        <div className="flex flex-col items-center space-y-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Update Profile Picture
                            </h2>

                            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
                                <img
                                    src={previewUrl || pfp}
                                    alt="Profile Preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                            >
                                Choose Image
                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                        handleFileSelect(e.target.files[0]);
                                    }
                                }}
                            />

                            <div className="flex justify-between w-full mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={!selectedFile || isUploading}
                                    className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                                        ${
                                            !selectedFile || isUploading
                                                ? "bg-blue-400 cursor-not-allowed"
                                                : "bg-blue-600 hover:bg-blue-700"
                                        }`}
                                >
                                    {isUploading
                                        ? "Uploading..."
                                        : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
