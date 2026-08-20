"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Calendar, Users, DollarSign, MessageSquare, BookOpen, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigation = [
    { name: "Alumni", href: "/alumni", icon: Users },
    { name: "Events", href: "/events", icon: Calendar },
    { name: "Jobs", href: "/jobs", icon: MessageSquare },
    { name: "Mentorship", href: "/mentorship", icon: BookOpen },
    { name: "Donations", href: "/donations", icon: DollarSign },
    ...(isAuthenticated && user?.role === "ADMIN" ? [{ name: "Admin", href: "/admin", icon: User }] : []),
  ];

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled ? "glass-strong shadow-sm border-white/20" : "bg-white/70 backdrop-blur-xl border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-[64px] items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Image
                src="/icons/icon-96x96.png"
                alt="Alumni Network"
                width={38}
                height={38}
                className="rounded-xl ring-1 ring-black/5 group-hover:scale-105 transition-transform"
              />
              <span className="absolute -right-1 -top-1 grid place-items-center w-4 h-4 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-white">
                <Sparkles className="w-2.5 h-2.5" />
              </span>
            </div>
            <span className="text-[15px] font-semibold tracking-tight text-zinc-900">
              Alumni<span className="text-zinc-500 font-medium">.network</span>
            </span>
          </Link>

          {/* Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-full transition-colors ${
                    active ? "text-zinc-900" : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-zinc-900/[0.06] border border-zinc-900/[0.06]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span className="relative flex items-center gap-1.5">
                    <Icon size={15} className={active ? "text-zinc-900" : "text-zinc-500"} />
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild className="rounded-full">
                      <Link href="/dashboard" className="flex items-center gap-1.5">
                        <User size={14} /> Dashboard
                      </Link>
                    </Button>
                    <span className="hidden lg:inline text-sm text-zinc-500 max-w-[140px] truncate">Hi, {user?.name}</span>
                    <Button variant="outline" size="sm" onClick={logout} className="rounded-full gap-1.5">
                      <LogOut size={14} /> Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild className="rounded-full">
                      <Link href="/auth/login">Log in</Link>
                    </Button>
                    <Button size="sm" asChild className="rounded-full shadow-sm bg-zinc-900 hover:bg-zinc-800 text-white">
                      <Link href="/auth/register">Join network</Link>
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen((v) => !v)}
            aria-label="Toggle menu"
            className="md:hidden grid place-items-center w-9 h-9 rounded-full border bg-white/80 backdrop-blur hover:bg-white transition-colors"
          >
            <motion.span initial={false} animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </motion.span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="md:hidden border-t bg-white/90 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navigation.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[15px] font-medium transition-colors ${
                        pathname === item.href ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-zinc-50"
                      }`}
                    >
                      <Icon size={16} />
                      {item.name}
                    </Link>
                  </motion.div>
                );
              })}
              <div className="pt-3 mt-3 border-t space-y-2">
                {!isLoading &&
                  (isAuthenticated ? (
                    <>
                      <Button asChild variant="outline" className="w-full rounded-xl">
                        <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                          Dashboard
                        </Link>
                      </Button>
                      <Button onClick={logout} variant="ghost" className="w-full rounded-xl">
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild variant="outline" className="w-full rounded-xl">
                        <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                          Log in
                        </Link>
                      </Button>
                      <Button asChild className="w-full rounded-xl bg-zinc-900 hover:bg-zinc-800">
                        <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                          Join network
                        </Link>
                      </Button>
                    </>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
