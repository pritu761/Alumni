"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import RouteGuard from "@/components/RouteGuard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Calendar, Briefcase, MessageSquare, Star, Award, TrendingUp, Clock, UserPlus, Sparkles } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { publicFetcher } from "@/lib/fetcher";
import { Reveal, Stagger, StaggerItem, AnimatedCounter } from "@/components/motion";

export default function StudentsDashboard() {
  const { user } = useAuth();
  const { data: events } = useSWR('/api/events', publicFetcher);
  const { data: mentorship } = useSWR('/api/mentorship', publicFetcher);
  const { data: alumni } = useSWR('/api/alumni', publicFetcher);

  const stats = [
    { title: "Mentorship Requests", value: `${mentorship?.filter((m: any) => m.menteeId === user?.id).length || 0}`, icon: MessageSquare, color: "from-blue-500 to-cyan-500", bg: "bg-blue-50 text-blue-600" },
    { title: "Events Registered", value: `${events?.filter((e: any) => e.rsvps?.some((r: any) => r.userId === user?.id)).length || 0}`, icon: Calendar, color: "from-emerald-500 to-teal-500", bg: "bg-emerald-50 text-emerald-600" },
    { title: "Alumni Connections", value: `${alumni?.alumni?.length || alumni?.length || 0}`, icon: Users, color: "from-violet-500 to-fuchsia-500", bg: "bg-violet-50 text-violet-600" },
    { title: "Career Resources", value: "25", icon: Briefcase, color: "from-orange-500 to-pink-500", bg: "bg-orange-50 text-orange-600" },
  ];

  const actions = [
    { title: "Request Mentorship", desc: "Connect with experienced alumni", icon: UserPlus, href: "/mentorship", color: "from-blue-500 to-cyan-500" },
    { title: "Browse Jobs", desc: "Explore opportunities", icon: Briefcase, href: "/jobs", color: "from-emerald-500 to-teal-500" },
    { title: "Join Events", desc: "Networking & workshops", icon: Calendar, href: "/events", color: "from-violet-500 to-fuchsia-500" },
    { title: "Alumni Directory", desc: "Find graduates in your field", icon: Users, href: "/alumni", color: "from-orange-500 to-red-500" },
  ];

  return (
    <RouteGuard requireAuth={true}>
      <div className="min-h-screen bg-[#FCFCF9]">
        <section className="relative overflow-hidden border-b bg-white">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50/50 to-transparent" />
          <motion.div animate={{ y: [-6, 6, -6] }} transition={{ duration: 7, repeat: Infinity }} className="absolute right-10 top-6 h-24 w-24 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 opacity-10 blur-xl" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Reveal>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-blue-600 text-white px-3 py-1 text-xs font-medium"><BookOpen className="w-3.5 h-3.5" /> Student dashboard</span>
                  <h1 className="mt-3 text-3xl font-semibold tracking-tight">Hey, {user?.name?.split(' ')[0]} <span className="inline-block motion-safe:animate-[float_3s_ease-in-out_infinite]">👋</span></h1>
                  <p className="text-sm text-zinc-600">Your growth dashboard — bars rise on scroll, cards lift on hover.</p>
                </div>
                <div className="flex gap-2">
                  <Button asChild className="rounded-full"><Link href="/mentorship/request">Find mentor</Link></Button>
                  <Button variant="outline" asChild className="rounded-full"><Link href="/events">Events</Link></Button>
                </div>
              </div>
            </Reveal>

            <Stagger className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map(s => {
                const Icon = s.icon;
                return (
                  <StaggerItem key={s.title}>
                    <Card className="rounded-2xl hover:shadow-md transition-shadow overflow-hidden">
                      <div className={`h-1 bg-gradient-to-r ${s.color}`} />
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-xs font-medium tracking-wide uppercase text-zinc-500">{s.title}</div>
                            <div className="mt-1 text-2xl font-semibold"><AnimatedCounter value={s.value} /></div>
                          </div>
                          <span className={`grid place-items-center w-10 h-10 rounded-xl ${s.bg}`}><Icon className="w-5 h-5" /></span>
                        </div>
                        <div className="mt-3 h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                          <motion.div initial={{ width: 0 }} whileInView={{ width: `${30 + Math.random()*60}%` }} viewport={{ once: true }} transition={{ duration: 1 }} className={`h-full bg-gradient-to-r ${s.color}`} />
                        </div>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-2xl">
              <CardHeader><CardTitle className="flex items-center gap-2"><Star className="w-4 h-4 text-amber-500" /> Quick actions</CardTitle><CardDescription>Jump in — cards tilt in 3D</CardDescription></CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-3">
                  {actions.map((a,i) => {
                    const Icon = a.icon;
                    return (
                      <motion.div key={a.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.05 }} whileHover={{ y: -2 }} className="rounded-2xl border bg-white p-4 hover:shadow-sm transition-shadow">
                        <Link href={a.href} className="flex gap-3">
                          <span className={`grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br ${a.color} text-white shrink-0`}><Icon className="w-5 h-5" /></span>
                          <div><div className="font-medium text-sm">{a.title}</div><div className="text-xs text-zinc-500">{a.desc}</div></div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-600" /> Career development</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  { icon: Award, title: "Resume review", desc: "Get reviewed by alumni", color: "bg-blue-50 text-blue-600", cta: "Start" },
                  { icon: BookOpen, title: "Interview prep", desc: "Practice with pros", color: "bg-emerald-50 text-emerald-600", cta: "Learn more" },
                  { icon: Users, title: "Networking events", desc: "Virtual & in-person", color: "bg-violet-50 text-violet-600", cta: "View events" },
                ].map((r,i) => (
                  <motion.div key={r.title} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i*0.06 }} className="flex items-center gap-3 rounded-xl border p-3 hover:bg-zinc-50 transition-colors">
                    <span className={`grid place-items-center w-9 h-9 rounded-xl ${r.color}`}><r.icon className="w-4 h-4" /></span>
                    <div className="flex-1"><div className="font-medium text-sm">{r.title}</div><div className="text-xs text-zinc-500">{r.desc}</div></div>
                    <Button size="sm" className="rounded-full h-8">{r.cta}</Button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-2xl">
              <CardHeader><CardTitle className="flex items-center gap-2 text-sm"><Clock className="w-4 h-4" /> Recent activity</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  { icon: MessageSquare, msg: "Mentor response received", time: "2h ago" },
                  { icon: Calendar, msg: "Tech Career Fair confirmed", time: "1d ago" },
                  { icon: Briefcase, msg: "5 new jobs in your field", time: "2d ago" },
                ].map((a,i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.05 }} className="flex gap-3 rounded-xl bg-zinc-50 p-3">
                    <a.icon className="w-4 h-4 text-zinc-500 mt-0.5" />
                    <div><div className="text-sm font-medium leading-none">{a.msg}</div><div className="text-xs text-zinc-500">{a.time}</div></div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
