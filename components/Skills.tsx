"use client";
import { useEffect, useRef, useState } from "react";

const skillGroups = [
  {
    id: "game-dev",
    icon: "🎮",
    category: "Game Development",
    accent: "#00f5d4",
    skills: [
      { name: "Unity 2D/3D", level: 95 },
      { name: "Gameplay Systems", level: 92 },
      { name: "Game Mechanics Design", level: 90 },
      { name: "UI/UX Implementation", level: 85 },
    ],
    tags: ["Unity", "C#", "Physics", "Animation", "Particle Systems", "Shader Graph"],
  },
  {
    id: "multiplayer",
    icon: "🌐",
    category: "Multiplayer Systems",
    accent: "#7b61ff",
    skills: [
      { name: "Photon PUN 2", level: 90 },
      { name: "Lobby & Room Systems", level: 88 },
      { name: "Real-time State Sync", level: 85 },
      { name: "Player Management", level: 87 },
    ],
    tags: ["Photon PUN", "RPCs", "Matchmaking", "Sync", "Lag Comp", "Reconnection"],
  },
  {
    id: "tools",
    icon: "⚙️",
    category: "Tools & Architecture",
    accent: "#ffbe0b",
    skills: [
      { name: "Custom Unity Editor Tools", level: 82 },
      { name: "Scriptable Objects", level: 95 },
      { name: "Data Systems & Save", level: 88 },
      { name: "Performance Optimization", level: 85 },
    ],
    tags: ["Editor Scripting", "SO Architecture", "Object Pooling", "DOTween", "Firebase", "AdMob"],
  },
];

function SkillBar({ name, level, accent, animate }: {
  name: string; level: number; accent: string; animate: boolean;
}) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="font-mono text-[0.68rem] text-gray-300 tracking-wide">{name}</span>
        <span className="font-mono text-[0.6rem]" style={{ color: accent }}>{level}%</span>
      </div>
      <div className="h-[2px] bg-bg-hover rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: animate ? `${level}%` : "0%",
            background: `linear-gradient(90deg, ${accent}, ${accent}aa)`,
            boxShadow: `0 0 8px ${accent}60`,
            transitionDelay: "0.2s",
          }}
        />
      </div>
    </div>
  );
}

export default function Skills() {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills" className="py-28 bg-bg-base relative overflow-hidden">
      <div className="absolute inset-0 grid-bg pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10" ref={ref}>
        {/* Header */}
        <div className="text-center mb-16">
          <div className="section-label justify-center">// Skills & Expertise</div>
          <h2 className="section-heading text-[clamp(2.5rem,5vw,4rem)] text-white mb-4">
            The Toolkit That Ships Games
          </h2>
          <p className="text-gray-500 font-light max-w-xl mx-auto text-[1.02rem]">
            A battle-tested stack built from real project delivery — not tutorials. Every skill listed
            has been stress-tested in production.
          </p>
        </div>

        {/* Skill cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {skillGroups.map((group) => (
            <div
              key={group.id}
              className="card-base p-6 relative overflow-hidden group"
            >
              {/* Glow blob */}
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${group.accent}15 0%, transparent 70%)`,
                  filter: "blur(20px)",
                }}
              />

              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{group.icon}</span>
                <div>
                  <div className="font-body font-semibold text-white text-sm">{group.category}</div>
                  <div
                    className="font-mono text-[0.58rem] uppercase tracking-widest"
                    style={{ color: group.accent }}
                  >
                    {group.skills.length} Core Skills
                  </div>
                </div>
              </div>

              {/* Top border accent */}
              <div
                className="absolute top-0 left-0 right-0 h-[1px]"
                style={{ background: `linear-gradient(90deg, transparent, ${group.accent}60, transparent)` }}
              />

              {/* Skill bars */}
              <div className="mb-6">
                {group.skills.map((s) => (
                  <SkillBar
                    key={s.name}
                    name={s.name}
                    level={s.level}
                    accent={group.accent}
                    animate={animated}
                  />
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/[0.04]">
                {group.tags.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[0.58rem] px-2 py-1 rounded"
                    style={{
                      background: `${group.accent}0d`,
                      border: `1px solid ${group.accent}25`,
                      color: group.accent,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional tech row */}
        <div className="mt-8 card-base p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <span className="font-mono text-[0.65rem] text-gray-600 uppercase tracking-widest whitespace-nowrap">
              Also comfortable with
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                "Git & Version Control", "Agile Workflow", "Unity Analytics",
                "In-App Purchases", "DOTween Animations", "Android / iOS Build",
                "Unity Test Framework", "Addressables", "Localization",
              ].map((t) => (
                <span key={t} className="tag-pill-purple font-mono text-[0.6rem] px-2 py-1 rounded">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
