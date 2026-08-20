"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { Plus, Search, Filter, Users, Sparkles, GraduationCap, Briefcase } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Reveal, Stagger } from "@/components/motion";

interface AlumniUser {
  id: string;
  name: string;
  email: string;
  graduationYear?: number;
  department?: string;
  currentJobTitle?: string;
  currentCompany?: string;
  createdAt: string;
}

export default function AlumniPage() {
  const { isAuthenticated } = useAuth();
  const [alumni, setAlumni] = useState<AlumniUser[]>([]);
  const [filteredAlumni, setFilteredAlumni] = useState<AlumniUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [focused, setFocused] = useState(false);

  useEffect(() => { fetchAlumni(); }, []);
  useEffect(() => { filterAlumni(); }, [alumni, searchTerm, departmentFilter, yearFilter]);

  const fetchAlumni = async () => {
    try {
      const res = await fetch("/api/alumni");
      if (res.ok) {
        const data = await res.json();
        let arr: AlumniUser[] = [];
        if (Array.isArray(data)) arr = data;
        else if (data && Array.isArray((data as any).alumni)) arr = (data as any).alumni;
        setAlumni(arr);
      } else setAlumni([]);
    } catch { setAlumni([]); } finally { setIsLoading(false); }
  };

  const filterAlumni = () => {
    if (!Array.isArray(alumni)) { setFilteredAlumni([]); return; }
    let f = [...alumni];
    if (searchTerm) f = f.filter(u => `${u.name} ${u.email} ${u.currentJobTitle} ${u.currentCompany}`.toLowerCase().includes(searchTerm.toLowerCase()));
    if (departmentFilter !== "all") f = f.filter(u => u.department === departmentFilter);
    if (yearFilter !== "all") f = f.filter(u => u.graduationYear === parseInt(yearFilter));
    setFilteredAlumni(f);
  };

  const safeAlumni = Array.isArray(alumni) ? alumni : [];
  const uniqueDepartments = [...new Set(safeAlumni.map(u => u.department).filter(Boolean))] as string[];
  const uniqueYears = [...new Set(safeAlumni.map(u => u.graduationYear).filter(Boolean))].sort((a,b) => (b as number) - (a as number)) as number[];

  return (
    <div className="min-h-screen bg-[#FCFCF9]">
      {/* Header — mosaic / aurora */}
      <section className="relative overflow-hidden border-b bg-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-violet-200/40 blur-3xl" />
          <div className="absolute -top-16 right-0 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Reveal>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-zinc-900 text-white text-xs font-medium px-3 py-1">
                  <Users className="w-3.5 h-3.5" /> Alumni Directory
                  <span className="w-1 h-1 rounded-full bg-white/60" />
                  <span className="text-white/80">{alumni.length} members</span>
                </span>
                <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 flex items-center gap-3">
                  Find your people
                  <Sparkles className="w-6 h-6 text-violet-500 hidden sm:block" />
                </h1>
                <p className="mt-2 text-sm text-zinc-600 max-w-xl">Search by name, role, company or filter by department and class year. Cards animate in a staggered mosaic.</p>
              </div>
              <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="flex gap-2">
                {isAuthenticated ? (
                  <Button asChild className="rounded-full bg-zinc-900 hover:bg-zinc-800 gap-2">
                    <Link href="/alumni/create"><Plus size={16} /> Add profile</Link>
                  </Button>
                ) : (
                  <Button asChild className="rounded-full gap-2">
                    <Link href="/auth/register"><Plus size={16} /> Join network</Link>
                  </Button>
                )}
                <Button variant="outline" asChild className="rounded-full"><Link href="/events/create">Create event</Link></Button>
              </motion.div>
            </div>
          </Reveal>

          {/* Search — morph on focus */}
          <motion.div layout className="mt-6">
            <LayoutGroup>
              <motion.div
                animate={{ scale: focused ? 1.01 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`flex flex-col lg:flex-row gap-3 rounded-2xl border bg-white p-3 shadow-sm transition-shadow ${focused ? "shadow-md border-zinc-200" : "border-zinc-200"}`}
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <Input
                    placeholder="Search by name, email, job, company..."
                    value={searchTerm}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-10 rounded-xl border-zinc-200 focus-visible:ring-2 focus-visible:ring-violet-500"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="w-[180px] rounded-xl"><GraduationCap className="w-4 h-4 mr-1 text-zinc-500" /><SelectValue placeholder="Department" /></SelectTrigger>
                    <SelectContent><SelectItem value="all">All departments</SelectItem>{uniqueDepartments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="w-[140px] rounded-xl"><SelectValue placeholder="Year" /></SelectTrigger>
                    <SelectContent><SelectItem value="all">All years</SelectItem>{uniqueYears.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
                  </Select>
                  <Button variant="ghost" onClick={() => { setSearchTerm(""); setDepartmentFilter("all"); setYearFilter("all"); }} className="rounded-xl gap-1.5"><Filter size={16} /> Clear</Button>
                </div>
              </motion.div>
            </LayoutGroup>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <AnimatePresence>
                {searchTerm && <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-full bg-violet-50 text-violet-700 px-2.5 py-1 border border-violet-200">“{searchTerm}”</motion.span>}
                {departmentFilter !== "all" && <motion.span layout className="rounded-full bg-blue-50 text-blue-700 px-2.5 py-1 border">{departmentFilter}</motion.span>}
                {yearFilter !== "all" && <motion.span layout className="rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-1 border">Class of {yearFilter}</motion.span>}
              </AnimatePresence>
              <span className="text-zinc-500 ml-1">Showing {filteredAlumni.length} of {alumni.length}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <Skeleton className="h-44 w-full rounded-2xl" />
              </motion.div>
            ))}
          </Stagger>
        ) : filteredAlumni.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredAlumni.map((user, idx) => (
                <motion.div
                  key={user.id}
                  layout
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, delay: idx * 0.02 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="rounded-2xl border bg-white p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 grid place-items-center text-white font-semibold">{user.name.charAt(0)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-zinc-900 truncate">{user.name}</div>
                        <div className="text-xs text-zinc-500 truncate">{user.email}</div>
                      </div>
                      <span className="text-[11px] font-medium rounded-full bg-zinc-900 text-white px-2 py-1">{user.graduationYear || "—"}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
                      {user.department && <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 text-violet-700 px-2 py-1 border"><GraduationCap className="w-3 h-3" />{user.department}</span>}
                      {user.currentJobTitle && <span className="inline-flex items-center gap-1 rounded-full bg-zinc-50 px-2 py-1 border"><Briefcase className="w-3 h-3" />{user.currentJobTitle}{user.currentCompany ? ` @ ${user.currentCompany}` : ""}</span>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 grid place-items-center mx-auto mb-3"><Users className="w-6 h-6 text-zinc-500" /></div>
            <p className="font-medium">No alumni found</p><p className="text-sm text-zinc-500">Try different keywords or clear filters.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
