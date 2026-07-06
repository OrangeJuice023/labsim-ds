"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/methodology", label: "Synthetic Data" },
  { href: "/lessons", label: "Lessons" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={
        "sticky top-0 z-[400] w-full transition-all duration-300 " +
        (isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-sm"
          : "bg-white border-b border-transparent")
      }
    >
      <div className="max-w-[1200px] mx-auto px-[32px] md:px-[48px] lg:px-[64px] h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] rounded"
        >
          <span className="font-mono text-[#0D9488] font-bold text-xl tracking-tight">
            LabSim
          </span>
          <span className="hidden sm:inline font-mono text-[10px] text-[#94A3B8] tracking-widest uppercase mt-1">
            synthetic healthcare DS
          </span>
        </Link>

        <nav className="hidden md:flex items-center">
          <div className="flex items-center gap-1 mr-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-md text-sm font-medium text-[#475569] hover:text-[#134E4A] hover:bg-[#F0FDFA] transition-colors duration-150 cursor-pointer"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link
            href="/projects"
            className="px-4 py-2 rounded-md text-sm font-semibold bg-[#0D9488] text-white hover:bg-[#0F766E] transition-colors duration-150 cursor-pointer"
          >
            View Projects
          </Link>
        </nav>

        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="md:hidden p-2 rounded-md text-[#475569] hover:bg-[#F0FDFA] transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isMobileOpen && (
        <div className="md:hidden border-t border-[#E2E8F0] bg-white px-8 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className="px-4 py-3 rounded-md text-sm font-medium text-[#475569] hover:text-[#134E4A] hover:bg-[#F0FDFA] transition-colors duration-150 cursor-pointer"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/projects"
            onClick={() => setIsMobileOpen(false)}
            className="mt-2 px-4 py-3 rounded-md text-sm font-semibold text-center bg-[#0D9488] text-white hover:bg-[#0F766E] transition-colors duration-150 cursor-pointer"
          >
            View Projects
          </Link>
        </div>
      )}
    </header>
  );
}
