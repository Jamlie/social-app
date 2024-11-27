import { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./LoginForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { database } from "~/app/lib/database";
import { DarkModeToggle } from "../components/Sidebar/DarkModeToggle";

export const metadata: Metadata = {
    title: "Login",
    description: "A login page for this social media application",
};

export default async function Login() {
    const auth = database.auth;
    const cookie = await cookies();

    const sessionCookie = cookie.get("__session")?.value;
    if (sessionCookie) {
        const decodedCookie = await auth.verifySessionCookie(sessionCookie);
        if (decodedCookie) {
            redirect("/");
        }
    }

    return (
        <>
            <div className="flex justify-end bg-gray-50 dark:bg-background">
                <DarkModeToggle />
            </div>

            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 dark:bg-background">
                <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 dark:bg-foreground">
                    <div className="space-y-1 mb-6">
                        <h2 className="text-2xl font-bold text-black dark:text-white">
                            Welcome back
                        </h2>
                        <p className="text-gray-600 dark:text-gray-500">
                            Please enter your details to sign in
                        </p>
                    </div>
                    <LoginForm />
                    <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-500">
                        Don't have an account?{" "}
                        <Link
                            className="text-blue-600 dark:text-blue-500 hover:underline"
                            href="/register"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
