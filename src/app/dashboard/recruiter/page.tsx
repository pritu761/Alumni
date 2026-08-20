"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import RouteGuard from "@/components/RouteGuard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Briefcase, TrendingUp, Clock, Plus, FileText, UserCheck } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { authenticatedFetcher } from "@/lib/fetcher";
import { Reveal, Stagger, StaggerItem, AnimatedCounter } from "@/components/motion";

export default function RecruiterDashboard() {
  const { data: jobs } = useSWR('/api/jobs', authenticatedFetcher);

  const stats = [
    { title: "Active posts", value: "3", icon: Briefcase, color: "from-blue-500 to-cyan-500", bg: "bg-blue-50 text-blue-600" },
    { title: "Applications", value: "140", icon: FileText, color: "from-emerald-500 to-teal-500", bg: "bg-emerald-50 text-emerald-600" },
    { title: "Talent pool", value: "642", icon: Users, color: "from-violet-500 to-fuchsia-500", bg: "bg-violet-50 text-violet-600" },
    { title: "Hires", value: "12", icon: UserCheck, color: "from-orange-500 to-pink-500", bg: "bg-orange-50 text-orange-600" },
  ];

  const pipeline = [
    { stage: "Sourced", count: 142, color: "bg-zinc-200" },
    { stage: "Screened", count: 68, color: "bg-blue-500" },
    { stage: "Interviewed", count: 24, color: "bg-violet-600" },
    { stage: "Offered", count: 8, color: "bg-emerald-600" },
  ];

  return (
    <RouteGuard requireAuth={true}>
      <div className="min-h-screen bg-[#FCFCF9]">
        <section className="relative overflow-hidden border-b bg-white">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-orange-50" />
          <motion.div className="absolute right-0 top-0 h-full w-1/3 opacity-20 hidden lg:block" animate={{ x: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity }}>
            <div className="h-full w-full bg-[repeating-linear-gradient(90deg,#000_0_1px,transparent_1px_20px)] [mask-image:linear-gradient(to_left,black,transparent)]" />
          </motion.div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Reveal>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight">Recruiter pipeline <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">flows</span></h1>
                  <p className="text-sm text-zinc-600">Pipeline bars grow left→right on scroll — distinct from student bars.</p>
                  <div className="mt-3 flex gap-2">
                    {pipeline.map((p,i) => (
                      <motion.div key={p.stage} initial={{ width: 0 }} whileInView={{ width: `${18 + i*18}%` }} viewport={{ once: true }} transition={{ delay: i*0.1, duration: 0.6 }} className={`h-1.5 rounded-full ${p.color}`} style={{ minWidth: 40 }} />
                    ))}
                  </div>
                </div>
                <Button asChild className="rounded-full bg-zinc-900 gap-2"><Link href="/jobs/create"><Plus className="w-4 h-4" /> Post job</Link></Button>
              </div>
            </Reveal>

            <Stagger className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map(s => (
                <StaggerItem key={s.title}>
                  <Card className="rounded-2xl">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div><div className="text-xs uppercase tracking-wide text-zinc-500">{s.title}</div><div className="text-2xl font-semibold mt-1"><AnimatedCounter value={s.value} /></div></div>
                        <span className={`w-10 h-10 rounded-xl grid place-items-center ${s.bg}`}><s.icon className="w-5 h-5" /></span>
                      </div>
                      <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600"><TrendingUp className="w-3 h-3" /> +12% this week</div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-2xl">
              <CardHeader><CardTitle className="text-sm">Pipeline overview</CardTitle><CardDescription>Horizontal flow — each stage slides in</CardDescription></CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {pipeline.map((p,i) => (
                    <motion.div key={p.stage} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.08 }} className="flex-1 rounded-xl border bg-white p-3 text-center">
                      <div className="text-xs text-zinc-500">{p.stage}</div>
                      <div className="text-xl font-semibold"><AnimatedCounter value={`${p.count}`} /></div>
                      <div className={`mx-auto mt-1 h-1 w-full rounded-full ${p.color} opacity-60`} />
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" className="rounded-full" asChild><Link href="/jobs/create">Post job</Link></Button>
                  <Button size="sm" variant="outline" className="rounded-full" asChild><Link href="/alumni">Browse talent</Link></Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader><CardTitle className="text-sm">Recent posts</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  { title: "Senior Software Engineer", meta: "TechCorp • SF", apps: 45, status: "active" },
                  { title: "Product Manager", meta: "InnovateCo • NY", apps: 28, status: "active" },
                ].map((j,i) => (
                  <motion.div key={j.title} initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i*0.05 }} className="flex items-center justify-between rounded-xl border p-3 hover:bg-zinc-50">
                    <div><div className="font-medium text-sm">{j.title}</div><div className="text-xs text-zinc-500">{j.meta} • {j.apps} apps</div></div>
                    <Badge className="rounded-full capitalize">{j.status}</Badge>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-2xl">
              <CardHeader><CardTitle className="flex items-center gap-2 text-sm"><Clock className="w-4 h-4" /> Recent activity</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {["15 new applications", "Job post approved", "John accepted offer"].map((m,i)=>(
                  <motion.div key={m} initial={{ opacity: 0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} transition={{ delay:i*0.05 }} className="rounded-xl bg-zinc-50 p-3 text-sm">{m}</motion.div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
