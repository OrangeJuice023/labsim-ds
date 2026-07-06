"use client";

import { ProjectHero } from "@/components/project/ProjectHero";
import { ProjectSidebar } from "@/components/project/ProjectSidebar";
import type { ProjectMeta } from "@/lib/types";
import type { ProjectDetail } from "@/content/project-details";

function SectionLabel({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="font-mono text-[11px] font-bold text-[#94A3B8] tracking-widest">{number}</span>
      <span className="h-px flex-1 bg-[#E2E8F0] max-w-[40px]" />
      <span className="font-mono text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest">{label}</span>
    </div>
  );
}

export function ProjectPageTemplate({ project, detail }: { project: ProjectMeta; detail: ProjectDetail }) {
  return (
    <div>
      <ProjectHero project={project} />
      <div className="max-w-[1200px] mx-auto px-[32px] md:px-[48px] lg:px-[64px] py-16">
        <div className="flex gap-12">
          <ProjectSidebar projectNumber={project.number} projectTitle={project.title} />
          <div className="flex-1 min-w-0 space-y-20">

            <section id="business-problem" className="scroll-mt-24">
              <SectionLabel number="01" label="Business Problem" />
              <h2 className="text-[1.75rem] font-extrabold text-[#134E4A] leading-tight mb-4">{detail.businessProblem.headline}</h2>
              {detail.businessProblem.paragraphs.map(function renderP(p, i) {
                return <p key={i} className="text-[1.0625rem] text-[#475569] leading-relaxed mb-6">{p}</p>;
              })}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                {detail.businessProblem.cards.map(function renderCard(c) {
                  return (
                    <div key={c.label} className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                      <p className="font-mono text-[10px] text-[#94A3B8] uppercase tracking-widest mb-2">{c.label}</p>
                      <p className="font-semibold text-[#134E4A] text-[0.9375rem]">{c.value}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            <section id="data-sources" className="scroll-mt-24">
              <SectionLabel number="02" label="Data Sources" />
              <h2 className="text-[1.75rem] font-extrabold text-[#134E4A] leading-tight mb-4">{detail.dataSources.headline}</h2>
              <p className="text-[1.0625rem] text-[#475569] leading-relaxed mb-8">{detail.dataSources.description}</p>
              <div className="space-y-3">
                {detail.dataSources.tables.map(function renderTable(t) {
                  const highlight = t.primary || false;
                  const borderClass = highlight ? "border-[#99F6E4] bg-[#F0FDFA]/60" : "border-[#E2E8F0] bg-white";
                  const nameClass = highlight ? "text-[#0D9488]" : "text-[#134E4A]";
                  return (
                    <div key={t.name} className={"p-5 rounded-xl border " + borderClass}>
                      <div className="flex items-start justify-between mb-3">
                        <code className={"font-mono text-sm font-bold " + nameClass}>{t.name}</code>
                        {highlight ? (
                          <span className="font-mono text-[10px] text-[#D97706] font-semibold tracking-widest">{"* PRIMARY"}</span>
                        ) : null}
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {t.fields.map(function renderField(f) {
                          return <span key={f} className="font-mono text-[11px] bg-white border border-[#E2E8F0] text-[#475569] px-2 py-0.5 rounded">{f}</span>;
                        })}
                      </div>
                      <p className="text-[0.875rem] text-[#94A3B8]">{t.note}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            <section id="methodology" className="scroll-mt-24">
              <SectionLabel number="03" label="Methodology" />
              <h2 className="text-[1.75rem] font-extrabold text-[#134E4A] leading-tight mb-4">{detail.methodology.headline}</h2>
              <p className="text-[1.0625rem] text-[#475569] leading-relaxed mb-8">{detail.methodology.description}</p>
              <div className="space-y-3">
                {detail.methodology.steps.map(function renderStep(s) {
                  return (
                    <div key={s.step} className="flex gap-4 p-5 rounded-xl bg-white border border-[#E2E8F0]">
                      <span className="font-mono text-[11px] font-bold text-[#94A3B8] tracking-widest flex-shrink-0 pt-0.5">{s.step}</span>
                      <div>
                        <p className="font-semibold text-[#0F172A] text-[0.9375rem] mb-1">{s.title}</p>
                        <p className="text-[0.875rem] text-[#475569] leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section id="interactive-analysis" className="scroll-mt-24">
              <SectionLabel number="04" label="Interactive Analysis" />
              <h2 className="text-[1.75rem] font-extrabold text-[#134E4A] leading-tight mb-4">{detail.analysis.headline}</h2>
              <p className="text-[1.0625rem] text-[#475569] leading-relaxed mb-8">{detail.analysis.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {detail.analysis.kpis.map(function renderKPI(k) {
                  return (
                    <div key={k.label} className="p-5 rounded-xl border border-[#E2E8F0] bg-white">
                      <p className="text-[1.75rem] font-extrabold font-mono leading-none tracking-tight mb-1" style={{ color: k.color }}>{k.value}</p>
                      <p className="text-[0.875rem] font-semibold text-[#0F172A] mb-0.5">{k.label}</p>
                      <p className="text-[0.75rem] text-[#94A3B8]">{k.sub}</p>
                    </div>
                  );
                })}
              </div>
              {detail.analysis.charts.map(function renderChart(c) {
                return (
                  <div key={c.title} className="rounded-xl border border-dashed border-[#99F6E4] bg-[#F8FAFC] p-12 text-center mb-6">
                    <p className="font-mono text-[11px] text-[#94A3B8] uppercase tracking-widest mb-2">Chart Placeholder</p>
                    <p className="text-[0.9375rem] font-semibold text-[#134E4A] mb-1">{c.title}</p>
                    <p className="text-sm text-[#94A3B8]">{c.subtitle}</p>
                  </div>
                );
              })}
            </section>

            <section id="insights" className="scroll-mt-24">
              <SectionLabel number="05" label="Insights" />
              <h2 className="text-[1.75rem] font-extrabold text-[#134E4A] leading-tight mb-4">{detail.insights.headline}</h2>
              <div className="space-y-4">
                {detail.insights.items.map(function renderInsight(item, i) {
                  return (
                    <div key={i} className="flex gap-4 p-5 rounded-xl bg-white border border-[#E2E8F0]">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#F0FDFA] flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-[#0D9488]" />
                      </span>
                      <div>
                        <p className="font-semibold text-[#0F172A] text-[0.9375rem] mb-1">{item.title}</p>
                        <p className="text-[0.875rem] text-[#475569] leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section id="future-improvements" className="scroll-mt-24">
              <SectionLabel number="06" label="Future Improvements" />
              <h2 className="text-[1.75rem] font-extrabold text-[#134E4A] leading-tight mb-4">{detail.future.headline}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {detail.future.items.map(function renderFuture(item) {
                  return (
                    <div key={item.title} className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                      <p className="font-semibold text-[#134E4A] text-[0.9375rem] mb-2">{item.title}</p>
                      <p className="text-[0.875rem] text-[#475569] leading-relaxed">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
