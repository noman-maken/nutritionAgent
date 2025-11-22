"use client";
import { useState } from "react";
import axios from "axios";
import baseUrl from "../../utils/baseUrl";

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: "", text: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg({ type: "", text: "" });

        const first_name = e.target.first_name.value;
        const last_name = e.target.last_name.value;
        const email = e.target.email.value;

        try {
            const res = await axios.post( `${baseUrl}/api/user`, {
                first_name,
                last_name,
                email,
            });

            setMsg({ type: "success", text: res.data.message });

        } catch (err) {
            if (err.response && err.response.data) {
                setMsg({ type: "error", text: err.response.data.message });
            } else {
                setMsg({ type: "error", text: "Something went wrong!" });
            }
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-100">

                <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
                    Create Your Account
                </h2>
                <p className="text-gray-500 text-center mb-6">
                    Join Nutrition Agent — Your AI nutrition buddy.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* First Name */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">First Name</label>
                        <input
                            type="text"
                            name="first_name"
                            required
                            className="w-full mt-1 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Last Name</label>
                        <input
                            type="text"
                            name="last_name"
                            required
                            className="w-full mt-1 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

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
                        className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition duration-200 disabled:bg-blue-300"
                    >
                        {loading ? "Creating..." : "Create Account"}
                    </button>

                    <p className="text-center text-gray-600 text-sm">
                        Already have an account?{" "}
                        <a href="/login" className="text-blue-600 font-medium hover:underline">
                            Login
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
