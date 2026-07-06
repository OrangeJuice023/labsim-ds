"use client";

import { useEffect, useState } from "react";

export const PROJECT_SECTIONS = [
  { id: "business-problem", label: "Business Problem", number: "01" },
  { id: "data-sources", label: "Data Sources", number: "02" },
  { id: "methodology", label: "Methodology", number: "03" },
  { id: "interactive-analysis", label: "Interactive Analysis", number: "04" },
  { id: "insights", label: "Insights", number: "05" },
  { id: "future-improvements", label: "Future Improvements", number: "06" },
];

export function ProjectSidebar({ projectNumber, projectTitle }: { projectNumber: number; projectTitle: string }) {
  const [activeId, setActiveId] = useState("business-problem");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(function observe() {
    const observers: IntersectionObserver[] = [];
    PROJECT_SECTIONS.forEach(function each(s) {
      const el = document.getElementById(s.id);
      if (!el) return;
      const obs = new IntersectionObserver(function cb(entries) {
        if (entries[0].isIntersecting) setActiveId(s.id);
      }, { rootMargin: "-20% 0px -70% 0px", threshold: 0 });
      obs.observe(el);
      observers.push(obs);
    });
    return function cleanup() { observers.forEach(function d(o) { o.disconnect(); }); };
  }, []);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: top, behavior: "smooth" });
    setMobileOpen(false);
  }

  const pad = String(projectNumber).padStart(2, "0");

  return (
    <div>
      <aside className="hidden lg:block w-[220px] flex-shrink-0">
        <div className="sticky top-24">
          <div className="mb-6 pb-5 border-b border-[#E2E8F0]">
            <p className="font-mono text-[10px] font-semibold tracking-[0.16em] text-[#94A3B8] uppercase mb-1">
              {"Project " + pad}
            </p>
            <p className="text-[0.8125rem] font-semibold text-[#134E4A] leading-snug">
              {projectTitle}
            </p>
          </div>
          <nav className="flex flex-col gap-0.5">
            {PROJECT_SECTIONS.map(function renderLink(section) {
              const isActive = activeId === section.id;
              let btnClass = "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-left w-full transition-all duration-150 cursor-pointer ";
              btnClass += isActive ? "bg-[#F0FDFA] text-[#0D9488]" : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#134E4A]";
              let numClass = "font-mono text-[10px] font-semibold tracking-widest flex-shrink-0 ";
              numClass += isActive ? "text-[#0D9488]" : "text-[#94A3B8]";
              return (
                <button key={section.id} onClick={function click() { scrollTo(section.id); }} className={btnClass}>
                  <span className={numClass}>{section.number}</span>
                  <span className="text-[0.8125rem] font-medium leading-snug">{section.label}</span>
                </button>
              );
            })}
          </nav>
          <div className="mt-8 pt-5 border-t border-[#E2E8F0]">
            <a href="/projects" className="flex items-center gap-2 text-[0.8125rem] text-[#94A3B8] hover:text-[#134E4A] transition-colors duration-150 cursor-pointer">
              {"< All Projects"}
            </a>
          </div>
        </div>
      </aside>

      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={function toggle() { setMobileOpen(!mobileOpen); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0F172A] text-white text-sm font-semibold shadow-lg cursor-pointer"
        >
          <span className="font-mono text-xs">
            {PROJECT_SECTIONS.find(function f(s) { return s.id === activeId; })?.number || "01"}
          </span>
          Sections
        </button>
        {mobileOpen ? (
          <div className="absolute bottom-14 right-0 w-56 bg-white border border-[#E2E8F0] rounded-xl shadow-xl overflow-hidden">
            {PROJECT_SECTIONS.map(function renderMobile(section) {
              const isActive = activeId === section.id;
              let cls = "flex items-center gap-3 w-full px-4 py-3 text-left transition-colors duration-150 cursor-pointer ";
              cls += isActive ? "bg-[#F0FDFA] text-[#0D9488]" : "text-[#475569] hover:bg-[#F8FAFC]";
              return (
                <button key={section.id} onClick={function click() { scrollTo(section.id); }} className={cls}>
                  <span className="font-mono text-[10px] text-[#94A3B8] flex-shrink-0">{section.number}</span>
                  <span className="text-sm font-medium">{section.label}</span>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
