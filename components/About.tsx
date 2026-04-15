"use client";
import { Shield, Zap, Code2, Users } from "lucide-react";

const values = [
  {
    icon: <Code2 size={16} />,
    title: "Clean Architecture",
    desc: "Every system is built for maintainability — Scriptable Objects, manager patterns, and modular design from day one.",
  },
  {
    icon: <Zap size={16} />,
    title: "Performance First",
    desc: "Object pooling, GC optimization, and profiling-driven development. Your game runs smooth on real player devices.",
  },
  {
    icon: <Users size={16} />,
    title: "Client Partnership",
    desc: "I treat your project like my own. Clear communication, realistic timelines, and zero surprise scope changes.",
  },
  {
    icon: <Shield size={16} />,
    title: "Production-Ready",
    desc: "Games that are ready to ship — tested, stable, and built to scale as your player base grows.",
  },
];

export default function About() {
  return (
    <section id="about" className="py-28 bg-bg-secondary relative overflow-hidden">
      {/* Subtle grid */}
      <div className="absolute inset-0 grid-bg-sm opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT — Terminal Card */}
          <div className="relative">
            {/* Corner accent */}
            <div className="absolute -top-3 -left-3 w-12 h-12 border-t-2 border-l-2 border-accent-cyan opacity-40" />
            <div className="absolute -bottom-3 -right-3 w-12 h-12 border-b-2 border-r-2 border-accent-cyan opacity-40" />

            <div className="card-base p-0 overflow-hidden">
              {/* Terminal header */}
              <div className="bg-bg-hover px-5 py-3 border-b border-white/[0.04] flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
                  <span className="w-3 h-3 rounded-full" style={{ background: "#ffbd2e" }} />
                  <span className="w-3 h-3 rounded-full" style={{ background: "#28ca42" }} />
                </div>
                <span className="font-mono text-[0.6rem] text-gray-600">developer_profile.json</span>
              </div>

              <div className="p-6 font-mono text-sm leading-8">
                <div className="text-gray-600">{"{"}</div>

                <div className="pl-4">
                  <span className="text-purple-400">"name"</span>
                  <span className="text-gray-500">: </span>
                  <span className="text-accent-green">"Unity Game Developer"</span>
                  <span className="text-gray-600">,</span>
                </div>

                <div className="pl-4">
                  <span className="text-purple-400">"role"</span>
                  <span className="text-gray-500">: </span>
                  <span className="text-accent-green">"Freelance • Remote-Ready"</span>
                  <span className="text-gray-600">,</span>
                </div>

                <div className="pl-4">
                  <span className="text-purple-400">"specialization"</span>
                  <span className="text-gray-500">: [</span>
                </div>
                {["Gameplay Systems", "Multiplayer (Photon PUN)", "Mobile Games", "UI/UX Implementation"].map((s, i, arr) => (
                  <div key={s} className="pl-8">
                    <span className="text-accent-cyan">"{s}"</span>
                    {i < arr.length - 1 && <span className="text-gray-600">,</span>}
                  </div>
                ))}
                <div className="pl-4 text-gray-500">],</div>

                <div className="pl-4">
                  <span className="text-purple-400">"platforms"</span>
                  <span className="text-gray-500">: </span>
                  <span className="text-accent-green">"Upwork · Fiverr · Direct"</span>
                  <span className="text-gray-600">,</span>
                </div>

                <div className="pl-4">
                  <span className="text-purple-400">"available"</span>
                  <span className="text-gray-500">: </span>
                  <span className="text-accent-green">true</span>
                </div>

                <div className="text-gray-600">{"}"}</div>
              </div>
            </div>

            {/* Metrics below card */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { num: "3+", desc: "Years Unity Dev" },
                { num: "20+", desc: "Games Shipped" },
                { num: "5★", desc: "Client Rating" },
              ].map((m) => (
                <div key={m.desc} className="card-base p-4 text-center">
                  <div className="font-heading text-3xl text-accent-cyan text-glow-cyan">{m.num}</div>
                  <div className="font-mono text-[0.58rem] text-gray-600 uppercase tracking-widest mt-1">{m.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Copy */}
          <div>
            <div className="section-label">// About</div>
            <h2 className="section-heading text-[clamp(2.5rem,5vw,4rem)] text-white mb-6">
              Turning Game Ideas Into Polished Reality
            </h2>

            <div className="space-y-4 text-gray-400 font-light leading-relaxed text-[1.02rem] mb-10">
              <p>
                I am a Unity Game Developer focused on building{" "}
                <span className="text-white font-normal">high-quality gameplay systems</span> and engaging
                player experiences that keep users coming back.
              </p>
              <p>
                Working across freelance platforms like Upwork and Fiverr, I've delivered complete game
                systems — UI, core mechanics, and real-time multiplayer features using{" "}
                <span className="text-accent-cyan font-normal">Photon PUN</span> — for clients across multiple
                countries and genres.
              </p>
              <p>
                My strength lies in turning raw ideas into{" "}
                <span className="text-white font-normal">fully functional, release-ready games</span>. I focus on
                performance, scalability, and clean architecture so your project can grow without technical debt
                slowing it down.
              </p>
              <p>
                Whether it's a tight hyper-casual build, a deep idle RPG, or a complex multiplayer arena —
                I deliver results that satisfy both <span className="text-white font-normal">player expectations</span> and{" "}
                <span className="text-white font-normal">business goals</span>.
              </p>
            </div>

            {/* Value props */}
            <div className="grid grid-cols-2 gap-4">
              {values.map((v) => (
                <div key={v.title} className="card-base p-4 group">
                  <div className="text-accent-cyan mb-2 group-hover:scale-110 transition-transform inline-block">
                    {v.icon}
                  </div>
                  <div className="font-body font-semibold text-white text-sm mb-1">{v.title}</div>
                  <div className="font-light text-gray-500 text-xs leading-relaxed">{v.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
