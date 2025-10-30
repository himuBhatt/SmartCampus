"use client";

import React, { useState } from "react";
import { AuthProvider } from "../../components/auth-provider";
import Background3D from "../../components/3d-background";
import { SignUpForm, LoginForm } from "../../components/auth-forms";
import { User, UserPlus } from "lucide-react";

export default function Page() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <AuthProvider>
      <main className="min-h-screen flex items-center justify-center p-6 bg-gray-50 relative overflow-hidden">
        <Background3D className="z-0" />

        <div className="w-full max-w-5xl mx-auto relative z-40">
          <div className="flex items-center justify-center mb-6">
            <div
              role="tablist"
              aria-label="Authentication tabs"
              className="inline-flex items-center bg-neutral-100 rounded-full p-1 shadow-sm"
            >
              <button
                role="tab"
                aria-pressed={mode === "login"}
                onClick={() => setMode("login")}
                className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-200 ${
                  mode === "login"
                    ? "bg-white text-foreground shadow-md ring-1 ring-blue-200"
                    : "text-neutral-600 hover:bg-white/60"
                }`}
              >
                <User size={16} />
                <span className="font-medium">Sign in</span>
              </button>

              <button
                role="tab"
                aria-pressed={mode === "signup"}
                onClick={() => setMode("signup")}
                className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-200 ${
                  mode === "signup"
                    ? "bg-white text-foreground shadow-md ring-1 ring-blue-200"
                    : "text-neutral-600 hover:bg-white/60"
                }`}
              >
                <UserPlus size={16} />
                <span className="font-medium">Create account</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="hidden md:block px-6">
              <h2 className="text-3xl font-extrabold mb-4">Welcome to GPS Srinagar</h2>
              <p className="text-neutral-600">Access campus services, events and notices with your account.</p>
            </div>

            <div className="px-6">
              {mode === "login" ? <LoginForm /> : <SignUpForm />}
            </div>
          </div>
        </div>
      </main>
    </AuthProvider>
  );
}
