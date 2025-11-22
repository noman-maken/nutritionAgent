"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";

export default function VerifyEmailPage() {
    const [msg, setMsg] = useState({ type: "", text: "" });
    const [loading, setLoading] = useState(true);

    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) {
            setMsg({ type: "error", text: "Invalid verification link." });
            setLoading(false);
            return;
        }

        const verify = async () => {
            try {
                const res = await axios.post("/api/auth/verify-email", { token });
                setMsg({ type: "success", text: res.data.message });

                // Optional: redirect after 2 sec
                setTimeout(() => {
                    window.location.href = "/login";
                }, 2000);

            } catch (err) {
                const error = err.response?.data?.message || "Verification failed.";
                setMsg({ type: "error", text: error });
            }

            setLoading(false);
        };

        verify();
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md text-center">

                <h2 className="text-2xl font-bold text-gray-900">Email Verification</h2>
                <p className="text-gray-600 mt-2 mb-6">
                    Please wait while we verify your email…
                </p>

                {loading && <span className="text-blue-600">Verifying...</span>}

                {!loading && (
                    <p
                        className={`mt-4 text-lg font-medium ${
                            msg.type === "success" ? "text-green-600" : "text-red-600"
                        }`}
                    >
                        {msg.text}
                    </p>
                )}
            </div>
        </div>
    );
}
