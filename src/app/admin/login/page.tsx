"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const userId = data.user?.id;
    if (!userId) {
      setError("Unable to read authenticated user.");
      setLoading(false);
      return;
    }

    const { data: adminRows, error: adminError } = await supabase
      .from("admin_users")
      .select("id")
      .eq("user_id", userId)
      .eq("is_active", true)
      .limit(1);

    if (adminError) {
      await supabase.auth.signOut();
      setError("Admin access is not configured yet. Please run CMS admin SQL setup.");
      setLoading(false);
      return;
    }

    if (!adminRows || adminRows.length === 0) {
      await supabase.auth.signOut();
      setError("This account is not authorized to access the dashboard.");
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute top-0 left-0 w-full h-full opacity-10" viewBox="0 0 1200 800" preserveAspectRatio="none">
          <path d="M0,400 Q300,200 600,400 T1200,300" fill="none" stroke="#8B0000" strokeWidth="2" />
          <path d="M0,450 Q300,250 600,450 T1200,350" fill="none" stroke="#8B0000" strokeWidth="2" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to website</span>
        </Link>

        <div className="bg-[#121212] rounded-3xl p-8 shadow-2xl border border-white/5">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 relative">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="20" fill="none" stroke="#B21E35" strokeWidth="8" />
                <circle cx="50" cy="50" r="8" fill="#B21E35" />
                <path d="M30,20 Q30,50 30,80" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" />
                <path d="M70,20 Q70,50 70,80" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white text-center mb-2">Admin Login</h1>
          <p className="text-white/50 text-center text-sm mb-8">Sign in to access the CMS dashboard</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-6">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#B21E35] transition-colors"
                  placeholder="admin@radioppidunia.org"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#B21E35] transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#B21E35] hover:bg-[#8B0000] text-white py-6 rounded-xl font-bold text-lg transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>

        <p className="text-white/30 text-center text-xs mt-6">
          © 2025 Radio PPI Dunia. Admin access only.
        </p>
      </motion.div>
    </div>
  );
}
