"use client";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Client Name",
    role: "Game Studio Owner",
    platform: "Upwork",
    rating: 5,
    text: "Delivered a complete multiplayer system for our mobile game in record time. The code quality was exceptional — clean, documented, and easy to extend. Our player retention doubled after launch.",
    avatar: "CS",
    accentColor: "#00f5d4",
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
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-28 bg-bg-secondary relative overflow-hidden">
      <div className="absolute inset-0 grid-bg-sm opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="section-label justify-center">// Testimonials</div>
          <h2 className="section-heading text-[clamp(2.5rem,5vw,4rem)] text-white mb-4">
            What Clients Say
          </h2>
          <p className="text-gray-500 font-light max-w-md mx-auto text-[1.02rem]">
            Honest feedback from real clients across Upwork, Fiverr, and direct engagements.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div key={t.id} className="card-base p-6 flex flex-col gap-4 relative overflow-hidden group">
              {/* Top accent */}
              <div
                className="absolute top-0 left-0 right-0 h-[1px]"
                style={{ background: `linear-gradient(90deg, transparent, ${t.accentColor}60, transparent)` }}
              />

              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={12} className="fill-accent-amber text-accent-amber" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-400 font-light text-sm leading-relaxed flex-1 italic">
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.04]">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-heading text-sm flex-shrink-0"
                  style={{ background: `${t.accentColor}20`, color: t.accentColor, border: `1px solid ${t.accentColor}30` }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-white text-sm font-medium">{t.name}</div>
                  <div className="font-mono text-[0.58rem] text-gray-600 uppercase tracking-wide">
                    {t.role} · {t.platform}
                  </div>
                </div>
              </div>

              {/* Placeholder notice */}
              <div className="absolute bottom-3 right-3">
                <span className="font-mono text-[0.5rem] text-gray-800 uppercase tracking-widest">
                  Placeholder
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Platform badges */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {[
            { label: "Upwork", detail: "Top-Rated Profile" },
            { label: "Fiverr", detail: "Level 2 Seller" },
            { label: "Direct Clients", detail: "Repeat Business" },
          ].map((p) => (
            <div key={p.label} className="card-base px-5 py-3 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-accent-green" />
              <div>
                <div className="font-body font-semibold text-white text-sm">{p.label}</div>
                <div className="font-mono text-[0.55rem] text-gray-600 uppercase tracking-wide">{p.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
