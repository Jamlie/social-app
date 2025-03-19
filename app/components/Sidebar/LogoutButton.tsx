"use client";

import { LogOut } from "lucide-react";
import { logout } from "./actions/logout";
import { getAuth, signOut } from "firebase/auth";
import { app } from "~/app/lib/firebaseClient";
import { useRouter } from "next/router";

export function LogoutButton() {
    const router = useRouter();

    async function handleLogout(e: React.FormEvent) {
        e.preventDefault();
        try {
            await signOut(getAuth(app));
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

    return (
        <form onSubmit={handleLogout} action={logout}>
            <button
                type="submit"
                className="flex items-center px-4 py-3 text-xl text-gray-900 dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-background w-full"
            >
                <span className="flex pl-0.5">
                    <LogOut />
                </span>
                <span className="ml-3.5">Sign out</span>
            </button>
        </form>
    );
}
