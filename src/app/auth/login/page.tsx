"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { Sparkles, ShieldCheck } from "lucide-react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isAuthenticated) router.push(searchParams.get("redirect") || "/dashboard");
  }, [isAuthenticated, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true);
    try {
      const ok = await login(email, password);
      if (ok) { toast.success("Welcome back!"); router.push(searchParams.get("redirect") || "/dashboard"); }
      else toast.error("Check your credentials.");
    } catch { toast.error("Something went wrong."); } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — animated blobs */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-zinc-950 text-white p-8">
        <div className="absolute inset-0">
          <motion.div animate={{ y: [-10, 10, -10], x: [-6, 6, -6] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-violet-600/40 blur-3xl" />
          <motion.div animate={{ y: [10, -10, 10], x: [8, -8, 8] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>
        <div className="relative">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs backdrop-blur"><Sparkles className="w-3 h-3" /> Alumni Network</Link>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight leading-tight">Sign in with <span className="bg-gradient-to-r from-violet-300 to-blue-300 bg-clip-text text-transparent">delight</span></h1>
          <p className="mt-2 text-sm text-white/70 max-w-sm">Fields focus with a soft glow, buttons spring. Your session is secure and PWA-ready.</p>
        </div>
        <div className="relative flex items-center gap-2 text-xs text-white/60"><ShieldCheck className="w-4 h-4" /> Encrypted • SSO-ready • 2FA soon</div>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center p-6 sm:p-8 bg-[#FCFCF9]">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <Card className="rounded-[20px] border-zinc-200 shadow-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl tracking-tight">Welcome back</CardTitle>
              <CardDescription>Sign in to your alumni account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} required className="h-11 rounded-xl focus-visible:ring-2 focus-visible:ring-violet-500 transition-shadow" />
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required className="h-11 rounded-xl focus-visible:ring-2 focus-visible:ring-violet-500" />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <Button type="submit" className="w-full h-11 rounded-xl bg-zinc-900 hover:bg-zinc-800" disabled={isLoading}>
                    {isLoading ? <span className="inline-flex items-center gap-2"><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Signing in…</span> : "Sign in"}
                  </Button>
                </motion.div>
              </form>
              <div className="mt-6 text-center text-sm text-zinc-600">Don’t have an account? <Link href="/auth/register" className="font-medium text-zinc-900 hover:underline">Create one</Link></div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen grid place-items-center"><div className="w-8 h-8 rounded-full border-2 border-zinc-900 border-t-transparent animate-spin" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
