"use client";

import { useState } from "react";
import { EditProfileModal } from "./EditProfileModal";

export function EditProfileClient({
    userId,
    initialName,
    initialBio,
}: {
    userId: string;
    initialName: string;
    initialBio: string;
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
                Edit Profile
            </button>
            <EditProfileModal
                isOpen={isModalOpen}
                onCloseAction={() => setIsModalOpen(false)}
                userId={userId}
                initialName={initialName}
                initialBio={initialBio}
            />
        </>
    );
}
