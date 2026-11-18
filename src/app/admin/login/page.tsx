"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, KeyRound, ShieldAlert, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("enagmoahed@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-darkest flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-cyber-grid opacity-25 pointer-events-none" />

      {/* Decorative Cyan Glow Orb */}
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-cyber-cyan/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-cyber-blue/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Container */}
      <div className="w-full max-w-md bg-cyber-card/90 border border-cyber-cardBorder rounded-2xl p-8 shadow-card-3d relative z-10 backdrop-blur-xl">
        {/* Brand Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/40 flex items-center justify-center text-cyber-cyan mx-auto shadow-cyan-glow">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-display font-extrabold text-white tracking-tight">
            Admin Management Portal
          </h1>
          <p className="text-xs font-mono text-slate-400">
            Mohamed Ali &bull; Digital Identity Administration
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-mono flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 block">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="enagmoahed@gmail.com"
                className="w-full bg-cyber-darkest border border-cyber-cardBorder rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyber-cyan transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 block">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-cyber-darkest border border-cyber-cardBorder rounded-xl pl-10 pr-10 py-2.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyber-cyan transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-cyber-cyan hover:bg-white text-cyber-darkest font-display font-bold text-xs uppercase tracking-wider transition-all shadow-cyan-glow disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Secure Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-xs font-mono text-slate-400 hover:text-cyber-cyan transition-colors"
          >
            &larr; Return to Public Digital Identity Card
          </a>
        </div>
      </div>
    </div>
  );
}
