export interface Project {
  id: string;
  title: string;
  genre: string;
  shortDesc: string;
  detailedDesc: string;
  features: string[];
  techStack: string[];
  highlights: string[];
  mediaType: "youtube" | "image" | "none";
  mediaUrl: string;
  status: "completed" | "in-progress";
  platform: string[];
  order: number;
}

export const projects: Project[] = [
  {
    id: "proj-01",
    title: "Multiplayer Battle Arena",
    genre: "Multiplayer / Action",
    shortDesc: "A fast-paced real-time multiplayer arena built with Photon PUN. Players compete in dynamic 4v4 matches with ranked matchmaking and live leaderboards.",
    detailedDesc: "This project demonstrates end-to-end multiplayer architecture using Photon PUN 2. The game features a complete lobby system, room creation and joining, synchronized player movement, projectile replication, and a custom event system for game state management.",
    features: [
      "Real-time 4v4 multiplayer with Photon PUN 2",
      "Custom lobby & matchmaking system",
      "Synchronized character movement and combat",
      "Room lifecycle management (create, join, spectate)",
      "Live leaderboard and score tracking",
      "Reconnection handling and disconnect recovery",
    ],
    techStack: ["Unity 2022", "Photon PUN 2", "C#", "Scriptable Objects", "Android / iOS"],
    highlights: [
      "Sub-80ms average latency across mobile networks",
      "Handles up to 20 concurrent players per room",
      "Zero physics desync via server-authoritative validation",
    ],
    mediaType: "none",
    mediaUrl: "",
    status: "completed",
    platform: ["Android", "iOS"],
    order: 1,
  },
  {
    id: "proj-02",
    title: "Idle RPG: Kingdom Builder",
    genre: "Mobile / Idle RPG",
    shortDesc: "A feature-rich idle RPG for mobile with deep progression systems, hero management, and a fully automated resource economy built in Unity 2D.",
    detailedDesc: "This mobile RPG delivers a complete idle gameplay loop — resource generation, hero recruitment, upgrade systems, and prestige mechanics — all built around a data-driven architecture using Scriptable Objects.",
    features: [
      "Full idle economy: gold, XP, and resource auto-generation",
      "Hero recruitment, leveling, and equipment systems",
      "Prestige system with permanent progression bonuses",
      "Daily quests, achievements, and event campaigns",
      "Fully animated UI with particle reward feedback",
      "Cloud save with offline progress calculation",
    ],
    techStack: ["Unity 2021", "C#", "Scriptable Objects", "DOTween", "Firebase Analytics"],
    highlights: [
      "Data-driven architecture: zero hard-coded balance values",
      "Offline progression calculated accurately on re-launch",
      "45fps sustained on mid-range Android devices",
    ],
    mediaType: "none",
    mediaUrl: "",
    status: "completed",
    platform: ["Android", "iOS"],
    order: 2,
  },
  {
    id: "proj-03",
    title: "Hyper-Casual Puzzle Runner",
    genre: "Hyper-Casual / Puzzle",
    shortDesc: "A viral-style hyper-casual game built for rapid monetization with clean mechanics, addictive progression, and sub-2-second load times.",
    detailedDesc: "Designed for the hyper-casual market, this runner-puzzle hybrid features procedurally generated levels, a custom object pooling system, and an SDK-integrated ad framework. Delivered in under 3 weeks.",
    features: [
      "Procedurally generated level sequences",
      "Custom object pooling for zero-GC gameplay",
      "Integrated rewarded and interstitial ads (AdMob)",
      "Haptic feedback and screen-shake juice system",
      "One-tap controls optimized for mobile UX",
    ],
    techStack: ["Unity 2022", "C#", "AdMob SDK", "DOTween", "Android"],
    highlights: [
      "1.8s cold-launch time on Android",
      "Delivered full project in 18 days",
      "Object pool eliminates all runtime allocation spikes",
    ],
    mediaType: "none",
    mediaUrl: "",
    status: "completed",
    platform: ["Android"],
    order: 3,
  },
];
