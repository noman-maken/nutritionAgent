"use client";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Mail } from "lucide-react";

export default function ForgotPasswordPage() {

    // ⬅️ Unified form state
    const [form, setForm] = useState({
        email: "",
    });

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: "", text: "" });

    // ⬅️ Generic update handler
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg({ type: "", text: "" });

        try {
            await axios.post("/api/auth/forgot", form);

            setMsg({
                type: "success",
                text: "If an account exists, a reset email has been sent.",
            });

            toast.success("If an account exists, a reset email has been sent.");

            // ⬅️ RESET form after sending
            setForm({ email: "" });

        } catch (err) {
            const error = err.response?.data?.message || "Unable to send reset link.";
            setMsg({ type: "error", text: error });
        }

        setLoading(false);
    };

    return (
        <div
            className="
            min-h-screen flex items-center justify-center px-4
            bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100
        ">
            <div className="max-w-md w-full bg-white border border-slate-200 p-8 rounded-2xl shadow-md">

                {/* Heading */}
                <h2
                    className="
                    text-3xl font-extrabold text-center mb-2
                    bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600
                    bg-clip-text text-transparent
                "
                >
                    Forgot Password?
                </h2>

                <p className="text-slate-600 text-center mb-6">
                    Enter your email and we’ll send you a reset link.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                placeholder="Your email"
                                className="h-11 w-full rounded-lg border border-slate-300 pl-10 pr-3 outline-none
                                    focus:ring-2 focus:ring-sky-500"
                            />
                        </div>
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            h-12 w-full rounded-full
                            bg-gradient-to-r from-sky-600 to-indigo-600
                            text-white font-semibold shadow-md
                            hover:from-sky-700 hover:to-indigo-700
                            transition disabled:opacity-60
                        "
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                {/* Message */}
                {msg.text && (
                    <p
                        className={`mt-4 text-center text-sm ${
                            msg.type === "error" ? "text-rose-600" : "text-emerald-600"
                        }`}
                    >
                        {msg.text}
                    </p>
                )}

                {/* Footer link */}
                <p className="text-center text-slate-700 text-sm mt-4">
                    Remember your password?
                    <a href="/login" className="text-sky-600 ml-1 hover:underline">
                        Login
                    </a>
                </p>

            </div>
        </div>
    );
}
