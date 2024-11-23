import { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./LoginForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { database } from "~/app/lib/database";

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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
                <div className="space-y-1 mb-6">
                    <h2 className="text-2xl font-bold">Welcome back</h2>
                    <p className="text-gray-600">
                        Please enter your details to sign in
                    </p>
                </div>
                <LoginForm />
                <div className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link
                        className="text-blue-600 hover:underline"
                        href="/register"
                    >
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
}
