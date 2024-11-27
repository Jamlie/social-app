"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type PasswordOptions = {
    min: number;
    numbers?: boolean;
    capitalAlphabet?: boolean;
    smallAlphabet?: boolean;
    symbols?: boolean;
    space?: boolean;

    customSymbols?: string;
};

type FormResponse = {
    message?: string;
    error?: string;
};

const symbols = "!@#$%^&*()-_=+,.?/:;{}[]~";
const space = " ";

export function RegisterForm() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState<string | null>(null);
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState<string | null>(null);

    useEffect(() => {
        const err = validateUsername(username);
        if (err === null) {
            setUsernameError("");
            return;
        }

        setUsernameError(err.message);
    }, [username]);

    useEffect(() => {
        const err = validateEmail(email);
        if (err === null) {
            setEmailError("");
            return;
        }

        setEmailError(err.message);
    }, [email]);

    useEffect(() => {
        const err = validatePassword(password, {
            min: 8,
            numbers: false,
            smallAlphabet: true,
            capitalAlphabet: false,
        });
        if (err === null) {
            setPasswordError("");
            return;
        }

        setPasswordError(err.message);
    }, [password]);

    const [isSubmit, setIsSubmit] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    async function handleFormSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmit(true);

        if (usernameError || emailError || passwordError) {
            setSubmitError("Please fix the errors before submitting");
            setIsSubmit(false);
            return;
        }

        const form = e.currentTarget;
        const formData = new FormData(form as HTMLFormElement);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                body: formData,
            });

            const respJson = (await response.json()) as FormResponse;
            if (respJson.error) {
                setSubmitError(respJson.error);
                setIsSubmit(false);
                return;
            }

            router.push("/login");
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmit(false);
        }
    }

    return (
        <form onSubmit={handleFormSubmit} className="space-y-4">
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        ></path>
                    </svg>
                    <input
                        type="text"
                        name="username"
                        placeholder="username"
                        className="auth-link"
                        onChange={(e) => setUsername(e.currentTarget.value)}
                        required
                    />
                    <span className="text-red-600">{usernameError}</span>
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        ></path>
                    </svg>
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        className="auth-link"
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
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        ></path>
                    </svg>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="auth-link"
                        onChange={(e) => setEmail(e.currentTarget.value)}
                        required
                    />
                    <span className="text-red-600">{emailError}</span>
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
                        className="auth-link"
                        onChange={(e) => setPassword(e.currentTarget.value)}
                        required
                    />
                    <span className="text-red-600">{passwordError}</span>
                </div>
            </div>

            {submitError && (
                <div className="text-red-600 text-sm text-center">
                    {submitError}
                </div>
            )}

            <button
                type="submit"
                className="w-full bg-blue-600 dark:bg-blue-550 hover:bg-blue-700 dark:hover:bg-blue-650 text-white py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmit}
            >
                {isSubmit ? "Loading..." : "Sign Up"}
            </button>
        </form>
    );
}

function validateUsername(username: string): Error | null {
    if (username.length === 0) {
        return null;
    }

    if (username.length < 3) {
        return new Error("Username must be longer than 3 characters.");
    }

    return null;
}

function validateEmail(email: string): Error | null {
    if (email.length === 0) {
        return null;
    }

    const isValid = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email);
    if (isValid) {
        return null;
    }

    return new Error("Not a valid email address");
}

function validatePassword(
    password: string,
    options: PasswordOptions,
): Error | null {
    if (password.length === 0) {
        return null;
    }

    if (password.length < options.min) {
        return new Error(
            `Password must be greater than ${options.min} characters`,
        );
    }

    if (options.numbers && !/[0-9]/g.test(password)) {
        return new Error("Password must include at least one number");
    }

    if (options.smallAlphabet && !/[a-z]/g.test(password)) {
        return new Error("Password must include at least one small letter");
    }

    if (options.capitalAlphabet && !/[A-Z]/g.test(password)) {
        return new Error("Password must include at least one capital letter");
    }

    if (options.symbols) {
        if (
            options.customSymbols &&
            !password.includes(options.customSymbols)
        ) {
            return new Error(
                `Password must include at least one of ${options.customSymbols}`,
            );
        }

        if (!password.includes(symbols)) {
            return new Error(
                `Password must include at least one of ${symbols}`,
            );
        }
    }

    if (options.space && !password.includes(space)) {
        return new Error(`Password must include at least one space`);
    }

    return null;
}
