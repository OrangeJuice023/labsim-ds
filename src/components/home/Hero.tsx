"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FlaskConical } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";

const stats = [
  { value: "9", label: "End-to-End ML Projects" },
  { value: "5", label: "Synthetic Client Profiles" },
  { value: "5", label: "Table Relational Schema" },
  { value: "0", label: "Real Patient Records" },
];

export function Hero() {
  return (
    <section className="relative bg-[#0F172A] overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "40px 40px" }}
      />
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#D97706]" />
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.07]"
        style={{ background: "radial-gradient(circle, #14B8A6, transparent 70%)" }}
      />

      <div className="relative max-w-[1200px] mx-auto px-[32px] md:px-[48px] lg:px-[64px] pt-[112px] pb-[128px]">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-[760px]">

          <motion.div variants={fadeUp} className="mb-7">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.12em] text-[#94A3B8] uppercase">
              <FlaskConical size={13} className="text-[#D97706]" />
              Synthetic Healthcare Data Science
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-[2.75rem] md:text-[3.5rem] lg:text-[4rem] font-extrabold text-white leading-[1.05] tracking-[-0.02em] mb-7"
          >
            Real-world healthcare ML, on data{" "}
            <span className="text-[#14B8A6]">engineered to behave like production.</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-[1.125rem] text-[#94A3B8] leading-[1.7] max-w-[560px] mb-10">
            Nine end-to-end analytics and machine learning projects built on a
            fully synthetic dataset — modeled after the operational patterns of
            real diagnostic laboratories, with none of the privacy risk.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-24">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0D9488] text-white font-semibold text-sm hover:bg-[#0F766E] transition-colors duration-200 cursor-pointer"
            >
              View All Projects
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/methodology"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[#334155] text-[#CBD5E1] font-semibold text-sm hover:bg-[#334155]/40 transition-colors duration-200 cursor-pointer"
            >
              How the Data Was Built
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-10 border-t border-[#334155]/60">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-[2rem] font-extrabold text-white font-mono tracking-tight leading-none mb-1.5">
                  {stat.value}
                </p>
                <p className="text-xs text-[#94A3B8] font-medium tracking-wide">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
