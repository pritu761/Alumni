"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import EventList from "@/components/EventList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Calendar, MapPin, Clock, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Reveal } from "@/components/motion";

export default function EventsPage() {
  const { isAuthenticated } = useAuth();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [1, 1, 0.9]);

  return (
    <div ref={ref} className="min-h-screen bg-[#FCFCF9]">
      {/* Timeline header — parallax */}
      <section className="relative overflow-hidden border-b bg-white">
        <motion.div style={{ y, opacity }} className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-100/60 via-transparent to-transparent" />
          <div className="absolute left-1/2 top-8 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-zinc-200 to-transparent hidden md:block" />
          {/* timeline dots */}
          <div className="hidden md:flex justify-between max-w-3xl mx-auto pt-16 px-12">
            {[0,1,2,3].map(i => (
              <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + i*0.1, type: "spring" }} className="w-3 h-3 rounded-full bg-zinc-900 ring-4 ring-white shadow" />
            ))}
          </div>
        </motion.div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Reveal>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs font-medium shadow-sm">
                  <Calendar className="w-3.5 h-3.5 text-violet-600" /> Events & Reunions
                  <span className="rounded-full bg-violet-600 text-white px-1.5 py-0.5 text-[10px]">timeline</span>
                </span>
                <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900">Moments that <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">bring us together</span></h1>
                <p className="mt-2 text-sm text-zinc-600 max-w-xl">From reunions to networking nights — scroll the timeline. Cards slide in alternately for a dynamic feel.</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-500">
                  <span className="inline-flex items-center gap-1 rounded-full bg-zinc-50 border px-2.5 py-1"><MapPin className="w-3 h-3" /> Campus & beyond</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-zinc-50 border px-2.5 py-1"><Clock className="w-3 h-3" /> All year</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200 px-2.5 py-1"><Sparkles className="w-3 h-3" /> New drops weekly</span>
                </div>
              </div>
              {isAuthenticated ? (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <Button asChild className="rounded-full bg-zinc-900 hover:bg-zinc-800 gap-2">
                    <Link href="/events/create"><Plus size={16} /> Create event</Link>
                  </Button>
                </motion.div>
              ) : (
                <Button asChild variant="outline" className="rounded-full"><Link href="/auth/register">Join to create events</Link></Button>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="rounded-2xl border bg-white shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-violet-600 via-blue-600 to-teal-500" />
          <div className="p-4 sm:p-6">
            <EventList />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
