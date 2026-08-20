"use client";

import { motion } from "framer-motion";
import DonationsList from "@/components/DonationsList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, DollarSign, Heart, Sparkles, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Reveal, Stagger, StaggerItem, AnimatedCounter } from "@/components/motion";

export default function DonationsPage() {
  const causes = [
    { title: "Scholarship Fund", description: "Support deserving students", raised: 45000, goal: 100000, color: "from-violet-600 to-blue-600" },
    { title: "Infrastructure Development", description: "Improve campus facilities", raised: 75000, goal: 150000, color: "from-emerald-600 to-teal-600" },
    { title: "Research Programs", description: "Fund cutting-edge research", raised: 30000, goal: 80000, color: "from-orange-500 to-pink-600" },
  ];

  return (
    <div className="min-h-screen bg-[#FCFCF9]">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-zinc-950" />
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/25 via-transparent to-emerald-600/20" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:28px_28px]" />
        {/* confetti dots */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => {
            const x = `${(i * 13) % 100}%`;
            const duration = 8 + (i % 5);
            return (
              <motion.div
                key={i}
                initial={{ y: -20, x, opacity: 0 }}
                animate={{ y: "120%", opacity: [0, 1, 0] }}
                transition={{ duration, repeat: Infinity, delay: i * 0.6, ease: "linear" }}
                className="absolute w-1.5 h-1.5 rounded-full bg-white/40"
              />
            );
          })}
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 text-white px-3 py-1 text-xs backdrop-blur"><Heart className="w-3.5 h-3.5 text-pink-300" /> Give back <Sparkles className="w-3 h-3 text-yellow-300" /></span>
            <h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight text-white">Every gift <span className="bg-gradient-to-r from-violet-300 to-blue-300 bg-clip-text text-transparent">ripples</span></h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-white/70">Progress rings fill, counters tick, and confetti celebrates each milestone.</p>
            <div className="mt-6 flex justify-center gap-2">
              <Button asChild size="lg" className="rounded-full bg-white text-zinc-900 hover:bg-zinc-100 gap-2"><Link href="/donations/donate"><DollarSign className="w-4 h-4" /> Donate now</Link></Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white hover:text-zinc-900"><Link href="/donations/create"><Plus className="w-4 h-4 mr-1" /> Start campaign</Link></Button>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Reveal className="text-center mb-6">
          <h2 className="text-2xl font-semibold tracking-tight">Current campaigns</h2>
          <p className="text-sm text-zinc-600">Rings animate on scroll — hover to see confetti.</p>
        </Reveal>

        <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {causes.map((c) => {
            const pct = Math.round((c.raised / c.goal)*100);
            const circ = 2 * Math.PI * 54;
            const offset = circ - (pct/100)*circ;
            return (
              <StaggerItem key={c.title}>
                <Card className="rounded-[20px] overflow-hidden hover:shadow-lg transition-shadow group">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base"><Heart className="w-5 h-5 text-pink-600" />{c.title}</CardTitle>
                    <CardDescription className="text-sm">{c.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6">
                      <div className="relative w-28 h-28 shrink-0">
                        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
                          <circle cx="60" cy="60" r="54" stroke="#e5e7eb" strokeWidth="10" fill="none" />
                          <motion.circle initial={{ strokeDashoffset: circ }} whileInView={{ strokeDashoffset: offset }} viewport={{ once: true }} transition={{ duration: 1.2, ease: "easeOut" }} cx="60" cy="60" r="54" stroke="url(#grad)" strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={circ} />
                          <defs><linearGradient id="grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#7c3aed" /><stop offset="100%" stopColor="#2563eb" /></linearGradient></defs>
                        </svg>
                        <div className="absolute inset-0 grid place-items-center">
                          <div className="text-center"><div className="text-xl font-semibold">{pct}%</div><div className="text-[10px] tracking-wide uppercase text-zinc-500">of goal</div></div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm"><span className="text-zinc-600">Raised</span><span className="font-semibold">${c.raised.toLocaleString()}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-zinc-600">Goal</span><span className="font-semibold">${c.goal.toLocaleString()}</span></div>
                        <div className="mt-2 h-2 rounded-full bg-zinc-100 overflow-hidden">
                          <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 1 }} className={`h-full bg-gradient-to-r ${c.color}`} />
                        </div>
                        <div className="mt-1 text-xs text-zinc-500 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> <AnimatedCounter value={`${pct}%`} /> funded</div>
                      </div>
                    </div>
                    <Button asChild className="w-full mt-4 rounded-full"><Link href={`/donations/donate?cause=${encodeURIComponent(c.title)}`}>Donate now</Link></Button>
                  </CardContent>
                </Card>
              </StaggerItem>
            );
          })}
        </Stagger>

        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-10 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 p-6 text-white flex flex-wrap items-center justify-between gap-4">
          <div><div className="font-semibold">Quick donate</div><div className="text-sm text-white/80">Pick an amount — buttons pop with spring.</div></div>
          <div className="flex flex-wrap gap-2">
            {[25,50,100,250,500].map((a,i) => (
              <motion.div key={a} initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: i*0.05, type: "spring" }}>
                <Button asChild variant="secondary" size="sm" className="rounded-full bg-white text-zinc-900 hover:bg-zinc-100"><Link href={`/donations/donate?amount=${a}`}>${a}</Link></Button>
              </motion.div>
            ))}
            <Button asChild variant="outline" size="sm" className="rounded-full border-white text-white hover:bg-white hover:text-zinc-900"><Link href="/donations/donate">Custom</Link></Button>
          </div>
        </motion.div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight mb-4">Recent donations</h2>
          <div className="rounded-2xl border bg-white p-4 sm:p-6 shadow-sm">
            <DonationsList />
          </div>
        </div>
      </div>
    </div>
  );
}
