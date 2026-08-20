"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import RouteGuard from "@/components/RouteGuard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, MessageSquare, Building2, MapPin, Trophy, TrendingUp, Clock, Edit3, Settings, Heart, Star } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { publicFetcher, authenticatedFetcher } from "@/lib/fetcher";
import { Reveal, Stagger, StaggerItem, AnimatedCounter } from "@/components/motion";

export default function AlumniDashboard() {
  const { user } = useAuth();
  const { data: events } = useSWR('/api/events', publicFetcher);
  const { data: mentorship } = useSWR('/api/mentorship', authenticatedFetcher);
  const { data: donations } = useSWR('/api/donations', authenticatedFetcher);

  const stats = [
    { title: "Profile views", value: "0", icon: Users, color: "from-blue-500 to-cyan-500", bg: "bg-blue-50 text-blue-600" },
    { title: "Events attended", value: `${events?.filter((e:any)=>e.rsvps?.some((r:any)=>r.userId===user?.id && r.status==='CONFIRMED')).length || 0}`, icon: Calendar, color: "from-emerald-500 to-teal-500", bg: "bg-emerald-50 text-emerald-600" },
    { title: "Mentorship provided", value: `${mentorship?.filter((m:any)=>m.mentorId===user?.id).length || 0}`, icon: MessageSquare, color: "from-violet-500 to-fuchsia-500", bg: "bg-violet-50 text-violet-600" },
    { title: "Donated", value: `$${donations?.reduce((s:number,d:any)=>s+d.amount,0) || 0}`, icon: Heart, color: "from-pink-500 to-orange-500", bg: "bg-pink-50 text-pink-600" },
  ];

  return (
    <RouteGuard requireAuth={true}>
      <div className="min-h-screen bg-[#FCFCF9]">
        <section className="relative overflow-hidden border-b bg-white">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-blue-50" />
          {/* network nodes */}
          <div className="pointer-events-none absolute inset-0">
            <svg className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 800 200">
              <g fill="none" stroke="currentColor" className="text-zinc-900">
                <circle cx="120" cy="80" r="3" /><circle cx="260" cy="40" r="3" /><circle cx="420" cy="90" r="3" /><circle cx="580" cy="50" r="3" /><circle cx="700" cy="100" r="3" />
                <path d="M120 80 L260 40 L420 90 L580 50 L700 100" strokeWidth="1.2" strokeDasharray="4 6" />
              </g>
            </svg>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Reveal>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight">Welcome back, {user?.name?.split(' ')[0]} <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">🎓</span></h1>
                  <p className="text-sm text-zinc-600 flex flex-wrap items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 rounded-full border bg-white px-2 py-1"><Building2 className="w-3 h-3" />{user?.currentJobTitle || "Alumni"} {user?.currentCompany ? `at ${user.currentCompany}` : ""}</span>
                    {user?.graduationYear && <span className="inline-flex items-center gap-1 rounded-full bg-zinc-900 text-white px-2 py-1 text-xs">Class of {user.graduationYear}</span>}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild className="rounded-full"><Link href="/alumni/create"><Edit3 className="w-4 h-4 mr-1" /> Edit profile</Link></Button>
                  <Button variant="ghost" size="sm" className="rounded-full"><Settings className="w-4 h-4 mr-1" /> Settings</Button>
                </div>
              </div>
            </Reveal>

            <Stagger className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map(s => {
                const Icon = s.icon;
                return (
                  <StaggerItem key={s.title}>
                    <Card className="rounded-2xl hover:shadow-sm transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-xs uppercase tracking-wide text-zinc-500 font-medium">{s.title}</div>
                            <div className="text-2xl font-semibold mt-1"><AnimatedCounter value={s.value} /></div>
                            <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600"><TrendingUp className="w-3 h-3" /> trending</div>
                          </div>
                          <span className={`grid place-items-center w-10 h-10 rounded-xl ${s.bg}`}><Icon className="w-5 h-5" /></span>
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
              <CardHeader><CardTitle className="flex items-center gap-2"><Star className="w-4 h-4 text-amber-500" /> Quick actions</CardTitle><CardDescription>Network pulsates gently</CardDescription></CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-3">
                {[
                  { title: "Update profile", desc: "Keep info current", icon: Edit3, href: "/alumni/create", color: "from-blue-500 to-cyan-500" },
                  { title: "Join events", desc: "Reunions & networking", icon: Calendar, href: "/events", color: "from-emerald-500 to-teal-500" },
                  { title: "Donate", desc: "Support alma mater", icon: Heart, href: "/donations", color: "from-pink-500 to-orange-500" },
                  { title: "Become mentor", desc: "Guide students", icon: MessageSquare, href: "/mentorship", color: "from-violet-500 to-fuchsia-500" },
                ].map((a,i) => (
                  <motion.div key={a.title} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.05 }} whileHover={{ scale: 1.01 }} className="rounded-2xl border p-4 hover:shadow-sm transition-shadow">
                    <Link href={a.href} className="flex gap-3">
                      <span className={`w-9 h-9 rounded-xl bg-gradient-to-br ${a.color} grid place-items-center text-white shrink-0`}><a.icon className="w-4 h-4" /></span>
                      <div><div className="font-medium text-sm">{a.title}</div><div className="text-xs text-zinc-500">{a.desc}</div></div>
                    </Link>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="w-4 h-4 text-amber-600" /> Your impact</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  { title: "Mentorship", sub: "Mentoring 3 students", color: "border-blue-500 bg-blue-50", icon: MessageSquare },
                  { title: "Events", sub: "8 events this year", color: "border-emerald-500 bg-emerald-50", icon: Calendar },
                  { title: "Giving", sub: "$500 donated", color: "border-pink-500 bg-pink-50", icon: Heart },
                ].map((r,i) => (
                  <motion.div key={r.title} initial={{ opacity: 0, x: -6 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i*0.06 }} className={`flex items-center gap-3 rounded-xl border-l-4 p-3 ${r.color}`}>
                    <r.icon className="w-5 h-5" />
                    <div className="flex-1"><div className="font-medium text-sm">{r.title}</div><div className="text-xs text-zinc-600">{r.sub}</div></div>
                    <Badge variant="secondary" className="rounded-full">Active</Badge>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-2xl">
              <CardHeader><CardTitle className="flex items-center gap-2 text-sm"><Clock className="w-4 h-4" /> Recent activity</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {[
                  { icon: MessageSquare, msg: "Mentorship request from Sarah", time: "3h ago" },
                  { icon: Calendar, msg: "Registered for Gala 2024", time: "1d ago" },
                  { icon: Heart, msg: "$100 donation processed", time: "2d ago" },
                ].map((a,i)=>(
                  <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i*0.05 }} className="flex gap-3 rounded-xl bg-zinc-50 p-3">
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
