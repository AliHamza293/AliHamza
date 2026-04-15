"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ExternalLink, ChevronDown } from "lucide-react";

const codeLines = [
  { indent: 0, text: "public class GameManager : MonoBehaviour {", color: "text-accent-cyan" },
  { indent: 1, text: "// Multiplayer session orchestrator", color: "text-gray-600" },
  { indent: 1, text: "[SerializeField] PhotonView photonView;", color: "text-purple-400" },
  { indent: 1, text: "void Start() {", color: "text-yellow-300" },
  { indent: 2, text: 'PhotonNetwork.ConnectUsingSettings();', color: "text-gray-300" },
  { indent: 2, text: "InitializeSystems();", color: "text-yellow-300" },
  { indent: 1, text: "}", color: "text-yellow-300" },
  { indent: 0, text: "", color: "" },
  { indent: 1, text: "void InitializeSystems() {", color: "text-yellow-300" },
  { indent: 2, text: "SpawnManager.Instance.Init();", color: "text-gray-300" },
  { indent: 2, text: "UIController.Boot(PlayerData);", color: "text-gray-300" },
  { indent: 2, text: 'Debug.Log("Systems Online ✓");', color: "text-green-400" },
  { indent: 1, text: "}", color: "text-yellow-300" },
  { indent: 0, text: "}", color: "text-accent-cyan" },
];

const stats = [
  { value: "3+", label: "Years in Unity" },
  { value: "20+", label: "Projects Shipped" },
  { value: "100%", label: "Client Satisfaction" },
  { value: "∞", label: "Coffee Consumed" },
];

const tickerItems = [
  "UNITY 2D/3D", "PHOTON PUN", "MOBILE GAMES",
  "MULTIPLAYER", "C# ARCHITECTURE", "GAME MECHANICS",
  "SCRIPTABLE OBJECTS", "GAMEPLAY SYSTEMS", "UI/UX POLISH",
  "UNITY 2D/3D", "PHOTON PUN", "MOBILE GAMES",
  "MULTIPLAYER", "C# ARCHITECTURE", "GAME MECHANICS",
  "SCRIPTABLE OBJECTS", "GAMEPLAY SYSTEMS", "UI/UX POLISH",
];

export default function Hero() {
  const [typedIndex, setTypedIndex] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    if (typedIndex < codeLines.length) {
      const timer = setTimeout(() => setTypedIndex((i) => i + 1), 110);
      return () => clearTimeout(timer);
    }
  }, [typedIndex]);

  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center pt-16 overflow-hidden grid-bg"
    >
      {/* Ambient orbs */}
      <div className="pointer-events-none">
        <div className="absolute top-[-10%] right-[5%] w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,245,212,0.06) 0%, transparent 70%)" }} />
        <div className="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(123,97,255,0.06) 0%, transparent 70%)" }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col lg:flex-row items-center gap-16 py-12">
        {/* LEFT — Copy */}
        <div className="flex-1 z-10" style={{ animationDelay: "0.1s" }}>
          {/* Status */}
          <div className="flex items-center gap-3 mb-8">
            <div className="status-badge">
              <div className="status-dot" />
              Available for Projects
            </div>
            <span className="font-mono text-[0.6rem] text-gray-600 uppercase tracking-widest">
              // freelance · remote
            </span>
          </div>

          {/* Headline */}
          <h1 className="section-heading text-[clamp(3rem,7vw,6rem)] mb-6 leading-none">
            <span className="block text-white">I Build</span>
            <span className="block gradient-text">Engaging Unity</span>
            <span className="block text-white">Games &amp;</span>
            <span className="block gradient-text">Multiplayer</span>
            <span className="block text-white">Systems</span>
            <span className="block" style={{ color: "#6b7280", fontSize: "55%" }}>
              That Players Love
            </span>
          </h1>

          {/* Sub */}
          <p className="text-gray-400 text-lg font-light max-w-xl leading-relaxed mb-8">
            Unity Game Developer specializing in{" "}
            <span className="text-accent-cyan">gameplay mechanics</span>,{" "}
            <span className="text-accent-cyan">multiplayer systems</span>, and polished mobile
            experiences. Helping clients turn ideas into high-quality games.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mb-12">
            <a href="#projects" className="btn-primary">
              View My Work <ArrowRight size={14} />
            </a>
            <a href="#contact" className="btn-outline">
              Hire Me <ExternalLink size={14} />
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 pt-8 border-t border-white/[0.05]">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-heading text-4xl text-accent-cyan text-glow-cyan leading-none mb-1">
                  {s.value}
                </div>
                <div className="font-mono text-[0.6rem] text-gray-600 uppercase tracking-widest leading-tight">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Code Panel */}
        <div className="flex-shrink-0 w-full max-w-md hero-code-panel z-10">
          <div className="card-base overflow-hidden glow-cyan">
            {/* Window bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-bg-hover border-b border-white/[0.04]">
              <span className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
              <span className="w-3 h-3 rounded-full" style={{ background: "#ffbd2e" }} />
              <span className="w-3 h-3 rounded-full" style={{ background: "#28ca42" }} />
              <span className="font-mono text-[0.6rem] text-gray-600 ml-2 tracking-wide">
                GameManager.cs — Unity
              </span>
              <div className="ml-auto flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-accent-green" />
                <span className="font-mono text-[0.55rem] text-accent-green">RUNNING</span>
              </div>
            </div>

            {/* Code */}
            <div className="p-5 font-mono text-[0.72rem] leading-7 min-h-[320px]">
              {/* Line numbers + code */}
              {codeLines.slice(0, typedIndex).map((line, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-gray-700 w-5 text-right flex-shrink-0 select-none">
                    {i + 1}
                  </span>
                  <span
                    className={line.color}
                    style={{ paddingLeft: `${line.indent * 14}px` }}
                  >
                    {line.text}
                  </span>
                </div>
              ))}
              {/* Cursor */}
              {typedIndex < codeLines.length && (
                <div className="flex gap-3">
                  <span className="text-gray-700 w-5 text-right">{typedIndex + 1}</span>
                  <span
                    className={`${cursorVisible ? "opacity-100" : "opacity-0"} text-accent-cyan`}
                  >
                    ▌
                  </span>
                </div>
              )}
            </div>

            {/* Footer bar */}
            <div className="px-4 py-2 bg-bg-hover border-t border-white/[0.04] flex items-center justify-between">
              <span className="font-mono text-[0.55rem] text-gray-600">C# · Unity 2022.3 LTS</span>
              <span className="font-mono text-[0.55rem] text-accent-green">0 errors · 0 warnings</span>
            </div>
          </div>

          {/* Floating badges */}
          <div className="flex gap-2 mt-4 flex-wrap">
            {["Photon PUN 2", "DOTween", "Scriptable Objects", "Firebase"].map((t) => (
              <span key={t} className="tag-pill">{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Ticker */}
      <div className="w-full border-t border-b border-white/[0.04] py-3 overflow-hidden mt-auto">
        <div className="ticker-wrap">
          <div className="ticker-inner">
            {tickerItems.map((item, i) => (
              <span key={i} className="font-mono text-[0.62rem] text-gray-700 tracking-widest uppercase px-8">
                {i % 3 === 0 ? (
                  <span className="text-accent-cyan opacity-60">{item}</span>
                ) : (
                  item
                )}
                <span className="text-gray-800 ml-8">◆</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-30">
        <span className="font-mono text-[0.55rem] text-gray-500 uppercase tracking-widest">Scroll</span>
        <ChevronDown size={14} className="text-gray-500 animate-bounce" />
      </div>
    </section>
  );
}
