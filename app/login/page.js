"use client";
import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: "", text: "" });

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg({ type: "", text: "" });

        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            const res = await axios.post("/api/auth/login", { email, password });

            setMsg({ type: "success", text: "Login successful!" });

            // redirect after success
            setTimeout(() => {
                window.location.href = "/";
            }, 800);

        } catch (err) {
            const error = err.response?.data?.message || "Invalid email or password.";
            setMsg({ type: "error", text: error });
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

                <h2 className="text-3xl font-bold text-gray-900 text-center">Login</h2>
                <p className="text-gray-500 text-center mb-6">
                    Welcome back to Nutrition Agent.
                </p>

                <form onSubmit={handleLogin} className="space-y-5">

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

                    {/* Password */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full mt-1 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div className="flex justify-end text-sm">
                        <a href="/forgot-password" className="text-blue-600 hover:underline">
                            Forgot Password?
                        </a>
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    <p className="text-center text-gray-600 text-sm mt-2">
                        Don&#39;t have an account?
                        <a href="/register" className="text-blue-600 ml-1 hover:underline">
                            Register
                        </a>
                    </p>
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
            </div>
        </div>
    );
}
