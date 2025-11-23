"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
    const { register, handleSubmit, reset } = useForm({
        defaultValues: { email: "", password: "" },
    });

    const [isPending, startTransition] = useTransition();

    const onSubmit = (data) => {
        startTransition(async () => {
            const response = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (response?.ok) {
                toast.success("Login successful!");
                window.location.assign("/");
                reset();
            } else if (response?.error) {
                toast.error(response.error || "Invalid email or password.");
            } else {
                toast.error("Something went wrong.");
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4
            bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100">

            <div className="w-full max-w-md bg-white border border-slate-200
                rounded-2xl shadow-md p-8">

                {/* Heading */}
                <h2 className="
                    text-4xl font-extrabold text-center mb-2
                    bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600
                    bg-clip-text text-transparent
                ">
                    Login
                </h2>

                <p className="text-slate-600 text-center mb-6">
                    Welcome back to Nutrition Agent.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    {/* Email */}
                    <div>
                        <label className="text-sm font-medium text-slate-700 mb-1 block">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2
                                text-slate-400 h-4 w-4" />
                            <input
                                type="email"
                                placeholder="Your email"
                                required
                                {...register("email")}
                                className="h-11 w-full rounded-lg border border-slate-300
                                    pl-10 pr-3 outline-none
                                    focus:ring-2 focus:ring-sky-500"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-sm font-medium text-slate-700 mb-1 block">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2
                                text-slate-400 h-4 w-4" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                required
                                {...register("password")}
                                className="h-11 w-full rounded-lg border border-slate-300
                                    pl-10 pr-3 outline-none
                                    focus:ring-2 focus:ring-sky-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end text-sm">
                        <a href="/forgot-password" className="text-sky-600 hover:underline">
                            Forgot Password?
                        </a>
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={isPending}
                        className="h-12 w-full rounded-full
                            bg-gradient-to-r from-sky-600 to-indigo-600
                            text-white font-semibold shadow-md
                            hover:from-sky-700 hover:to-indigo-700
                            transition disabled:opacity-60"
                    >
                        {isPending ? "Logging in..." : "Login"}
                    </button>

                    <p className="text-center text-sm text-slate-700 mt-2">
                        Don’t have an account?
                        <a href="/register" className="text-sky-600 ml-1 hover:underline">
                            Register
                        </a>
                    </p>
                </form>

            </div>
        </div>
    );
}
