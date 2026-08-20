"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, BookOpen, DollarSign, ArrowRight, Star, Trophy, Heart, Globe, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import WaveAnimation from "@/components/WaveAnimation";
import HorizontalScroll from "@/components/HorizontalScroll";
import { Reveal, Stagger, StaggerItem, AnimatedCounter, ScrollProgress, TiltCard } from "@/components/motion";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  const features = [
    {
      title: "Alumni Directory",
      description: "Connect with fellow alumni and discover career opportunities across industries",
      icon: Users,
      href: "/alumni",
      color: "from-blue-500 to-cyan-500",
      accent: "bg-blue-50 text-blue-600",
    },
    {
      title: "Events & Reunions",
      description: "Stay updated with upcoming events, reunions, and networking opportunities",
      icon: Calendar,
      href: "/events",
      color: "from-violet-500 to-fuchsia-500",
      accent: "bg-violet-50 text-violet-600",
    },
    {
      title: "Mentorship Program",
      description: "Find experienced mentors or become one to guide fellow alumni",
      icon: BookOpen,
      href: "/mentorship",
      color: "from-emerald-500 to-teal-500",
      accent: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Give Back",
      description: "Support your alma mater through donations and meaningful contributions",
      icon: DollarSign,
      href: "/donations",
      color: "from-orange-500 to-red-500",
      accent: "bg-orange-50 text-orange-600",
    },
  ];

  const stats = [
    { label: "Alumni Registered", value: "5,000+", icon: Users },
    { label: "Events Hosted", value: "150+", icon: Calendar },
    { label: "Mentorship Connections", value: "800+", icon: Heart },
    { label: "Donations Raised", value: "$2M+", icon: Trophy },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer at Google",
      year: "Class of 2018",
      content: "The alumni network helped me land my dream job. The mentorship program connected me with industry leaders who guided my career path.",
      rating: 5,
    },
    {
      name: "Michael Rodriguez",
      role: "Startup Founder",
      year: "Class of 2015",
      content: "Through this platform, I found my co-founder and received invaluable advice from experienced entrepreneurs in our network.",
      rating: 5,
    },
    {
      name: "Dr. Emily Johnson",
      role: "Research Scientist",
      year: "Class of 2012",
      content: "The ongoing connections and collaborative opportunities have been instrumental in advancing my research and career.",
      rating: 5,
    },
    {
      name: "Arjun Patel",
      role: "Product Manager at Amazon",
      year: "Class of 2017",
      content: "The community is genuinely helpful — from referrals to real mentorship. It feels like an extended family.",
      rating: 5,
    },
    {
      name: "Lisa Wang",
      role: "UX Lead at Figma",
      year: "Class of 2016",
      content: "Beautifully built and actually useful. I’ve both received and given mentorship here.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FCFCF9]">
      <ScrollProgress />

      {/* HERO */}
      <section className="relative overflow-hidden bg-zinc-950 text-white">
        {/* aurora blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full bg-violet-600/30 blur-[100px] animate-blob" />
          <div className="absolute -top-20 right-0 h-[560px] w-[560px] rounded-full bg-blue-600/25 blur-[100px] animate-blob" style={{ animationDelay: "-6s" }} />
          <div className="absolute bottom-0 left-1/2 h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-teal-500/20 blur-[110px] animate-blob" style={{ animationDelay: "-12s" }} />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-28 lg:pt-20 lg:pb-36">
          {/* top badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur text-xs font-medium text-white/80"
          >
            <span className="grid place-items-center w-5 h-5 rounded-full bg-white text-zinc-900">
              <Sparkles className="w-3 h-3" />
            </span>
            Future-ready alumni experience • Built with Next 16 & Turbopack
          </motion.div>

          <div className="mt-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <div className="absolute -inset-3 bg-gradient-to-r from-violet-600 to-blue-600 rounded-full blur-xl opacity-40 animate-pulse" />
                <Image
                  src="/icons/icon-192x192.png"
                  alt="Alumni Network"
                  width={92}
                  height={92}
                  className="relative rounded-[22px] shadow-2xl ring-1 ring-white/20"
                />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
              className="mx-auto max-w-4xl text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-semibold tracking-[-0.03em] leading-[0.95]"
            >
              Welcome to our
              <br />
              <span className="bg-gradient-to-r from-white via-violet-200 to-blue-200 bg-clip-text text-transparent">Alumni Network</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.28 }}
              className="mx-auto mt-5 max-w-2xl text-[15px] sm:text-base leading-relaxed text-white/70"
            >
              Connect, grow, and give back. Join <span className="text-white font-medium">thousands of alumni</span> building lasting relationships and creating opportunities together — with a delightful, fast, and accessible experience.
            </motion.p>

            {!isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.36 }}
                className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
              >
                {isAuthenticated ? (
                  <>
                    <Button size="lg" asChild className="rounded-full px-8 h-11 bg-white text-zinc-900 hover:bg-zinc-100 shadow-lg group">
                      <Link href="/alumni" className="flex items-center gap-2">
                        Browse Alumni <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="rounded-full px-8 h-11 border-white/20 bg-white/5 text-white hover:bg-white hover:text-zinc-900 backdrop-blur">
                      <Link href="/events">View Events</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="lg" asChild className="rounded-full px-8 h-11 bg-white text-zinc-900 hover:bg-zinc-100 shadow-lg group">
                      <Link href="/auth/register" className="flex items-center gap-2">
                        Join network <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="rounded-full px-8 h-11 border-white/15 bg-white/5 text-white hover:bg-white hover:text-zinc-900">
                      <Link href="/alumni">Browse Alumni</Link>
                    </Button>
                  </>
                )}
              </motion.div>
            )}

            {/* trust row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-white/60"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Verified alumni</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1.5"><Zap className="w-3.5 h-3.5" /> Instant search</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1.5"><Globe className="w-3.5 h-3.5" /> PWA-ready</span>
            </motion.div>
          </div>

          {/* stats */}
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.06, duration: 0.5 }}
                  className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl p-5 hover:bg-white/[0.08] transition-colors"
                >
                  <Icon className="w-5 h-5 text-white/70 mb-3" />
                  <div className="text-2xl font-semibold tracking-tight">
                    <AnimatedCounter value={s.value} />
                  </div>
                  <div className="text-xs font-medium tracking-wide text-white/60 uppercase">{s.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <WaveAnimation />
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs font-medium text-zinc-600 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Everything you need to stay connected
            </div>
            <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900">
              A platform that <span className="text-gradient">moves with you</span>
            </h2>
            <p className="mt-3 text-sm sm:text-[15px] leading-relaxed text-zinc-600">
              Search, connect, and collaborate with delightful micro-interactions, fast navigation, and offline-ready PWA support.
            </p>
          </Reveal>

          <Stagger className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <StaggerItem key={f.title}>
                  <TiltCard className="h-full">
                    <Link href={f.href} className="block h-full">
                      <Card className="h-full group relative overflow-hidden rounded-[20px] border-zinc-200 bg-white hover:shadow-lg hover:shadow-zinc-200/50 transition-all duration-300 hover:-translate-y-1">
                        <div className={`h-1 w-full bg-gradient-to-r ${f.color}`} />
                        <CardHeader className="pt-6">
                          <div className={`inline-flex w-fit rounded-xl p-2.5 ${f.accent} ring-1 ring-black/5 group-hover:scale-105 transition-transform`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <CardTitle className="text-[15px] font-semibold tracking-tight mt-3">{f.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <CardDescription className="text-sm leading-relaxed text-zinc-600">{f.description}</CardDescription>
                          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-zinc-900 group-hover:gap-1.5 transition-all">
                            Learn more <ArrowRight className="w-4 h-4" />
                          </span>
                        </CardContent>
                      </Card>
                    </Link>
                  </TiltCard>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-12 lg:py-16 bg-white border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">What our alumni say</h2>
            <p className="mt-2 text-sm text-zinc-600">Real stories from a vibrant, supportive community.</p>
          </Reveal>

          <div className="mt-8">
            <HorizontalScroll>
              {testimonials.map((t, idx) => (
                <Card key={idx} className="min-w-[320px] max-w-[360px] rounded-2xl border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-zinc-700">“{t.content}”</p>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="grid place-items-center w-9 h-9 rounded-full bg-zinc-900 text-white text-sm font-semibold">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-zinc-900 leading-none">{t.name}</div>
                        <div className="text-xs text-zinc-600">{t.role} • {t.year}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </HorizontalScroll>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-zinc-950" />
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-blue-600/20 to-teal-500/20" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:28px_28px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 text-center">
          <Reveal>
            <Globe className="w-8 h-8 text-white/70 mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">Ready to get started?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-[15px] leading-relaxed text-white/70">
              Join our thriving community and start building meaningful connections today. Your next opportunity is one connection away.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" asChild className="rounded-full bg-white text-zinc-900 hover:bg-zinc-100 px-8 h-11">
                <Link href="/auth/register" className="flex items-center gap-2">
                  Create your profile <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white hover:text-zinc-900 px-8 h-11">
                <Link href="/alumni">Explore network</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between text-xs text-zinc-500">
          <span>© {new Date().getFullYear()} DEV DREAMERS. All rights reserved.</span>
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 bg-zinc-50">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> All systems operational
          </span>
        </div>
      </footer>
    </div>
  );
}
