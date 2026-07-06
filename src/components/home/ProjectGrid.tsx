"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Database } from "lucide-react";
import { fadeUp, staggerContainer, viewportConfig } from "@/lib/animations";
import { projects } from "@/content/projects";
import type { Difficulty, ProjectStatus } from "@/lib/types";

const difficultyConfig: Record<Difficulty, { color: string; bg: string }> = {
  Beginner: { color: "#16A34A", bg: "#F0FDF4" },
  Intermediate: { color: "#B45309", bg: "#FFFBEB" },
  Advanced: { color: "#BE123C", bg: "#FFF1F2" },
};

const statusConfig: Record<ProjectStatus, { label: string; color: string }> = {
  complete: { label: "Complete", color: "#16A34A" },
  "in-progress": { label: "In Progress", color: "#D97706" },
  placeholder: { label: "Coming Soon", color: "#94A3B8" },
};

export function ProjectGrid() {
  return (
    <section className="bg-[#F8FAFC] py-24">
      <div className="max-w-[1200px] mx-auto px-[32px] md:px-[48px] lg:px-[64px]">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportConfig}>
          <motion.div variants={fadeUp} className="mb-14 max-w-[600px]">
            <p className="font-mono text-[11px] font-semibold tracking-[0.12em] text-[#94A3B8] uppercase mb-4">
              Featured Projects
            </p>
            <h2 className="text-[2rem] md:text-[2.5rem] font-extrabold text-[#134E4A] leading-tight tracking-tight mb-5">
              Nine projects.
              <br />
              One synthetic healthcare dataset.
            </h2>
            <p className="text-[1.0625rem] text-[#475569] leading-relaxed">
              From beginner classification to advanced multilingual NLP — each
              project is a standalone case study with honest metrics and
              operational context.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => {
              const diff = difficultyConfig[project.difficulty];
              const status = statusConfig[project.status];
              const isAvailable = project.status !== "placeholder";

              return (
                <motion.div key={project.slug} variants={fadeUp}>
                  <Link
                    href={"/projects/" + project.slug}
                    className={
                      "group flex flex-col h-full rounded-xl border bg-white transition-all duration-200 " +
                      (isAvailable
                        ? "border-[#E2E8F0] hover:border-[#99F6E4] hover:shadow-[0_4px_24px_rgba(13,148,136,0.10)] cursor-pointer"
                        : "border-[#E2E8F0] opacity-60 cursor-default pointer-events-none")
                    }
                  >
                    <div className="h-[3px] rounded-t-xl bg-[#0D9488] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <div className="flex flex-col flex-1 p-6">
                      <div className="flex items-center justify-between mb-5">
                        <span className="font-mono text-[11px] font-semibold text-[#94A3B8] tracking-widest">
                          {String(project.number).padStart(2, "0")}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold font-mono" style={{ color: status.color }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: status.color }} />
                          {status.label}
                        </span>
                      </div>

                      {project.keyMetric && (
                        <div className="mb-4">
                          <p className="text-[2rem] font-extrabold text-[#134E4A] font-mono leading-none tracking-tight">
                            {project.keyMetric.value}
                          </p>
                          <p className="text-[11px] text-[#94A3B8] font-mono uppercase tracking-widest mt-0.5">
                            {project.keyMetric.label}
                          </p>
                        </div>
                      )}

                      <h3 className="text-[1rem] font-bold text-[#0F172A] leading-snug mb-2">
                        {project.title}
                      </h3>
                      <p className="text-[0.875rem] text-[#475569] leading-relaxed flex-1 mb-5">
                        {project.tagline}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-5">
                        <span
                          className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold"
                          style={{ color: diff.color, backgroundColor: diff.bg }}
                        >
                          {project.difficulty}
                        </span>
                        {project.techniques.slice(0, 2).map((t) => (
                          <span key={t} className="inline-block px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#F1F5F9] text-[#475569]">
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9]">
                        <div className="flex items-center gap-1 text-[11px] text-[#94A3B8]">
                          <Database size={11} />
                          <span>{project.tables.length} tables</span>
                        </div>
                        {isAvailable && (
                          <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#0D9488] group-hover:gap-2 transition-all duration-150">
                            View Project <ArrowRight size={12} />
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
