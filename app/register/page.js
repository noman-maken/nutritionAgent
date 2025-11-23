"use client";
import { useState } from "react";
import axios from "axios";
import baseUrl from "../../utils/baseUrl";
import { Mail, User } from "lucide-react";
import {toast} from "react-hot-toast";

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: "", text: "" });

    // 🚀 All form data stored in ONE STATE
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
    });

    // 🟦 Generic function for updating fields
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
            const res = await axios.post(`${baseUrl}/api/auth/user`, form);

            setMsg({ type: "success", text: res.data.message });
            toast.success(res.data.message);

            // 🟩 RESET ALL FIELDS AFTER SUCCESS
            setForm({
                first_name: "",
                last_name: "",
                email: "",
            });

        } catch (err) {
            if (err.response?.data) {
                setMsg({ type: "error", text: err.response.data.message });
                toast.error(err.response.data.message || "Something went wrong");
            } else {
                setMsg({ type: "error", text: "Something went wrong!" });
                toast.error("Something went wrong");
            }
        }

        setLoading(false);
    };

    return (
        <div className="
            min-h-screen flex items-center justify-center
            px-4 py-10
            bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100
        ">
            <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-md p-8">

                {/* Header */}
                <div className="mb-7 text-center">
                    <h1 className="
                        text-4xl font-extrabold bg-gradient-to-r
                        from-sky-600 via-indigo-600 to-purple-600
                        bg-clip-text text-transparent
                    ">
                        Create account
                    </h1>

                    <p className="mt-1 text-slate-600">
                        Join <span className="font-medium">Nutrition Agent</span> — your AI buddy.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* First Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            First Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                            <input
                                type="text"
                                name="first_name"
                                value={form.first_name}
                                onChange={handleChange}
                                required
                                className="h-11 w-full rounded-lg border border-slate-300 pl-10 pr-3 outline-none
                                    focus:ring-2 focus:ring-sky-500"
                            />
                        </div>
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Last Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                            <input
                                type="text"
                                name="last_name"
                                value={form.last_name}
                                onChange={handleChange}
                                required
                                className="h-11 w-full rounded-lg border border-slate-300 pl-10 pr-3 outline-none
                                    focus:ring-2 focus:ring-sky-500"
                            />
                        </div>
                    </div>

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
                                className="h-11 w-full rounded-lg border border-slate-300 pl-10 pr-3 outline-none
                                    focus:ring-2 focus:ring-sky-500"
                            />
                        </div>
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 rounded-full
                            bg-gradient-to-r from-sky-600 to-indigo-600
                            text-white font-semibold shadow-md
                            hover:from-sky-700 hover:to-indigo-700
                            transition disabled:opacity-60"
                    >
                        {loading ? "Creating..." : "Create account"}
                    </button>

                    <p className="text-center text-sm text-slate-700">
                        Already have an account?{" "}
                        <a href="/login" className="font-medium text-sky-600 hover:underline">
                            Login
                        </a>
                    </p>
                </form>

                {msg.text && (
                    <p
                        className={`mt-4 text-center text-sm ${
                            msg.type === "error" ? "text-rose-600" : "text-emerald-600"
                        }`}
                    >
                        {msg.text}
                    </p>
                )}
            </div>
        </div>
    );
}
