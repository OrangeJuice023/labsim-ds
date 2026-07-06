import Link from "next/link";

const footerLinks = {
  Projects: [
    { href: "/projects/01-abnormal-results", label: "Abnormal Result Predictor" },
    { href: "/projects/02-turnaround-time", label: "Turnaround Time Predictor" },
    { href: "/projects/03-patient-segmentation", label: "Patient Segmentation" },
    { href: "/projects/04-test-bundles", label: "Test Bundle Analysis" },
    { href: "/projects/05-revenue-anomalies", label: "Revenue Anomaly Detection" },
  ],
  "More Projects": [
    { href: "/projects/06-ticket-intelligence", label: "Ticket Intelligence" },
    { href: "/projects/07-soap-nlp", label: "Clinical Notes NLP" },
    { href: "/projects/08-radiology-parser", label: "Radiology Parser" },
    { href: "/projects/09-cross-client-benchmark", label: "Cross-Client Benchmarking" },
  ],
  Site: [
    { href: "/methodology", label: "Synthetic Data" },
    { href: "/instructions", label: "Instructions" },
    { href: "/lessons", label: "Lessons Learned" },
    { href: "/about", label: "About" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white">
      <div className="max-w-[1200px] mx-auto px-[32px] md:px-[48px] lg:px-[64px] py-[64px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-1">
            <div className="mb-4">
              <span className="font-mono text-white font-bold text-lg tracking-tight">
                LabSim
              </span>
            </div>
            <p className="text-sm text-[#94A3B8] leading-relaxed max-w-[220px]">
              A healthcare data science portfolio built entirely on synthetic
              data modeled after real diagnostic lab operations.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#14B8A6]" />
              <span className="text-xs text-[#94A3B8] font-mono">
                100% synthetic — zero real records
              </span>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-widest mb-4 font-mono">
                {category}
              </p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#CBD5E1] hover:text-white transition-colors duration-150 cursor-pointer"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[#334155]/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#94A3B8] font-mono">
            © {new Date().getFullYear()} Gervi Corado · Data Operations Lead
          </p>
          <p className="text-xs text-[#94A3B8]">
            Built with Next.js · Deployed on Vercel
          </p>
        </div>
      </div>
    </footer>
  );
}
