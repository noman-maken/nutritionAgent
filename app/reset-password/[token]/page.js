"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function ResetPasswordPage({ params }) {
    const token = params?.token;
    const router = useRouter();

    const { register, handleSubmit, watch, reset } = useForm({
        defaultValues: { password: "", confirm: "" },
    });

    const [checking, setChecking] = useState(true);
    const [valid, setValid] = useState(false);
    const [loading, setLoading] = useState(false);

    // Validate token on mount
    useEffect(() => {
        let active = true;

        (async () => {
            if (!token) {
                setChecking(false);
                setValid(false);
                return;
            }

            try {
                const res = await axios.get(
                    `/api/auth/reset?token=${encodeURIComponent(token)}`
                );
                if (active) setValid(!!res.data.valid);
            } catch {
                if (active) setValid(false);
            } finally {
                if (active) setChecking(false);
            }
        })();

        return () => {
            active = false;
        };
    }, [token]);

    // Submit password
    const onSubmit = async (data) => {
        if (data.password !== data.confirm) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            await axios.post("/api/auth/reset", { token, password: data.password });
            toast.success("Password updated successfully!");

            reset();
            router.push("/login");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="
                min-h-screen flex items-center justify-center px-4
                bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100
            "
        >
            <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-md p-8">

                {/* Heading */}
                <h2
                    className="
                        text-3xl font-extrabold text-center mb-2
                        bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600
                        bg-clip-text text-transparent
                    "
                >
                    Reset Password
                </h2>

                <p className="text-slate-600 text-center mb-6">
                    Set a new password for your account.
                </p>

                {/* Token check */}
                {checking ? (
                    <p className="text-center text-slate-600">Validating link...</p>
                ) : !valid ? (
                    <div className="text-center">
                        <p className="text-rose-600 mb-4">
                            This reset link is invalid or expired.
                        </p>
                        <a href="/forgot-password" className="text-sky-600 underline">
                            Request a new link
                        </a>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {/* New Password */}
                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-1 block">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    minLength={8}
                                    required
                                    {...register("password")}
                                    className="h-11 w-full rounded-lg border border-slate-300
                                        pl-10 pr-3 outline-none
                                        focus:ring-2 focus:ring-sky-500"
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-1 block">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    minLength={8}
                                    required
                                    {...register("confirm")}
                                    className="h-11 w-full rounded-lg border border-slate-300
                                        pl-10 pr-3 outline-none
                                        focus:ring-2 focus:ring-sky-500"
                                />
                            </div>

                            {watch("confirm") &&
                                watch("confirm") !== watch("password") && (
                                    <p className="text-xs text-rose-600 mt-1">
                                        Passwords do not match.
                                    </p>
                                )}
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
                            {loading ? "Updating..." : "Set New Password"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
