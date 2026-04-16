"use client";
import { useState } from "react";
import { CheckCircle, ArrowRight, Upload } from "lucide-react";

const capabilities = [
  "Multiplayer systems (Photon PUN – matchmaking, rooms, sync)",
  "Complete game logic (levels, timers, anti-cheat, progression)",
  "Economy systems (gems, rewards, purchases, balancing)",
  "UI/UX with smooth flow (menus → gameplay → results → rewards)",
  "Admin & backend-ready architecture",
  "Custom tools to speed up development",
];

const reasons = [
  { emoji: "🎯", title: "I don't leave projects half-done", desc: "Every project I take reaches a finished, launchable state. No abandoned codebases." },
  { emoji: "🏗️", title: "System architect, not just a coder", desc: "I think about how systems connect and scale — not just how to make the next feature work." },
  { emoji: "📈", title: "Scalable & easy to expand", desc: "Clean architecture means your game can grow. New features, new content — without rewriting everything." },
  { emoji: "🗣️", title: "Clear communication, real timelines", desc: "No fake promises. You know exactly what's happening, when it ships, and why." },
  { emoji: "💰", title: "Gameplay AND business mindset", desc: "I understand retention, monetization, and what makes players come back — not just code syntax." },
];

const deliverables = [
  "Turn your idea into a fully working product",
  "Handle complex systems without confusion",
  "Save you time, money, and headaches",
  "Deliver something you can actually launch and grow",
];

// Default avatar placeholder with initials
function AvatarPlaceholder({ src }: { src?: string }) {
  const [imgError, setImgError] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);

  // If no src or error, show initials
  if (!imgSrc || imgError) {
    return (
      <div className="w-full h-full flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, rgba(0,245,212,0.15), rgba(123,97,255,0.15))" }}>
        <div className="text-center">
          <div className="font-heading text-[5rem] leading-none text-accent-cyan opacity-80 mb-2">AH</div>
          <div className="font-mono text-[0.6rem] text-gray-600 uppercase tracking-widest">Ali Hamza</div>
        </div>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt="Ali Hamza"
      className="w-full h-full object-cover object-top"
      onError={() => setImgError(true)}
    />
  );
}

export default function About() {
  // Replace PHOTO_URL below with your actual photo URL or base64 string
  // You can also upload your photo via the admin panel and paste the URL here
  const PHOTO_URL = "AliHamza.png"; // ← paste your photo URL here e.g. "/ali.jpg" or a full https URL

  return (
    <section id="about" className="py-0 bg-bg-secondary relative overflow-hidden">
      <div className="absolute inset-0 grid-bg-sm opacity-40 pointer-events-none" />

      {/* ── HERO INTRO STRIP ─────────────────────────────────────────────── */}
      <div className="relative py-24 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-[1fr_380px] gap-12 items-center">

            {/* Text side */}
            <div>
              <div className="section-label mb-6">// About Me</div>

              {/* Big opener */}
              <div className="mb-8">
                <p className="text-gray-300 text-xl md:text-2xl font-light leading-relaxed mb-6 max-w-2xl">
                  If you're looking for a Unity developer who can actually{" "}
                  <span className="text-white font-semibold">finish your game properly</span>{" "}
                  <span className="text-gray-500">(not just start it)</span> — you're in the right place.
                </p>

                <h2 className="section-heading text-[clamp(2.5rem,4.5vw,3.8rem)] text-white mb-2 leading-none">
                  I'm <span className="gradient-text">Ali Hamza</span>
                </h2>
                <p className="font-mono text-[0.7rem] text-accent-cyan uppercase tracking-widest mb-6">
                  Unity Game Developer · Systems Architect · Freelance
                </p>

                <p className="text-gray-400 font-light leading-relaxed text-lg mb-4">
                  I don't just build games… I build{" "}
                  <span className="text-white font-medium">complete, working systems</span> that are ready to launch and scale.
                </p>
                <p className="text-gray-500 font-light leading-relaxed">
                  Most developers can write code. Very few can deliver a full game loop + multiplayer + economy +
                  polished UX without breaking things.{" "}
                  <span className="text-white font-medium">That's where I stand out.</span>
                </p>
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap gap-8 pt-6 border-t border-white/[0.05]">
                {[
                  { num: "3+", label: "Years in Unity" },
                  { num: "20+", label: "Projects Shipped" },
                  { num: "5★", label: "Client Rating" },
                  { num: "100%", label: "Completion Rate" },
                ].map(s => (
                  <div key={s.label}>
                    <div className="font-heading text-4xl text-accent-cyan text-glow-cyan leading-none">{s.num}</div>
                    <div className="font-mono text-[0.58rem] text-gray-600 uppercase tracking-widest mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo side */}
            <div className="relative flex-shrink-0">
              {/* Decorative corners */}
              <div className="absolute -top-3 -left-3 w-12 h-12 border-t-2 border-l-2 border-accent-cyan opacity-40 z-10" />
              <div className="absolute -bottom-3 -right-3 w-12 h-12 border-b-2 border-r-2 border-accent-cyan opacity-40 z-10" />

              <div className="relative rounded-2xl overflow-hidden border border-white/[0.08]"
                style={{ height: "420px", background: "#0e1419" }}>
                <AvatarPlaceholder src={PHOTO_URL} />

                {/* Gradient overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-24"
                  style={{ background: "linear-gradient(to top, #0a0e12, transparent)" }} />

                {/* Name badge */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-bg-base/80 backdrop-blur border border-white/[0.08] rounded-xl px-4 py-3">
                    <div className="font-heading text-xl text-white">Ali Hamza</div>
                    <div className="font-mono text-[0.58rem] text-accent-cyan uppercase tracking-widest">
                      Unity Developer · Available Now
                    </div>
                  </div>
                </div>

                {/* Available badge */}
                <div className="absolute top-4 right-4">
                  <div className="status-badge">
                    <div className="status-dot" />
                    Available
                  </div>
                </div>
              </div>

              {/* Photo instructions */}
              <p className="text-center font-mono text-[0.55rem] text-gray-800 mt-3 uppercase tracking-widest">
                // Replace PHOTO_URL in About.tsx with your photo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── WHAT I CAN DO ─────────────────────────────────────────────────── */}
      <div className="py-20 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-[400px_1fr] gap-12 items-start">
            <div>
              <div className="section-label">// What I Can Do For You</div>
              <h3 className="section-heading text-[clamp(2rem,4vw,3.2rem)] text-white mb-4">
                Production-Ready
                <span className="block gradient-text">Unity Systems</span>
              </h3>
              <p className="text-gray-500 font-light leading-relaxed">
                I specialize in building the systems that make games feel complete, scalable,
                and actually fun to play — not just technically functional.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {capabilities.map((cap, i) => (
                <div key={i} className="card-base p-4 flex items-start gap-3 group">
                  <CheckCircle size={14} className="text-accent-green mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-300 text-sm font-light leading-relaxed">{cap}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── WHY CLIENTS CHOOSE ME ─────────────────────────────────────────── */}
      <div className="py-20 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <div className="section-label justify-center">// Why Clients Choose Me</div>
            <h3 className="section-heading text-[clamp(2rem,4vw,3.2rem)] text-white">
              Not Just Another Developer
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {reasons.map((r, i) => (
              <div key={i} className="card-base p-6 group relative overflow-hidden">
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: "radial-gradient(circle at 50% 0%, rgba(0,245,212,0.04), transparent 70%)" }} />
                <div className="absolute top-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(0,245,212,0.4), transparent)" }} />

                <div className="text-3xl mb-3">{r.emoji}</div>
                <h4 className="font-body font-semibold text-white text-sm mb-2">{r.title}</h4>
                <p className="text-gray-500 text-xs font-light leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── WHAT YOU'LL GET ───────────────────────────────────────────────── */}
      <div className="py-20 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="section-label">// What You'll Get</div>
              <h3 className="section-heading text-[clamp(2rem,4vw,3.2rem)] text-white mb-4">
                You're Not Hiring a Freelancer
                <span className="block text-gray-600 text-[60%] mt-1 font-heading">You're Getting a Game Partner</span>
              </h3>
              <p className="text-gray-500 font-light leading-relaxed mb-6">
                When you work with me, you get someone who understands the full picture —
                from code architecture to player experience to business outcomes.
              </p>
              <a href="#contact" className="btn-primary inline-flex">
                Start a Conversation <ArrowRight size={14} />
              </a>
            </div>

            <div className="space-y-3">
              {deliverables.map((d, i) => (
                <div key={i} className="card-base p-5 flex items-center gap-4 group">
                  <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center flex-shrink-0 font-heading text-accent-cyan text-sm group-hover:bg-accent-cyan/20 transition-colors">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-accent-cyan text-sm">👉</span>
                    <span className="text-gray-300 text-sm font-light">{d}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA BANNER ────────────────────────────────────────────────────── */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="rounded-2xl p-8 md:p-12 text-center relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(0,245,212,0.05), rgba(123,97,255,0.05))", border: "1px solid rgba(0,245,212,0.1)" }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at center, rgba(0,245,212,0.04), transparent 70%)" }} />

            <div className="relative z-10">
              <div className="font-mono text-xs text-accent-cyan uppercase tracking-widest mb-4">// Is Your Project...</div>

              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {["Stuck", "Half-built", "Too complex for your current developer", "Or you just want it done RIGHT"].map(label => (
                  <span key={label} className="bg-bg-base/60 border border-white/[0.08] text-gray-400 px-4 py-2 rounded-lg text-sm font-light">
                    {label}
                  </span>
                ))}
              </div>

              <h3 className="section-heading text-[clamp(2rem,4vw,3rem)] text-white mb-3">
                Send Me a Message
              </h3>
              <p className="text-gray-500 font-light mb-6 max-w-md mx-auto">
                I'll break it down and give you a clear plan — no fluff, no pressure.
              </p>
              <a href="#contact" className="btn-primary inline-flex text-sm">
                Let's Talk <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
