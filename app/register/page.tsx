import { Metadata } from "next";
import { RegisterForm } from "./RegisterForm";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { database } from "~/app/lib/database";

export const metadata: Metadata = {
    title: "Sign Up",
    description: "A sign up page for this social media application",
};

export default async function Register() {
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 dark:bg-background">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 dark:bg-foreground">
                <div className="space-y-1 mb-6">
                    <h2 className="text-2xl font-bold text-black dark:text-white">
                        Create an account
                    </h2>
                    <p className="text-gray-600 dark:text-gray-500">
                        Enter your details below to create your account
                    </p>
                </div>
                <RegisterForm />
                <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-500">
                    Already have an account?{" "}
                    <Link
                        className="text-blue-600 dark:text-blue-500 hover:underline"
                        href="/login"
                    >
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
