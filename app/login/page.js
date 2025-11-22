"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";

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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

                <h2 className="text-3xl font-bold text-gray-900 text-center">Login</h2>
                <p className="text-gray-500 text-center mb-6">
                    Welcome back to Nutrition Agent.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    {/* Email */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            placeholder="Your email"
                            className="w-full mt-1 px-4 py-2.5 border rounded-lg
                                       focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                            {...register("email")}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full mt-1 px-4 py-2.5 border rounded-lg
                                       focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                            {...register("password")}
                        />
                    </div>

                    <div className="flex justify-end text-sm">
                        <a href="/forgot-password" className="text-blue-600 hover:underline">
                            Forgot Password?
                        </a>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold
                                   hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        {isPending ? "Logging in..." : "Login"}
                    </button>

                    <p className="text-center text-gray-600 text-sm mt-2">
                        Don&apos;t have an account?
                        <a href="/register" className="text-blue-600 ml-1 hover:underline">
                            Register
                        </a>
                    </p>
                </form>

            </div>
        </div>
    );
}
