function SectionLabel({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="font-mono text-[11px] font-bold text-[#94A3B8] tracking-widest">{number}</span>
      <span className="h-px flex-1 bg-[#E2E8F0] max-w-[40px]" />
      <span className="font-mono text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest">{label}</span>
    </div>
  );
}

const lessons = [
  {
    number: "01",
    tag: "Data Discipline",
    title: "Profile before you build. Every single time.",
    body: [
      "The most expensive mistakes I made early on came from assuming a dataset's shape instead of checking it. A dashboard spec that assumes a join exists, when the join key is null in production, doesn't fail loudly — it silently shows wrong numbers to a client.",
      "Now, every build starts with a profiling pass: coverage percentages, null rates on join keys, timestamp completeness, value distributions. Fifteen minutes of profiling SQL has repeatedly saved days of rework. The rule I give every intern: the data decides what the dashboard can honestly hold, not the spec.",
    ],
  },
  {
    number: "02",
    tag: "Architecture",
    title: "One source of truth per output. Blending is a trap.",
    body: [
      "When a chart pulls from multiple blended sources, the failure modes multiply: row inflation from fan-out joins, silent double counting, and debugging sessions that eat entire afternoons. I learned to enforce a simple rule — one prepared table per chart, transformations pushed upstream into the data layer where they can be tested.",
      "This sounds like a technical preference, but it's really a leadership tool. A rule that's simple enough to state in one sentence is a rule a team of juniors can actually follow without me reviewing every build.",
    ],
  },
  {
    number: "03",
    tag: "Honesty",
    title: "An honest 78% beats a fabricated 95%.",
    body: [
      "At a scale-up, there's constant pressure to show impressive numbers — to clients, to leadership, to your own portfolio. The temptation to lead with the flattering metric and bury the caveat is real.",
      "What I've found is that stated limitations build more trust than polished claims. When one of my interns added an unprompted robustness probe that revealed his 100% accuracy dropped to 95% on unseen terms, that honesty made his work more credible, not less. I try to lead the same way: every project on this site ends with what it cannot do.",
    ],
  },
  {
    number: "04",
    tag: "Leading Juniors",
    title: "Build the paved road, then get out of the way.",
    body: [
      "Mentoring an intern cohort taught me that the highest-leverage thing a lead can do isn't reviewing every output — it's building the system that makes good output the default. Templates, profiling checklists, one-sentence rules, a reference implementation they can fork.",
      "The internal version of this platform exists precisely for that reason. When someone junior asks 'is my idea too simple?', the answer is almost never about the algorithm — it's about whether they can explain what a decision-maker would do differently with the result. Teaching people to ask 'so what?' matters more than teaching them another model.",
    ],
  },
  {
    number: "05",
    tag: "Cross-Cultural Ops",
    title: "Context travels worse than code.",
    body: [
      "Working with clients and teammates across countries taught me that technical artifacts port easily — a SQL pattern works the same everywhere — but assumptions don't. A revenue metric that makes sense in one market is actively misleading in another where government insurance settles outside the system and records every service at zero.",
      "The lesson: before reusing an analysis across markets, re-derive its assumptions from that market's data. And communicate in the register your audience actually works in — the same finding needs different framing for an engineer, an operations manager, and an executive.",
    ],
  },
  {
    number: "06",
    tag: "Shipping",
    title: "Debugging is a discipline, not a mood.",
    body: [
      "Building this platform's first version, I lost hours to a styling bug that turned out to be one global CSS rule silently overriding an entire utility framework. The fix took one minute. Finding it took hours — because I kept guessing instead of isolating.",
      "The meta-lesson stuck harder than the technical one: when something breaks, resist the urge to try fixes. Reproduce, isolate, confirm the mechanism, then fix once. Under scale-up time pressure, the slow-looking method is the fast one.",
    ],
  },
  {
    number: "07",
    tag: "Privacy",
    title: "Privacy is a design constraint, not a compliance step.",
    body: [
      "The naive way to make a healthcare portfolio is to anonymize production data and hope the masking holds. The better way is to treat privacy as an upstream design decision: if the public artifact is synthetic from the start, entire categories of risk disappear — and you gain evaluation superpowers, like known ground truth for anomaly detection.",
      "This reframe — from 'how do I safely expose data' to 'how do I build data that needs no protection' — is the single most transferable idea in this whole project.",
    ],
  },
];

export default function LessonsPage() {
  return (
    <div>
      <div className="bg-[#0F172A] relative">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#D97706]" />
        <div className="max-w-[1200px] mx-auto px-[32px] md:px-[48px] lg:px-[64px] pt-20 pb-20">
          <p className="font-mono text-[11px] font-semibold tracking-[0.12em] text-[#94A3B8] uppercase mb-4">
            Lessons Learned
          </p>
          <h1 className="text-[2.5rem] md:text-[3rem] font-extrabold text-white leading-[1.1] tracking-[-0.02em] mb-5">
            Notes from leading data at a scale-up, early in my career.
          </h1>
          <p className="text-[1.0625rem] text-[#94A3B8] max-w-[620px] leading-[1.7]">
            I stepped into a data leadership role young — mentoring interns,
            shipping client-facing analytics, and making architecture calls
            without a senior data engineer above me to catch mistakes. These are
            the lessons that cost me something to learn.
          </p>
        </div>
      </div>

      <div className="max-w-[820px] mx-auto px-[32px] md:px-[48px] lg:px-[64px] py-16 space-y-16">
        {lessons.map(function renderLesson(lesson) {
          return (
            <section key={lesson.number}>
              <SectionLabel number={lesson.number} label={lesson.tag} />
              <h2 className="text-[1.5rem] font-extrabold text-[#134E4A] leading-tight mb-4">
                {lesson.title}
              </h2>
              {lesson.body.map(function renderP(p, i) {
                return (
                  <p key={i} className="text-[1.0625rem] text-[#475569] leading-relaxed mb-4">
                    {p}
                  </p>
                );
              })}
            </section>
          );
        })}

        <section className="pt-4">
          <div className="rounded-xl border border-[#99F6E4] bg-[#F0FDFA]/60 p-6">
            <p className="font-semibold text-[#134E4A] text-[1rem] mb-2">The through-line</p>
            <p className="text-[0.9375rem] text-[#475569] leading-relaxed">
              Almost every lesson here reduces to the same move: replace
              assumption with verification, and replace ad-hoc judgment with a
              rule simple enough for a team to follow. That's what leading data
              work at a small company actually is — not knowing more algorithms,
              but building the conditions where honest, correct work is the
              path of least resistance.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
