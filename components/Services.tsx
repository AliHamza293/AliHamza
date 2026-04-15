"use client";
import { CheckCircle2, ArrowRight } from "lucide-react";

const services = [
  {
    id: "01",
    title: "Full Game Development",
    tagline: "Idea → Shipped Product",
    desc: "From game design document to playable, polished game ready for release. I handle mechanics, UI, audio hookups, and final build delivery.",
    deliverables: [
      "Complete Unity project with clean source",
      "Polished UI and HUD systems",
      "Core game loop and all mechanics",
      "Platform build (Android / iOS / PC)",
      "30-day bug support post-delivery",
    ],
    accent: "#00f5d4",
    highlight: true,
  },
  {
    id: "02",
    title: "Multiplayer Integration",
    tagline: "Add Real-Time Players to Your Game",
    desc: "Retrofit or build from scratch — lobby systems, room management, player sync, and matchmaking using Photon PUN 2.",
    deliverables: [
      "Photon PUN 2 full integration",
      "Lobby & room management systems",
      "Real-time player sync & RPCs",
      "Disconnect handling & reconnection",
      "Scalability testing up to 20 players",
    ],
    accent: "#7b61ff",
    highlight: false,
  },
  {
    id: "03",
    title: "Gameplay Systems Dev",
    tagline: "The Mechanics Players Remember",
    desc: "Purpose-built gameplay systems — combat, progression, economy, AI behaviours — designed for extensibility and clean code.",
    deliverables: [
      "Core mechanic implementation",
      "Progression & upgrade systems",
      "Inventory or economy systems",
      "Scriptable Object-based data layer",
      "Full documentation & comments",
    ],
    accent: "#ffbe0b",
    highlight: false,
  },
  {
    id: "04",
    title: "Bug Fixing & Optimization",
    tagline: "Make It Run Smooth",
    desc: "Performance audits, memory leak hunting, physics fixes, and frame-rate optimization. Bring your struggling project back to life.",
    deliverables: [
      "Unity Profiler deep-dive analysis",
      "Object pooling implementation",
      "Draw call & batching optimization",
      "GC allocation elimination",
      "Performance report with findings",
    ],
    accent: "#ff2d55",
    highlight: false,
  },
];

export default function Services() {
  return (
    <section id="services" className="py-28 bg-bg-base relative overflow-hidden">
      <div className="absolute inset-0 grid-bg pointer-events-none" />

      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,245,212,0.025) 0%, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="section-label justify-center">// Services</div>
          <h2 className="section-heading text-[clamp(2.5rem,5vw,4rem)] text-white mb-4">
            What I Build For You
          </h2>
          <p className="text-gray-500 font-light max-w-xl mx-auto text-[1.02rem]">
            Structured services built around client outcomes — not just task lists. Every engagement
            has a clear scope, deliverable, and quality standard.
          </p>
        </div>

        {/* Service cards */}
        <div className="grid md:grid-cols-2 gap-5">
          {services.map((s) => (
            <div
              key={s.id}
              className={`card-base p-7 relative overflow-hidden group ${
                s.highlight ? "border-accent-cyan/20" : ""
              }`}
            >
              {/* Highlight tag */}
              {s.highlight && (
                <div
                  className="absolute top-4 right-4 font-mono text-[0.55rem] uppercase tracking-widest px-2 py-1 rounded"
                  style={{ background: "rgba(0,245,212,0.1)", color: "#00f5d4", border: "1px solid rgba(0,245,212,0.2)" }}
                >
                  Most Popular
                </div>
              )}

              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-[1px]"
                style={{ background: `linear-gradient(90deg, transparent, ${s.accent}80, transparent)` }}
              />

              {/* Number */}
              <div
                className="font-heading text-7xl leading-none mb-4 opacity-10 group-hover:opacity-20 transition-opacity select-none"
                style={{ color: s.accent }}
              >
                {s.id}
              </div>

              {/* Content */}
              <div className="mb-6">
                <div
                  className="font-mono text-[0.6rem] uppercase tracking-widest mb-2"
                  style={{ color: s.accent }}
                >
                  {s.tagline}
                </div>
                <h3 className="font-heading text-3xl text-white mb-3">{s.title}</h3>
                <p className="text-gray-500 font-light text-sm leading-relaxed">{s.desc}</p>
              </div>

              {/* Deliverables */}
              <ul className="space-y-2 mb-6">
                {s.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-2.5 text-[0.8rem] text-gray-400 font-light">
                    <CheckCircle2
                      size={12}
                      className="mt-0.5 flex-shrink-0"
                      style={{ color: s.accent }}
                    />
                    {d}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="#contact"
                className="inline-flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-widest transition-all group-hover:gap-3"
                style={{ color: s.accent }}
              >
                Get a Quote <ArrowRight size={12} />
              </a>
            </div>
          ))}
        </div>

        {/* Bottom CTA bar */}
        <div className="mt-10 rounded-xl p-8 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(0,245,212,0.05) 0%, rgba(123,97,255,0.05) 100%)", border: "1px solid rgba(0,245,212,0.1)" }}>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at center, rgba(0,245,212,0.04) 0%, transparent 70%)" }}
          />
          <h3 className="font-heading text-3xl text-white mb-2 relative z-10">
            Not Sure What You Need?
          </h3>
          <p className="text-gray-500 font-light mb-6 relative z-10">
            Tell me about your project and I'll recommend the right approach — no obligation.
          </p>
          <a href="#contact" className="btn-primary relative z-10">
            Let's Talk <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
