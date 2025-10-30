"use client";

import React, { useState } from "react";
import { AuthProvider, useAuth } from "../../../components/auth-provider";
import { useRouter } from "next/navigation";
import Background3D from "../../../components/3d-background";

function SignUpForm() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password) return setError("Please enter email and password");
    if (password !== confirm) return setError("Passwords do not match");
    try {
      setLoading(true);
      await signUp(email, password);
      router.push("/");
    } catch (err: any) {
      setError(err?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white/95 p-8 rounded-lg shadow relative z-20 backdrop-blur-sm">
      <h1 className="text-2xl font-bold mb-4">Create an account</h1>
      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            className="mt-1 block w-full rounded-md border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Password</span>
          <input
            type="password"
            className="mt-1 block w-full rounded-md border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Confirm Password</span>
          <input
            type="password"
            className="mt-1 block w-full rounded-md border px-3 py-2"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </label>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>
    </div>
  );
}

export default function Page() {
  return (
    <AuthProvider>
      <main className="min-h-screen flex items-center justify-center p-6 bg-gray-50 relative overflow-hidden">
        {/* 3D background canvas positioned behind the form; use z-0 so it's visible under content */}
        <Background3D className="z-0" />

        {/* Foreground form */}
        <div className="w-full max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left: a subtle panel with headline / illustration space */}
            <div className="hidden md:block px-6">
              <div className="text-left">
                <h2 className="text-3xl font-extrabold mb-4">Join GPS Srinagar</h2>
                <p className="text-neutral-600">Create your student account to access campus resources, events and announcements.</p>
              </div>
            </div>

            {/* Right: form */}
            <div className="px-6">
              <div className="relative z-40">
                <SignUpForm />
              </div>
            </div>
          </div>
        </div>
      </main>
    </AuthProvider>
  );
}
