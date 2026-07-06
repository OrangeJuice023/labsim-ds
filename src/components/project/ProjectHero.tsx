import Link from "next/link";
import type { ProjectMeta } from "@/lib/types";

const difficultyColors = {
  Beginner: { color: "#4ADE80" },
  Intermediate: { color: "#FBBF24" },
  Advanced: { color: "#FB7185" },
};

const statusLabels = {
  complete: "Complete",
  "in-progress": "In Progress",
  placeholder: "Coming Soon",
};

export function ProjectHero({ project }: { project: ProjectMeta }) {
  const diff = difficultyColors[project.difficulty];

  return (
    <div className="bg-[#0F172A] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#D97706]" />

      <div className="max-w-[1200px] mx-auto px-[32px] md:px-[48px] lg:px-[64px] pt-16 pb-14">
        <div className="flex items-center gap-2 font-mono text-[11px] text-[#94A3B8] mb-8">
          <Link href="/" className="hover:text-white transition-colors cursor-pointer">Home</Link>
          <span>/</span>
          <Link href="/projects" className="hover:text-white transition-colors cursor-pointer">Projects</Link>
          <span>/</span>
          <span className="text-[#CBD5E1]">{String(project.number).padStart(2, "0")}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#1E293B]" style={{ color: diff.color }}>
            {project.difficulty}
          </span>
          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#1E293B] text-[#CBD5E1]">
            {statusLabels[project.status]}
          </span>
          {project.clients.slice(0, 2).map((c) => (
            <span key={c} className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#1E293B]/60 text-[#94A3B8]">
              {c}
            </span>
          ))}
        </div>

        <h1 className="text-[2rem] md:text-[2.75rem] font-extrabold text-white leading-tight tracking-tight mb-4">
          {project.title}
        </h1>

        <p className="text-[1.0625rem] text-[#94A3B8] leading-relaxed max-w-[600px] mb-10">
          {project.tagline}
        </p>

        <div className="flex flex-wrap items-end gap-10 pt-8 border-t border-[#334155]/60">
          {project.keyMetric && (
            <div>
              <p className="text-[2.5rem] font-extrabold text-white font-mono leading-none tracking-tight">
                {project.keyMetric.value}
              </p>
              <p className="text-xs text-[#94A3B8] font-mono uppercase tracking-widest mt-1">
                {project.keyMetric.label}
              </p>
            </div>
          )}

          <div>
            <p className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-widest mb-2">Techniques</p>
            <div className="flex flex-wrap gap-2">
              {project.techniques.map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-md text-[12px] font-medium bg-[#1E293B] text-[#CBD5E1]">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-widest mb-2">Tables Used</p>
            <div className="flex flex-wrap gap-2">
              {project.tables.map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-md text-[12px] font-mono bg-[#1E293B] text-[#CBD5E1]">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
