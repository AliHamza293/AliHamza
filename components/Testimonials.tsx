"use client";
import { useState, useEffect } from "react";
import { Star, Quote, ExternalLink } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  platform: "Upwork" | "Fiverr" | "Direct";
  rating: number;
  text: string;
  avatar: string;
  accentColor: string;
  projectType?: string;
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Client Name",
    role: "Game Studio Owner",
    platform: "Upwork",
    rating: 5,
    text: "Delivered a complete multiplayer system for our mobile game in record time. The code quality was exceptional — clean, documented, and easy to extend. Our player retention doubled after launch.",
    avatar: "CS",
    accentColor: "#00f5d4",
    projectType: "Multiplayer System",
  },
  {
    id: 2,
    name: "Client Name",
    role: "Indie Game Developer",
    platform: "Fiverr",
    rating: 5,
    text: "I came with a rough idea and got back a polished, production-ready game. The UI work alone was worth it — players commented on how clean it felt. Will hire again on the next project.",
    avatar: "IG",
    accentColor: "#7b61ff",
    projectType: "Full Game Development",
  },
  {
    id: 3,
    name: "Client Name",
    role: "Mobile App Entrepreneur",
    platform: "Direct",
    rating: 5,
    text: "Fixed critical performance issues that 2 other developers couldn't solve. Found the root cause in hours, shipped the fix in days. Game now runs at a stable 60fps on target devices.",
    avatar: "MA",
    accentColor: "#ffbe0b",
    projectType: "Performance Optimization",
  },
  {
    id: 4,
    name: "Client Name",
    role: "Startup Founder",
    platform: "Upwork",
    rating: 5,
    text: "Ali built our entire economy system from scratch — gems, daily rewards, IAP integration, and progression balancing. Exactly what we needed and delivered ahead of schedule.",
    avatar: "SF",
    accentColor: "#ff6b35",
    projectType: "Economy System",
  },
];

const PLATFORM_COLORS: Record<string, string> = {
  Upwork: "text-green-400 bg-green-500/10 border-green-500/20",
  Fiverr: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  Direct: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
};

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);
  const [active, setActive] = useState(0);

  // Featured (large) testimonial
  const featured = testimonials[active];

  return (
    <section id="testimonials" className="py-28 bg-bg-base relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(0,245,212,0.03), transparent 70%)" }} />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="section-label justify-center">// Client Testimonials</div>
          <h2 className="section-heading text-[clamp(2.5rem,5vw,4rem)] text-white mb-4">
            What Clients Say
          </h2>
          <p className="text-gray-500 font-light max-w-md mx-auto text-[1.02rem]">
            Honest feedback from real clients across Upwork, Fiverr, and direct engagements.
          </p>
        </div>

        {/* Featured testimonial */}
        <div className="mb-8 card-base p-8 md:p-10 relative overflow-hidden">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: `linear-gradient(90deg, transparent, ${featured.accentColor}, transparent)` }} />

          {/* Big quote mark */}
          <div className="absolute top-6 right-8 opacity-[0.04]">
            <Quote size={80} className="text-white" />
          </div>

          <div className="grid md:grid-cols-[1fr_auto] gap-8 items-start">
            <div>
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: featured.rating }).map((_, i) => (
                  <Star key={i} size={16} className="fill-accent-amber text-accent-amber" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-gray-200 text-lg md:text-xl font-light leading-relaxed italic mb-6">
                "{featured.text}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-heading text-lg flex-shrink-0"
                  style={{ background: `${featured.accentColor}20`, color: featured.accentColor, border: `1px solid ${featured.accentColor}30` }}>
                  {featured.avatar}
                </div>
                <div>
                  <div className="text-white font-semibold">{featured.name}</div>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="font-mono text-[0.6rem] text-gray-500 uppercase tracking-wide">{featured.role}</span>
                    <span className={`font-mono text-[0.55rem] px-2 py-0.5 rounded border ${PLATFORM_COLORS[featured.platform]}`}>
                      {featured.platform}
                    </span>
                    {featured.projectType && (
                      <span className="font-mono text-[0.55rem] text-gray-700 uppercase tracking-wide">
                        · {featured.projectType}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial selector cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setActive(i)}
              className={`card-base p-4 text-left transition-all ${
                active === i
                  ? "border-opacity-40 scale-[1.02]"
                  : "opacity-60 hover:opacity-90"
              }`}
              style={active === i ? { borderColor: `${t.accentColor}40`, boxShadow: `0 0 20px ${t.accentColor}10` } : {}}
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={10} className="fill-accent-amber text-accent-amber" />
                ))}
              </div>
              <p className="text-gray-500 text-xs font-light leading-relaxed line-clamp-3 mb-3">
                "{t.text.slice(0, 80)}..."
              </p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center font-heading text-xs flex-shrink-0"
                  style={{ background: `${t.accentColor}20`, color: t.accentColor }}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-gray-300 text-[0.7rem] font-medium">{t.name}</div>
                  <div className={`font-mono text-[0.52rem] px-1.5 py-0.5 rounded border mt-0.5 inline-block ${PLATFORM_COLORS[t.platform]}`}>
                    {t.platform}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Platform trust row */}
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { label: "Upwork", detail: "Top-Rated Profile", icon: "⭐", color: "#00f5d4" },
            { label: "Fiverr", detail: "Level 2 Seller", icon: "🏆", color: "#7b61ff" },
            { label: "Direct Clients", detail: "Repeat Business", icon: "🤝", color: "#ffbe0b" },
            { label: "Response Rate", detail: "100% Messages Answered", icon: "💬", color: "#39ff14" },
          ].map(p => (
            <div key={p.label} className="card-base px-5 py-4 flex items-center gap-3">
              <span className="text-xl">{p.icon}</span>
              <div>
                <div className="text-white text-sm font-semibold">{p.label}</div>
                <div className="font-mono text-[0.55rem] uppercase tracking-widest mt-0.5"
                  style={{ color: p.color }}>{p.detail}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Real reviews CTA */}
        <div className="mt-8 text-center">
          <p className="text-gray-700 font-mono text-xs">
            // Placeholders shown above — real reviews will be visible once added via Admin Panel → Testimonials
          </p>
        </div>
      </div>
    </section>
  );
}
