"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

                <h2 className="text-3xl font-bold text-gray-900 text-center">
                    Reset Password
                </h2>

                <p className="text-gray-500 text-center mb-6">
                    Set a new password for your account.
                </p>

                {/* Token check */}
                {checking ? (
                    <p className="text-center text-gray-600">Validating link...</p>
                ) : !valid ? (
                    <div className="text-center">
                        <p className="text-red-600 mb-4">
                            This reset link is invalid or expired.
                        </p>
                        <a href="/forgot-password" className="text-blue-600 underline">
                            Request a new link
                        </a>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                        {/* New Password */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full mt-1 px-4 py-2.5 border rounded-lg
                                          focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                                minLength={8}
                                {...register("password")}
                            />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full mt-1 px-4 py-2.5 border rounded-lg
                                          focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                                minLength={8}
                                {...register("confirm")}
                            />
                            {watch("confirm") &&
                                watch("confirm") !== watch("password") && (
                                    <p className="text-xs text-red-500 mt-1">
                                        Passwords do not match.
                                    </p>
                                )}
                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold
                                       hover:bg-blue-700 disabled:bg-blue-300"
                        >
                            {loading ? "Updating..." : "Set New Password"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
