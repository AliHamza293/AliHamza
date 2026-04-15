"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#services", label: "Services" },
  { href: "/blog", label: "Blog", external: true },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-bg-base/90 backdrop-blur-xl border-b border-white/[0.04]" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-accent-cyan rounded flex items-center justify-center">
            <span className="font-heading text-bg-base text-sm leading-none">U</span>
          </div>
          <span className="font-mono text-[0.7rem] text-gray-400 tracking-widest uppercase group-hover:text-accent-cyan transition-colors">
            dev.unity
          </span>
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="nav-link">
                <span className="text-accent-cyan opacity-40 mr-1">{">"}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <div className="status-badge">
            <div className="status-dot" />
            Available
          </div>
          <a href="#contact" className="btn-primary py-2 px-4 text-[0.68rem]">Hire Me</a>
        </div>

        <button className="md:hidden p-2 text-gray-400 hover:text-accent-cyan transition-colors" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className={`md:hidden transition-all duration-300 overflow-hidden ${open ? "max-h-96 border-b border-white/[0.04]" : "max-h-0"}`}
        style={{ background: "#060809" }}>
        <ul className="px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="nav-link block text-sm" onClick={() => setOpen(false)}>
                <span className="text-accent-cyan opacity-50 mr-2">{">"}</span>{l.label}
              </a>
            </li>
          ))}
          <li className="pt-2 border-t border-white/[0.05]">
            <a href="#contact" className="btn-primary w-full justify-center" onClick={() => setOpen(false)}>Hire Me</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
