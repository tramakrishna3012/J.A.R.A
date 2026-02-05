"use client";

import Link from "next/link";

export default function AuthCodeError() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
            <div className="max-w-md w-full text-center">
                <h1 className="text-4xl font-bold mb-4 text-red-500">Authentication Error</h1>
                <p className="text-gray-400 mb-8">
                    We encountered an issue logging you in with Google.
                </p>
                <div className="space-y-4">
                    <Link
                        href="/login"
                        className="block w-full py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition"
                    >
                        Try Again
                    </Link>
                    <Link
                        href="/"
                        className="block w-full py-3 border border-white/10 rounded-lg text-gray-400 hover:text-white transition"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
