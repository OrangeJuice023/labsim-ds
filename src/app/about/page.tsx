function SectionLabel({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="font-mono text-[11px] font-bold text-[#94A3B8] tracking-widest">{number}</span>
      <span className="h-px flex-1 bg-[#E2E8F0] max-w-[40px]" />
      <span className="font-mono text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest">{label}</span>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div>
      <div className="bg-[#0F172A] relative">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#D97706]" />
        <div className="max-w-[1200px] mx-auto px-[32px] md:px-[48px] lg:px-[64px] pt-20 pb-20">
          <p className="font-mono text-[11px] font-semibold tracking-[0.12em] text-[#94A3B8] uppercase mb-4">
            About
          </p>
          <h1 className="text-[2.5rem] md:text-[3rem] font-extrabold text-white leading-[1.1] tracking-[-0.02em] mb-5">
            The public twin of an internal training platform.
          </h1>
          <p className="text-[1.0625rem] text-[#94A3B8] max-w-[600px] leading-[1.7]">
            Built by a data operations lead at a healthcare SaaS scale-up, as a
            synthetic-data mirror of the system his intern cohort trains on.
          </p>
        </div>
      </div>

      <div className="max-w-[820px] mx-auto px-[32px] md:px-[48px] lg:px-[64px] py-16 space-y-20">

        <section>
          <SectionLabel number="01" label="The Origin" />
          <h2 className="text-[1.75rem] font-extrabold text-[#134E4A] leading-tight mb-4">
            This started as an internal system.
          </h2>
          <p className="text-[1.0625rem] text-[#475569] leading-relaxed mb-4">
            I lead data operations at Dashlabs.ai, a Y Combinator-backed
            healthcare diagnostics platform serving hundreds of laboratories and
            clinics. Part of my role is running the data science internship
            program — and early on, I hit a familiar problem: interns learn
            fastest on real operational data, but real healthcare data cannot
            simply be handed around.
          </p>
          <p className="text-[1.0625rem] text-[#475569] leading-relaxed mb-4">
            So I built an internal training platform: a full-stack portfolio
            system with nine end-to-end ML projects, structured around the exact
            five-table schema our production clients run on. Interns learn on
            data that behaves like production — the same broken joins, the same
            partial timestamp coverage, the same multilingual records — under
            controlled, privacy-safe conditions.
          </p>
          <p className="text-[1.0625rem] text-[#475569] leading-relaxed">
            LabSim is the public version of that system. Everything here runs on
            fully synthetic data I engineered to mirror the statistical
            properties of real healthcare lab operations. The company's clients,
            their data, and their identities appear nowhere on this site.
          </p>
        </section>

        <section>
          <SectionLabel number="02" label="What It Demonstrates" />
          <h2 className="text-[1.75rem] font-extrabold text-[#134E4A] leading-tight mb-4">
            Three skills at once.
          </h2>
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <p className="font-semibold text-[#134E4A] text-[0.9375rem] mb-2">Data science depth</p>
              <p className="text-[0.875rem] text-[#475569] leading-relaxed">Nine projects spanning classification, regression, clustering, association rules, anomaly detection, and multilingual clinical NLP — each with honest validation and stated limitations.</p>
            </div>
            <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <p className="font-semibold text-[#134E4A] text-[0.9375rem] mb-2">Synthetic data engineering</p>
              <p className="text-[0.875rem] text-[#475569] leading-relaxed">Designing generators that preserve analytical difficulty — realistic distributions, injected data-quality problems, distinct client personalities — is itself a demonstrable, increasingly valuable skill.</p>
            </div>
            <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <p className="font-semibold text-[#134E4A] text-[0.9375rem] mb-2">Technical leadership</p>
              <p className="text-[0.875rem] text-[#475569] leading-relaxed">The internal version of this system trains a cohort of data science interns. Building the platform other people learn on is a different job than doing the projects yourself — see the Lessons page for what that taught me.</p>
            </div>
          </div>
        </section>

        <section>
          <SectionLabel number="03" label="Important" />
          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-6">
            <p className="font-semibold text-[#134E4A] text-[1rem] mb-2">Independent personal project</p>
            <p className="text-[0.9375rem] text-[#475569] leading-relaxed">
              LabSim is a personal portfolio project. It is not an official
              product of my employer, and no real patient, physician, facility,
              or client data appears anywhere in this site or its repository.
              All records are synthetically generated; all client profiles are
              fictional composites. Any resemblance in metrics to real
              organizations is a property of realistic simulation, not real data.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
