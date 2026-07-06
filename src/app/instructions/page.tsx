const codeSnippet = `import numpy as np
import pandas as pd
from faker import Faker

fake = Faker()
Faker.seed(42)
rng = np.random.default_rng(42)

# Each synthetic client gets a distinct operational personality
CLIENT_PROFILES = {
    "client_a": {"branches": 3, "daily_volume": 220, "currency": "PHP"},
    "client_b": {"branches": 1, "daily_volume": 140, "currency": "PHP"},
    "client_c": {"branches": 1, "daily_volume": 90,  "currency": "PHP"},
    "client_d": {"branches": 1, "daily_volume": 60,  "currency": "PHP"},
    "client_e": {"branches": 1, "daily_volume": 110, "currency": "IDR"},
}

def sample_result(test_name):
    """Draw a lab value from a per-test distribution,
    with a controlled abnormal rate (~23%)."""
    lo, hi = REF_RANGES[test_name]
    if rng.random() < 0.23:
        # abnormal: push outside the range
        return hi * (1 + rng.uniform(0.05, 0.60))
    return rng.uniform(lo, hi)

def inject_quality_issues(df, null_join_rate=0.15):
    """Reproduce production messiness: null join keys,
    partial timestamp coverage, batch-locked times."""
    mask = rng.random(len(df)) < null_join_rate
    df.loc[mask, "order_id"] = None
    return df`;

function SectionLabel({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="font-mono text-[11px] font-bold text-[#94A3B8] tracking-widest">{number}</span>
      <span className="h-px flex-1 bg-[#E2E8F0] max-w-[40px]" />
      <span className="font-mono text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest">{label}</span>
    </div>
  );
}

const setupSteps = [
  { step: "01", title: "Clone the repository", desc: "Fork this repo to your own GitHub account, then clone it locally." },
  { step: "02", title: "Install dependencies", desc: "Run pnpm install in the project root. Node 18+ required." },
  { step: "03", title: "Generate the dataset", desc: "Run python scripts/generate_synthetic.py to produce the full five-client dataset locally." },
  { step: "04", title: "Start the dev server", desc: "Run pnpm dev and open localhost:3000 to see your local copy." },
];

const buildSteps = [
  { step: "01", title: "Pick a project and run the analysis", desc: "Choose one of the nine projects, load the synthetic CSVs, and work the problem end to end in a notebook — labels, features, models, validation." },
  { step: "02", title: "Edit project metadata", desc: "Open src/content/projects.ts and update the ProjectMeta object — title, tagline, difficulty, techniques, and your real key metric." },
  { step: "03", title: "Write your project content", desc: "Open src/content/project-details.ts and fill the six sections with YOUR results: business problem, data sources, methodology, analysis, insights, future improvements." },
  { step: "04", title: "Add your results data", desc: "Export chart data and model metrics as JSON into public/data/projects/. The page reads from there." },
  { step: "05", title: "Deploy your own version", desc: "Push to your GitHub, import the repo into your own Vercel account. You get your own live URL for your resume." },
];

export default function InstructionsPage() {
  return (
    <div>
      <div className="bg-[#0F172A] relative">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#D97706]" />
        <div className="max-w-[1200px] mx-auto px-[32px] md:px-[48px] lg:px-[64px] pt-20 pb-20">
          <p className="font-mono text-[11px] font-semibold tracking-[0.12em] text-[#94A3B8] uppercase mb-4">
            Fork Guide
          </p>
          <h1 className="text-[2.5rem] md:text-[3rem] font-extrabold text-white leading-[1.1] tracking-[-0.02em] mb-5">
            Use this as the starting point for your own portfolio.
          </h1>
          <p className="text-[1.0625rem] text-[#94A3B8] max-w-[600px] leading-[1.7]">
            This site is a reference implementation. The structure, components,
            design system, and synthetic dataset are already built — your job
            is the data science.
          </p>
        </div>
      </div>

      <div className="max-w-[820px] mx-auto px-[32px] md:px-[48px] lg:px-[64px] py-16 space-y-20">

        <section>
          <SectionLabel number="01" label="Overview" />
          <h2 className="text-[1.75rem] font-extrabold text-[#134E4A] leading-tight mb-4">
            What you are building.
          </h2>
          <p className="text-[1.0625rem] text-[#475569] leading-relaxed">
            Pick one or more of the nine projects, run the analysis on the
            synthetic dataset, and publish your own version with your real
            results. Because the data is fully synthetic, there is nothing to
            request, nothing to mask, and nothing you can leak — clone and go.
          </p>
        </section>

        <section>
          <SectionLabel number="02" label="The Data Contract" />
          <div className="rounded-xl border-2 border-[#99F6E4] bg-[#F0FDFA]/60 p-6">
            <p className="font-bold text-[#134E4A] text-[1.0625rem] mb-3">
              Everything here is synthetic. Keep it that way.
            </p>
            <p className="text-[0.9375rem] text-[#475569] leading-relaxed mb-3">
              The dataset is generated by scripts/generate_synthetic.py with a
              fixed seed — anyone can reproduce the exact same records. No real
              patient, physician, facility, or transaction exists anywhere in
              this repository.
            </p>
            <p className="text-[0.9375rem] text-[#475569] leading-relaxed">
              If you adapt this template with your own employer's data: do not.
              Generate synthetic data modeled on it instead — the Synthetic
              Data page explains the approach.
            </p>
          </div>
        </section>

        <section>
          <SectionLabel number="03" label="Setup" />
          <h2 className="text-[1.75rem] font-extrabold text-[#134E4A] leading-tight mb-6">
            Get the project running locally.
          </h2>
          <div className="space-y-3">
            {setupSteps.map(function renderStep(s) {
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

        <section>
          <SectionLabel number="04" label="The Generator" />
          <h2 className="text-[1.75rem] font-extrabold text-[#134E4A] leading-tight mb-4">
            How the data is made.
          </h2>
          <p className="text-[1.0625rem] text-[#475569] leading-relaxed mb-6">
            The core logic below shows the generator's approach: per-client
            personalities, distribution-based result sampling with a controlled
            abnormal rate, and deliberate data-quality injection. The full
            script lives in scripts/generate_synthetic.py.
          </p>
          <div className="rounded-xl bg-[#0F172A] p-5 overflow-x-auto">
            <pre className="font-mono text-[12.5px] leading-[1.7] text-[#CBD5E1] whitespace-pre">{codeSnippet}</pre>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <p className="font-semibold text-[#134E4A] text-[0.9375rem] mb-2">Engineered to be realistic</p>
              <p className="text-[0.875rem] text-[#475569] leading-relaxed">Real-world age distributions, per-test reference ranges, intraday volume curves, weekday effects, and five distinct client personalities.</p>
            </div>
            <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <p className="font-semibold text-[#134E4A] text-[0.9375rem] mb-2">Engineered to be difficult</p>
              <p className="text-[0.875rem] text-[#475569] leading-relaxed">Null join keys, zero-value insurance records, partial timestamp coverage, multilingual free text, and injected anomalies with known ground truth.</p>
            </div>
          </div>
        </section>

        <section>
          <SectionLabel number="05" label="Build Your Project" />
          <h2 className="text-[1.75rem] font-extrabold text-[#134E4A] leading-tight mb-6">
            From analysis to published page.
          </h2>
          <div className="space-y-3">
            {buildSteps.map(function renderStep(s) {
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

      </div>
    </div>
  );
}
