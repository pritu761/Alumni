"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import { AdvancedSearch } from "@/components/AdvancedSearch";
import { Search, Sparkles } from "lucide-react";

function SearchPageContent() {
  return (
    <div className="min-h-screen bg-[#FCFCF9]">
      <section className="relative overflow-hidden border-b bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 via-violet-50/50 to-blue-50/50" />
        <motion.div animate={{ scale: [1, 1.05, 1], rotate: [0, 1, 0] }} transition={{ duration: 8, repeat: Infinity }} className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet-200/30 blur-2xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-zinc-900 text-white">
              <Search className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">Search <Sparkles className="w-4 h-4 text-violet-600" /></h1>
              <p className="text-sm text-zinc-600">Instant results — the bar expands on focus and filters morph.</p>
            </div>
          </motion.div>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <AdvancedSearch />
        </motion.div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen grid place-items-center"><div className="w-8 h-8 rounded-full border-2 border-zinc-900 border-t-transparent animate-spin" /></div>}>
      <SearchPageContent />
    </Suspense>
  );
}
