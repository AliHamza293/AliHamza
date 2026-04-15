// lib/store.ts
// ─────────────────────────────────────────────────────────────────────────────
// Persistent JSON store — works on Vercel with the /tmp directory for runtime
// writes, and falls back to bundled seed data on cold starts.
// For true persistence across Vercel deployments use a DB (see README).
// ─────────────────────────────────────────────────────────────────────────────
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// ── Types ────────────────────────────────────────────────────────────────────

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
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;           // HTML/markdown body
  coverImage: string;        // URL
  tags: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
  views: number;
}

export interface Comment {
  id: string;
  postId: string;
  name: string;
  email: string;
  message: string;
  approved: boolean;
  createdAt: string;
}

export interface StoreData {
  projects: Project[];
  posts: Post[];
  comments: Comment[];
}

// ── Seed data ────────────────────────────────────────────────────────────────

const SEED: StoreData = {
  projects: [
    {
      id: "proj-01",
      title: "Multiplayer Battle Arena",
      genre: "Multiplayer / Action",
      shortDesc: "A fast-paced real-time multiplayer arena built with Photon PUN. Players compete in dynamic 4v4 matches with ranked matchmaking and live leaderboards.",
      detailedDesc: "End-to-end multiplayer architecture using Photon PUN 2. The game features a complete lobby system, room creation and joining, synchronized player movement, projectile replication, and a custom event system for game state management. Designed for mobile-first with a tight netcode loop.",
      features: ["Real-time 4v4 multiplayer with Photon PUN 2","Custom lobby & matchmaking system","Synchronized character movement and combat","Room lifecycle management","Live leaderboard and score tracking","Reconnection handling and disconnect recovery"],
      techStack: ["Unity 2022","Photon PUN 2","C#","Scriptable Objects","Android / iOS"],
      highlights: ["Sub-80ms average latency across mobile networks","Handles up to 20 concurrent players per room","Zero physics desync via server-authoritative validation"],
      mediaType: "none", mediaUrl: "", status: "completed",
      platform: ["Android","iOS"], order: 1,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
    {
      id: "proj-02",
      title: "Idle RPG: Kingdom Builder",
      genre: "Mobile / Idle RPG",
      shortDesc: "A feature-rich idle RPG for mobile with deep progression systems, hero management, and a fully automated resource economy built in Unity 2D.",
      detailedDesc: "Complete idle gameplay loop — resource generation, hero recruitment, upgrade systems, and prestige mechanics — all built around a data-driven architecture using Scriptable Objects. Save system uses JSON serialization with cloud backup.",
      features: ["Full idle economy: gold, XP, resource auto-generation","Hero recruitment, leveling, and equipment systems","Prestige system with permanent progression bonuses","Daily quests, achievements, and event campaigns","Cloud save with offline progress calculation"],
      techStack: ["Unity 2021","C#","Scriptable Objects","DOTween","Firebase Analytics"],
      highlights: ["Data-driven architecture: zero hard-coded balance values","Offline progression calculated accurately on re-launch","45fps sustained on mid-range Android devices"],
      mediaType: "none", mediaUrl: "", status: "completed",
      platform: ["Android","iOS"], order: 2,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
    {
      id: "proj-03",
      title: "Hyper-Casual Puzzle Runner",
      genre: "Hyper-Casual / Puzzle",
      shortDesc: "A viral-style hyper-casual game built for rapid monetization with clean mechanics, addictive progression, and sub-2-second load times.",
      detailedDesc: "Runner-puzzle hybrid with procedurally generated levels, custom object pooling, and SDK-integrated ad framework. Delivered in under 3 weeks as a freelance engagement.",
      features: ["Procedurally generated level sequences","Custom object pooling for zero-GC gameplay","Integrated rewarded and interstitial ads (AdMob)","Haptic feedback and screen-shake juice system","One-tap controls optimized for mobile UX"],
      techStack: ["Unity 2022","C#","AdMob SDK","DOTween","Android"],
      highlights: ["1.8s cold-launch time on Android","Delivered full project in 18 days","Object pool eliminates all runtime allocation spikes"],
      mediaType: "none", mediaUrl: "", status: "completed",
      platform: ["Android"], order: 3,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
  ],
  posts: [
    {
      id: "post-01",
      slug: "how-i-built-multiplayer-in-unity",
      title: "How I Built Real-Time Multiplayer in Unity Using Photon PUN 2",
      excerpt: "A deep dive into building a production-ready multiplayer system — lobby architecture, player sync, and the mistakes I made so you don't have to.",
      content: `<h2>Introduction</h2><p>Building multiplayer games is one of the most challenging and rewarding things you can do as a Unity developer. After shipping several multiplayer projects, I've learned what works and what absolutely doesn't.</p><h2>The Architecture</h2><p>The key to a solid multiplayer game is treating your architecture as server-authoritative from day one. Even with Photon PUN's peer-to-peer model, you need one client acting as the master.</p><h2>Lobby System</h2><p>I start every multiplayer project with the lobby. Get this right and everything else falls into place. The lobby needs to handle: room creation, room listing with filters, joining by code, and graceful disconnection.</p><h2>Player Sync</h2><p>For movement sync, I use a combination of PhotonTransformView for position and a custom RPC system for game events. The trick is to interpolate positions client-side to hide latency.</p><h2>Lessons Learned</h2><p>Never trust the client. Always validate important game events on the master client. And test on real mobile networks from day one — WiFi in your office lies to you.</p>`,
      coverImage: "",
      tags: ["Unity", "Photon PUN", "Multiplayer", "C#", "Game Dev"],
      published: true,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      views: 0,
    },
    {
      id: "post-02",
      slug: "scriptable-objects-architecture-unity",
      title: "Why Scriptable Objects Changed How I Build Unity Games Forever",
      excerpt: "Stop hard-coding game data. Here's the Scriptable Object architecture I use on every project that makes balancing, extending, and testing 10x easier.",
      content: `<h2>The Problem With Hard-Coded Data</h2><p>Every junior Unity developer does it — magic numbers scattered across MonoBehaviours, balance values buried in prefabs, game data that requires a code change to update. I did it too, until I discovered Scriptable Objects properly.</p><h2>What Are Scriptable Objects?</h2><p>ScriptableObjects are data containers that live as assets in your project. They're not attached to GameObjects. They persist between scenes. They're serialized by Unity. And they're incredibly powerful when used as the backbone of your game's data layer.</p><h2>My Architecture</h2><p>I create a SO for every type of data: EnemyData, WeaponData, LevelConfig, PlayerStats. Each one is a clean C# class inheriting from ScriptableObject with only data fields — no logic.</p><h2>The Result</h2><p>Designers can tweak numbers without touching code. You can have 50 enemy variants from one class. Unit testing becomes trivial. And your game is infinitely more extensible.</p>`,
      coverImage: "",
      tags: ["Unity", "Scriptable Objects", "Architecture", "C#", "Best Practices"],
      published: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      views: 0,
    },
  ],
  comments: [],
};

// ── File path ────────────────────────────────────────────────────────────────

function getStorePath(): string {
  // In production (Vercel), write to /tmp which is writable
  // In development, write next to this file
  if (process.env.NODE_ENV === "production") {
    return "/tmp/portfolio-store.json";
  }
  return path.join(process.cwd(), "data", "store.json");
}

// ── Read / Write ─────────────────────────────────────────────────────────────

function readStore(): StoreData {
  const filePath = getStorePath();
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(raw) as StoreData;
    }
  } catch {
    // fall through to seed
  }
  // First run — write seed data
  writeStore(SEED);
  return SEED;
}

function writeStore(data: StoreData): void {
  const filePath = getStorePath();
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// ── Projects CRUD ────────────────────────────────────────────────────────────

export function getProjects(): Project[] {
  return readStore().projects.sort((a, b) => a.order - b.order);
}

export function getProject(id: string): Project | undefined {
  return readStore().projects.find((p) => p.id === id);
}

export function createProject(data: Omit<Project, "id" | "createdAt" | "updatedAt">): Project {
  const store = readStore();
  const project: Project = {
    ...data,
    id: `proj-${uuidv4().slice(0, 8)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.projects.push(project);
  writeStore(store);
  return project;
}

export function updateProject(id: string, data: Partial<Project>): Project | null {
  const store = readStore();
  const idx = store.projects.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  store.projects[idx] = { ...store.projects[idx], ...data, updatedAt: new Date().toISOString() };
  writeStore(store);
  return store.projects[idx];
}

export function deleteProject(id: string): boolean {
  const store = readStore();
  const before = store.projects.length;
  store.projects = store.projects.filter((p) => p.id !== id);
  writeStore(store);
  return store.projects.length < before;
}

// ── Posts CRUD ───────────────────────────────────────────────────────────────

export function getPosts(publishedOnly = false): Post[] {
  const posts = readStore().posts;
  return (publishedOnly ? posts.filter((p) => p.published) : posts)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getPost(slug: string): Post | undefined {
  return readStore().posts.find((p) => p.slug === slug);
}

export function getPostById(id: string): Post | undefined {
  return readStore().posts.find((p) => p.id === id);
}

export function createPost(data: Omit<Post, "id" | "createdAt" | "updatedAt" | "views">): Post {
  const store = readStore();
  const post: Post = {
    ...data,
    id: `post-${uuidv4().slice(0, 8)}`,
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.posts.push(post);
  writeStore(store);
  return post;
}

export function updatePost(id: string, data: Partial<Post>): Post | null {
  const store = readStore();
  const idx = store.posts.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  store.posts[idx] = { ...store.posts[idx], ...data, updatedAt: new Date().toISOString() };
  writeStore(store);
  return store.posts[idx];
}

export function deletePost(id: string): boolean {
  const store = readStore();
  const before = store.posts.length;
  store.posts = store.posts.filter((p) => p.id !== id);
  // Also delete associated comments
  store.comments = store.comments.filter((c) => c.postId !== id);
  writeStore(store);
  return store.posts.length < before;
}

export function incrementViews(slug: string): void {
  const store = readStore();
  const idx = store.posts.findIndex((p) => p.slug === slug);
  if (idx !== -1) {
    store.posts[idx].views += 1;
    writeStore(store);
  }
}

// ── Comments CRUD ────────────────────────────────────────────────────────────

export function getComments(postId: string, approvedOnly = true): Comment[] {
  const store = readStore();
  return store.comments
    .filter((c) => c.postId === postId && (approvedOnly ? c.approved : true))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getAllComments(): Comment[] {
  return readStore().comments.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function createComment(data: Omit<Comment, "id" | "createdAt" | "approved">): Comment {
  const store = readStore();
  const comment: Comment = {
    ...data,
    id: `cmt-${uuidv4().slice(0, 8)}`,
    approved: false, // requires admin approval
    createdAt: new Date().toISOString(),
  };
  store.comments.push(comment);
  writeStore(store);
  return comment;
}

export function approveComment(id: string): boolean {
  const store = readStore();
  const idx = store.comments.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  store.comments[idx].approved = true;
  writeStore(store);
  return true;
}

export function deleteComment(id: string): boolean {
  const store = readStore();
  const before = store.comments.length;
  store.comments = store.comments.filter((c) => c.id !== id);
  writeStore(store);
  return store.comments.length < before;
}
