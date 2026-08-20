"use client";

import { motion } from "framer-motion";
import MentorshipList from "@/components/MentorshipList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, BookOpen, MessageCircle, Users, Sparkles, ArrowRight } from "lucide-react";

export default function MentorshipPage() {
  return (
    <div className="min-h-screen bg-[#FCFCF9]">
      <section className="relative overflow-hidden border-b bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.15),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-600 text-white px-3 py-1 text-xs font-medium"><BookOpen className="w-3.5 h-3.5" /> Mentorship Program</span>
              <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900">Guidance that <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">flows</span></h1>
              <p className="mt-2 text-sm text-zinc-600 max-w-xl">Connect with experienced alumni or share your expertise. Conversations animate as chat bubbles — flip on hover.</p>
              <div className="mt-4 flex gap-2">
                <Button asChild className="rounded-full bg-emerald-600 hover:bg-emerald-700 gap-2"><Link href="/mentorship/request"><Plus size={16} /> Find mentor</Link></Button>
                <Button variant="outline" asChild className="rounded-full"><Link href="/alumni">Browse mentors</Link></Button>
              </div>
              <div className="mt-4 flex gap-2 text-xs">
                <span className="inline-flex items-center gap-1 rounded-full border bg-white px-2.5 py-1"><Users className="w-3 h-3" /> 800+ connections</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border px-2.5 py-1"><Sparkles className="w-3 h-3" /> Verified mentors</span>
              </div>
            </motion.div>

            {/* conversational preview — distinct animation */}
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6 }} className="relative">
              <div className="rounded-[24px] border bg-white p-5 shadow-sm">
                <div className="space-y-3">
                  {[
                    { from: "mentor", text: "Happy to help with your transition to PM!", delay: 0.3 },
                    { from: "mentee", text: "Thanks! I’d love advice on storytelling for interviews.", delay: 0.5 },
                    { from: "mentor", text: "Let’s do a mock interview next week →", delay: 0.7 },
                  ].map((m, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: m.delay, type: "spring" }} className={`flex ${m.from === "mentor" ? "justify-start" : "justify-end"}`}>
                      <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${m.from === "mentor" ? "bg-zinc-50 border" : "bg-emerald-600 text-white"}`}>{m.text}</div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500"><MessageCircle className="w-4 h-4" /> Flip cards below on hover to see details</div>
              </div>
              <motion.div animate={{ y: [-4, 4, -4] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-3 -right-3 w-8 h-8 rounded-xl bg-emerald-600 text-white grid place-items-center shadow-lg"><BookOpen className="w-4 h-4" /></motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-zinc-900 flex items-center gap-2"><MessageCircle className="w-4 h-4 text-emerald-600" /> Active requests <ArrowRight className="w-4 h-4 text-zinc-400" /></h2>
          <span className="text-xs text-zinc-500">Hover cards to flip</span>
        </motion.div>
        <div className="rounded-2xl border bg-white p-4 sm:p-6 shadow-sm [perspective:1000px]">
          <MentorshipList />
        </div>
      </div>
    </div>
  );
}
