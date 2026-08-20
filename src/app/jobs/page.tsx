"use client";

import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, MapPin, Clock, DollarSign, Users, Building2, Search, Plus, XCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/motion";

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const jobs = [
    { id: 1, title: "Senior Software Engineer", company: "TechCorp Inc", location: "San Francisco, CA", type: "Full-time", salary: "$120k — $160k", description: "Build scalable web apps with a stellar alumni team.", requirements: ["5+ yrs React", "Node.js", "AWS"], posted: "2 days ago", applicants: 45, recruiter: "Sarah Johnson", featured: true },
    { id: 2, title: "Product Manager", company: "InnovateCo", location: "New York, NY", type: "Full-time", salary: "$100k — $140k", description: "Lead product strategy cross-functionally.", requirements: ["3+ yrs PM", "Agile", "Data"], posted: "1 week ago", applicants: 28, recruiter: "Michael Chen" },
    { id: 3, title: "Data Science Intern", company: "DataTech", location: "Boston, MA", type: "Internship", salary: "$25/hr", description: "ML projects for the summer.", requirements: ["Python", "Stats", "Enrolled"], posted: "3 days ago", applicants: 67, recruiter: "Emily Rodriguez" },
    { id: 4, title: "Marketing Coordinator", company: "BrandBuilder", location: "Remote", type: "Full-time", salary: "$50k — $65k", description: "Campaigns & social.", requirements: ["Digital marketing", "Content", "Social"], posted: "5 days ago", applicants: 34, recruiter: "David Park" },
    { id: 5, title: "UX Designer", company: "DesignStudio", location: "Austin, TX", type: "Contract", salary: "$70/hr", description: "Mobile & web UX.", requirements: ["Portfolio", "Figma", "Research"], posted: "1 day ago", applicants: 52, recruiter: "Lisa Wong" },
  ];

  const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];
  const locations = ["San Francisco, CA", "New York, NY", "Boston, MA", "Austin, TX", "Remote"];
  const filtered = jobs.filter(j => {
    const q = searchTerm.toLowerCase();
    const mSearch = !q || `${j.title} ${j.company} ${j.description}`.toLowerCase().includes(q);
    const mLoc = locationFilter === "all" || j.location === locationFilter;
    const mType = typeFilter === "all" || j.type === typeFilter;
    return mSearch && mLoc && mType;
  });

  return (
    <div className="min-h-screen bg-[#FCFCF9]">
      <section className="relative overflow-hidden border-b bg-zinc-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-blue-600/15 to-transparent" />
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="absolute right-0 top-0 h-full w-1/2 hidden lg:block opacity-30">
          <div className="h-full w-full bg-[linear-gradient(110deg,#fff_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:linear-gradient(to_left,black,transparent)]" />
        </motion.div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Reveal>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-3 py-1 text-xs font-medium backdrop-blur"><Briefcase className="w-3.5 h-3.5" /> Job Board <Sparkles className="w-3 h-3 text-yellow-300" /></span>
                <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">Opportunities that <span className="bg-gradient-to-r from-violet-300 to-blue-300 bg-clip-text text-transparent">slide to you</span></h1>
                <p className="mt-2 text-sm text-white/70 max-w-xl">Filter chips morph with <code className="bg-white/10 px-1 rounded">layout</code> animation. Cards enter from the right.</p>
              </div>
              <Button asChild size="lg" className="rounded-full bg-white text-zinc-900 hover:bg-zinc-100 gap-2"><Link href="/jobs/create"><Plus className="w-5 h-5" /> Post a job</Link></Button>
            </div>
          </Reveal>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6 rounded-2xl bg-white/95 backdrop-blur border p-3 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <Input placeholder="Search jobs, companies..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="pl-9 rounded-xl h-10" />
              </div>
              <Select value={locationFilter} onValueChange={setLocationFilter}><SelectTrigger className="rounded-xl"><SelectValue placeholder="Location" /></SelectTrigger><SelectContent>{["all", ...locations].map(l => <SelectItem key={l} value={l}>{l==="all"?"All locations":l}</SelectItem>)}</SelectContent></Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}><SelectTrigger className="rounded-xl"><SelectValue placeholder="Type" /></SelectTrigger><SelectContent>{["all", ...jobTypes].map(t => <SelectItem key={t} value={t}>{t==="all"?"All types":t}</SelectItem>)}</SelectContent></Select>
            </div>
            <LayoutGroup>
              <div className="mt-3 flex flex-wrap gap-2 min-h-[28px]">
                <AnimatePresence>
                  {searchTerm && <motion.span layout initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="inline-flex items-center gap-1 rounded-full bg-zinc-900 text-white px-3 py-1 text-xs">“{searchTerm}” <button onClick={()=>setSearchTerm("")} className="ml-1 rounded-full bg-white/20 p-0.5"><XCircle className="w-3 h-3" /></button></motion.span>}
                  {locationFilter!=="all" && <motion.span layout className="rounded-full bg-blue-50 text-blue-700 border px-3 py-1 text-xs">{locationFilter} <button onClick={()=>setLocationFilter("all")} className="ml-1">×</button></motion.span>}
                  {typeFilter!=="all" && <motion.span layout className="rounded-full bg-violet-50 text-violet-700 border px-3 py-1 text-xs">{typeFilter} <button onClick={()=>setTypeFilter("all")} className="ml-1">×</button></motion.span>}
                </AnimatePresence>
                {(searchTerm || locationFilter!=="all" || typeFilter!=="all") && <button onClick={()=>{setSearchTerm("");setLocationFilter("all");setTypeFilter("all");}} className="text-xs text-zinc-500 hover:text-zinc-900">Clear all</button>}
              </div>
            </LayoutGroup>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4 text-sm text-zinc-600">Showing <span className="font-semibold text-zinc-900">{filtered.length}</span> jobs</div>
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((job, i) => (
              <motion.div key={job.id} layout initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.4, delay: i * 0.04, type: "spring", stiffness: 200, damping: 20 }}>
                <Card className={`rounded-2xl overflow-hidden hover:shadow-md transition-shadow ${job.featured ? "ring-1 ring-violet-200" : ""}`}>
                  {job.featured && <div className="h-1 bg-gradient-to-r from-violet-600 to-blue-600" />}
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold tracking-tight">{job.title}</h3>
                        <div className="mt-1 flex flex-wrap gap-2 text-xs text-zinc-600">
                          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-50 border px-2 py-1"><Building2 className="w-3 h-3" />{job.company}</span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-50 border px-2 py-1"><MapPin className="w-3 h-3" />{job.location}</span>
                          <Badge variant="outline" className="rounded-full text-xs">{job.type}</Badge>
                        </div>
                        <p className="mt-3 text-sm text-zinc-600 line-clamp-2">{job.description}</p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {job.requirements.map(r => <Badge key={r} variant="secondary" className="rounded-full bg-zinc-100 text-xs">{r}</Badge>)}
                        </div>
                      </div>
                      <div className="lg:text-right space-y-3 min-w-[160px]">
                        <div className="text-lg font-semibold text-emerald-600 flex items-center lg:justify-end gap-1"><DollarSign className="w-4 h-4" />{job.salary}</div>
                        <div className="flex gap-2 lg:justify-end"><Button size="sm" className="rounded-full">Apply</Button><Button size="sm" variant="outline" className="rounded-full">Save</Button></div>
                        <div className="text-xs text-zinc-500 flex items-center lg:justify-end gap-3"><span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{job.posted}</span><span className="inline-flex items-center gap-1"><Users className="w-3 h-3" />{job.applicants} applicants</span></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          {filtered.length===0 && <Card className="rounded-2xl p-8 text-center"><Briefcase className="w-8 h-8 mx-auto text-zinc-400 mb-2" /><p className="font-medium">No jobs found</p></Card>}
        </div>
      </div>
    </div>
  );
}
