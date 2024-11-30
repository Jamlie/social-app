"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export function EditProfileModal({
    isOpen,
    onCloseAction,
    userId,
    initialName,
    initialBio,
}: {
    isOpen: boolean;
    onCloseAction: () => void;
    userId: string;
    initialName: string;
    initialBio: string;
}) {
    const [name, setName] = useState(initialName);
    const [bio, setBio] = useState(initialBio);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node) &&
                isOpen
            ) {
                onCloseAction();
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onCloseAction]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("/api/profile/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    bio,
                    uid: userId,
                }),
            });

            if (response.ok) {
                router.refresh();
                onCloseAction();
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Failed to update profile");
            }
        } catch (error) {
            console.error("Profile update error:", error);
            alert("An error occurred while updating profile");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div
                ref={modalRef}
                className="bg-white p-6 rounded-lg w-full max-w-md dark:bg-background"
            >
                <h2 className="text-xl font-bold mb-4 text-black dark:text-gray-200">
                    Edit Profile
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="name"
                            className="block mb-2 text-black dark:text-gray-200"
                        >
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            required
                            className="w-full px-3 py-2 border rounded-md text-black dark:text-gray-200"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="bio"
                            className="block mb-2 text-black dark:text-gray-200"
                        >
                            Bio
                        </label>
                        <textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell us about yourself"
                            maxLength={300}
                            className="w-full px-3 py-2 border rounded-md text-black dark:text-gray-200"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onCloseAction}
                            className="px-4 py-2 bg-gray-200 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                        >
                            {isLoading ? "Updating..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
