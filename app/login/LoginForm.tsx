"use client";

import {
    getAuth,
    inMemoryPersistence,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { app } from "~/app/lib/firebaseClient";

export function LoginForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const auth = getAuth(app);
    auth.setPersistence(inMemoryPersistence);

    async function handleFormLogin(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
        const email = formData.get("email")?.toString();
        const password = formData.get("password")?.toString();

        if (!email || !password) {
            setError("Invalid form data");
            setLoading(false);
            return;
        }

        let idToken: string = "";

        try {
            const userCredentials = await signInWithEmailAndPassword(
                auth,
                email,
                password,
            );

            idToken = await userCredentials.user.getIdToken();
        } catch (e) {
            setError("Invalid credentials");
        } finally {
            setLoading(false);
        }

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorMessage =
                    (await response.json())?.error || "Login failed";
                throw new Error(errorMessage);
            }

            if (response.redirected) {
                router.push(response.url);
            }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleFormLogin} className="space-y-4">
            {error && (
                <div className="text-red-500 bg-red-100 p-2 rounded">
                    {error}
                </div>
            )}
            <div className="space-y-2">
                <div className="relative">
                    <svg
                        className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        ></path>
                    </svg>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
            </div>
            <div className="space-y-2">
                <div className="relative">
                    <svg
                        className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        ></path>
                    </svg>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
            </div>
            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                id="login-btn"
                disabled={loading}
            >
                {loading ? "Signing in..." : "Sign in"}
            </button>
        </form>
    );
}
