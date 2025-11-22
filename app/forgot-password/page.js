"use client";
import { useState } from "react";
import axios from "axios";

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: "", text: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg({ type: "", text: "" });

        const email = e.target.email.value;

        try {
            const res = await axios.post("/api/auth/forgot", { email });

            setMsg({
                type: "success",
                text: "Password reset link has been sent to your email.",
            });

        } catch (err) {
            const error = err.response?.data?.message || "Unable to send reset link.";
            setMsg({ type: "error", text: error });
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md">

                <h2 className="text-2xl font-bold text-gray-900 text-center">Forgot Password?</h2>
                <p className="text-gray-600 text-center mb-6">
                    Enter your email and we&#39;ll send you a reset link.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Email */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full mt-1 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                {msg.text && (
                    <p
                        className={`mt-4 text-center text-sm ${
                            msg.type === "error" ? "text-red-600" : "text-green-600"
                        }`}
                    >
                        {msg.text}
                    </p>
                )}

                <p className="text-center text-gray-600 text-sm mt-4">
                    Remember your password?
                    <a href="/login" className="text-blue-600 ml-1 hover:underline">
                        Login
                    </a>
                </p>

            </div>
        </div>
    );
}
