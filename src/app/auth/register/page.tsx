"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { Sparkles, Check, GraduationCap } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "", graduationYear: "", department: "", currentJobTitle: "", currentCompany: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  useEffect(()=>{ if(isAuthenticated) router.push("/"); },[isAuthenticated, router]);

  const handleChange = (name: string, value: string) => setFormData(p=>({...p,[name]:value}));
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(formData.password!==formData.confirmPassword){ toast.error("Passwords don’t match"); return; }
    if(formData.password.length<8){ toast.error("Password must be 8+ characters"); return; }
    setIsLoading(true);
    try{
      const r = await fetch("/api/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:formData.name,email:formData.email,password:formData.password,graduationYear:formData.graduationYear?parseInt(formData.graduationYear):undefined,department:formData.department||undefined,currentJobTitle:formData.currentJobTitle||undefined,currentCompany:formData.currentCompany||undefined})});
      const d=await r.json();
      if(r.ok){ toast.success("Account created! Please sign in."); router.push("/auth/login"); } else toast.error(d.error||"Failed");
    } catch{ toast.error("Something went wrong"); } finally{ setIsLoading(false); }
  };

  const canNext = formData.name && formData.email && formData.password && formData.confirmPassword;

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-zinc-950 text-white p-8">
        <div className="absolute inset-0">
          <motion.div animate={{ y:[0,12,0] }} transition={{ duration:7, repeat:Infinity }} className="absolute -top-10 right-10 h-72 w-72 rounded-full bg-emerald-600/30 blur-3xl" />
          <motion.div animate={{ y:[12,0,12] }} transition={{ duration:8, repeat:Infinity }} className="absolute bottom-10 -left-10 h-80 w-80 rounded-full bg-blue-600/25 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>
        <div className="relative">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs"><Sparkles className="w-3 h-3" /> Join the network</Link>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight">Create your <span className="bg-gradient-to-r from-emerald-300 to-blue-300 bg-clip-text text-transparent">alumni profile</span></h1>
          <p className="mt-2 text-sm text-white/70">A two-step form — fields stagger in, progress morphs.</p>
          <div className="mt-6 flex gap-2">
            {[1,2].map(i => <div key={i} className={`h-1.5 w-12 rounded-full transition-colors ${step>=i?"bg-white":"bg-white/20"}`} />)}
          </div>
        </div>
        <div className="relative text-xs text-white/60 flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Trusted by 5,000+ alumni</div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-8 bg-[#FCFCF9]">
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} className="w-full max-w-lg">
          <Card className="rounded-[20px] shadow-sm">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl tracking-tight">{step===1?"Your account":"Tell us more"}</CardTitle>
              <CardDescription>{step===1?"Step 1 of 2 — essentials":"Step 2 of 2 — optional, helps you get discovered"}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence mode="wait">
                  {step===1 ? (
                    <motion.div key="s1" initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-12 }} className="space-y-4">
                      {[
                        { id:"name", label:"Full name", ph:"Ada Lovelace", type:"text" },
                        { id:"email", label:"Email", ph:"ada@university.edu", type:"email" },
                        { id:"password", label:"Password", ph:"Minimum 8 characters", type:"password" },
                        { id:"confirmPassword", label:"Confirm password", ph:"Repeat password", type:"password" },
                      ].map((f,i) => (
                        <motion.div key={f.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.04 }}>
                          <Label htmlFor={f.id}>{f.label}</Label>
                          <Input id={f.id} type={f.type} placeholder={f.ph} value={(formData as any)[f.id]} onChange={e=>handleChange(f.id,e.target.value)} required className="mt-1 h-11 rounded-xl" />
                        </motion.div>
                      ))}
                      <Button type="button" onClick={()=> canNext ? setStep(2) : toast.error("Fill all required fields")} className="w-full h-11 rounded-xl bg-zinc-900 hover:bg-zinc-800">Continue →</Button>
                    </motion.div>
                  ) : (
                    <motion.div key="s2" initial={{ opacity:0, x:12 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:12 }} className="space-y-4">
                      {[
                        { id:"graduationYear", label:"Graduation year", ph:"2020", type:"number" },
                        { id:"currentJobTitle", label:"Current job title", ph:"Product Designer", type:"text" },
                        { id:"currentCompany", label:"Current company", ph:"Figma", type:"text" },
                      ].map((f,i) => (
                        <motion.div key={f.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.05 }}>
                          <Label htmlFor={f.id}>{f.label} <span className="text-zinc-400 font-normal">(optional)</span></Label>
                          <Input id={f.id} type={f.type} placeholder={f.ph} value={(formData as any)[f.id]} onChange={e=>handleChange(f.id,e.target.value)} className="mt-1 h-11 rounded-xl" />
                        </motion.div>
                      ))}
                      <div className="space-y-2">
                        <Label>Department</Label>
                        <Select onValueChange={v=>handleChange("department",v)}><SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select department" /></SelectTrigger><SelectContent><SelectItem value="Computer Science">Computer Science</SelectItem><SelectItem value="Information Technology">Information Technology</SelectItem><SelectItem value="Electronics">Electronics</SelectItem><SelectItem value="Mechanical">Mechanical</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select>
                      </div>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={()=>setStep(1)} className="flex-1 h-11 rounded-xl">Back</Button>
                        <Button type="submit" disabled={isLoading} className="flex-1 h-11 rounded-xl bg-zinc-900 hover:bg-zinc-800 gap-2">{isLoading ? "Creating…" : <><Check className="w-4 h-4" /> Create account</>}</Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
              <div className="mt-4 text-center text-sm text-zinc-600">Already have an account? <Link href="/auth/login" className="font-medium text-zinc-900 hover:underline">Sign in</Link></div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
