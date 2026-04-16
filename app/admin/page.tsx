"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  LogIn, LogOut, Plus, Pencil, Trash2, Eye, EyeOff,
  CheckCircle, XCircle, LayoutDashboard, FolderOpen,
  FileText, MessageSquare, Youtube, Upload, Save,
  ArrowLeft, X, ExternalLink, RefreshCw
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Project {
  id: string; title: string; genre: string; shortDesc: string;
  detailedDesc: string; features: string[]; techStack: string[];
  highlights: string[]; mediaType: "youtube" | "image" | "none";
  mediaUrl: string; status: "completed" | "in-progress";
  platform: string[]; order: number; createdAt: string; updatedAt: string;
}
interface Post {
  id: string; slug: string; title: string; excerpt: string;
  content: string; coverImage: string; tags: string[];
  published: boolean; createdAt: string; views: number;
}
interface Comment {
  id: string; postId: string; name: string; email: string;
  message: string; approved: boolean; createdAt: string;
}

// ─── Storage helpers ──────────────────────────────────────────────────────────
const SK = { projects: "pf_projects", posts: "pf_posts", comments: "pf_comments" };

function load<T>(key: string, fallback: T): T {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; }
  catch { return fallback; }
}
function save<T>(key: string, data: T) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}
function uid(p: string) { return `${p}-${Date.now()}-${Math.random().toString(36).slice(2,6)}`; }
function slugify(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim();
}

// ─── Seeds ───────────────────────────────────────────────────────────────────
const SEED_PROJECTS: Project[] = [
  { id:"proj-s1", title:"Multiplayer Battle Arena", genre:"Multiplayer / Action",
    shortDesc:"Fast-paced real-time 4v4 arena built with Photon PUN 2 featuring ranked matchmaking and live leaderboards.",
    detailedDesc:"End-to-end multiplayer with Photon PUN 2: lobby, room management, synchronized movement, projectile replication, and custom event system.",
    features:["Real-time 4v4 multiplayer","Custom lobby & matchmaking","Synchronized combat","Live leaderboards","Reconnection handling"],
    techStack:["Unity 2022","Photon PUN 2","C#","Scriptable Objects","Android/iOS"],
    highlights:["Sub-80ms latency","20 players per room","Zero physics desync"],
    mediaType:"none", mediaUrl:"", status:"completed", platform:["Android","iOS"], order:1,
    createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() },
  { id:"proj-s2", title:"Idle RPG: Kingdom Builder", genre:"Mobile / Idle RPG",
    shortDesc:"Feature-rich idle RPG with deep progression systems and automated resource economy built in Unity 2D.",
    detailedDesc:"Complete idle loop with resource generation, hero recruitment, prestige mechanics, and Scriptable Object data architecture.",
    features:["Full idle economy","Hero recruitment & leveling","Prestige system","Daily quests","Cloud save"],
    techStack:["Unity 2021","C#","Scriptable Objects","DOTween","Firebase"],
    highlights:["Data-driven architecture","Offline progress calculation","45fps on mid-range Android"],
    mediaType:"none", mediaUrl:"", status:"completed", platform:["Android","iOS"], order:2,
    createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() },
];

const SEED_POSTS: Post[] = [
  { id:"post-s1", slug:"how-i-built-multiplayer-unity",
    title:"How I Built Real-Time Multiplayer in Unity Using Photon PUN 2",
    excerpt:"A deep dive into production-ready multiplayer architecture — lobby systems, player sync, and lessons learned the hard way.",
    content:`<h2>Introduction</h2><p>Building multiplayer is one of the most challenging things you can do in Unity. Here's what I learned shipping several projects.</p><h2>Architecture</h2><p>Treat your system as server-authoritative from day one. Even with Photon PUN's P2P model, designate one master client for authority.</p><h2>Lobby System</h2><p>Start here. Room creation, listing with filters, joining by code, and graceful disconnection must all work perfectly before you touch gameplay.</p><h2>Lessons Learned</h2><p>Never trust the client. Validate all important events on master. Test on real mobile networks — office WiFi lies to you.</p>`,
    coverImage:"", tags:["Unity","Photon PUN","Multiplayer","C#"],
    published:true, createdAt:new Date(Date.now()-7*86400000).toISOString(), views:0 },
];

// ─── Small components ─────────────────────────────────────────────────────────
function Tag({ label, onRemove }: { label: string; onRemove?: ()=>void }) {
  return (
    <span className="inline-flex items-center gap-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono px-2 py-0.5 rounded">
      {label}
      {onRemove && <button type="button" onClick={onRemove} className="hover:text-red-400 ml-0.5"><X size={9}/></button>}
    </span>
  );
}

function Inp({ label, ...p }: { label:string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">{label}</label>
      <input {...p} className="w-full bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-cyan-500/50 placeholder-gray-700 transition-colors"/>
    </div>
  );
}

function Txa({ label, ...p }: { label:string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">{label}</label>
      <textarea {...p} className="w-full bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-cyan-500/50 placeholder-gray-700 resize-none transition-colors"/>
    </div>
  );
}

// ─── File Uploader ────────────────────────────────────────────────────────────
function FileUploader({ value, onChange, accept="image/*", label="Upload Image" }:
  { value:string; onChange:(v:string)=>void; accept?:string; label?:string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);

  function process(file: File) {
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) { alert("File too large. Max 15MB."); return; }
    setBusy(true);
    const reader = new FileReader();
    reader.onload = e => { onChange(e.target?.result as string); setBusy(false); };
    reader.readAsDataURL(file);
  }

  const isBase64 = value.startsWith("data:");
  const ytMatch = !isBase64 && value ? value.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/) : null;
  const ytId = ytMatch ? ytMatch[1] : null;

  return (
    <div className="space-y-2">
      <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest">{label}</label>

      <div
        onClick={() => ref.current?.click()}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if(f) process(f); }}
        className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${drag ? "border-cyan-400 bg-cyan-500/10":"border-white/10 hover:border-cyan-500/40 hover:bg-white/[0.02]"}`}
      >
        <input ref={ref} type="file" accept={accept} className="hidden"
          onChange={e => { const f=e.target.files?.[0]; if(f) process(f); e.target.value=""; }}/>
        {busy ? (
          <div className="flex flex-col items-center gap-2">
            <RefreshCw size={18} className="text-cyan-400 animate-spin"/>
            <span className="text-xs text-gray-500 font-mono">Processing file...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload size={18} className="text-gray-600"/>
            <span className="text-sm text-gray-500"><span className="text-cyan-400">Click to choose</span> or drag & drop</span>
            <span className="text-xs text-gray-700 font-mono">
              {accept.includes("video") ? "Images & Videos" : "JPG, PNG, GIF, WebP"} · Max 15MB
            </span>
          </div>
        )}
      </div>

      {/* Preview */}
      {value && !busy && (
        <div className="relative rounded-lg overflow-hidden border border-white/10 bg-gray-900">
          {isBase64 && value.startsWith("data:video") ? (
            <video src={value} className="w-full max-h-52 object-contain" controls/>
          ) : (isBase64 || (!ytId && value.startsWith("http"))) ? (
            <img src={value} alt="preview" className="w-full max-h-52 object-cover"/>
          ) : ytId ? (
            <img src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} alt="yt" className="w-full max-h-52 object-cover"/>
          ) : null}
          <button type="button" onClick={() => onChange("")}
            className="absolute top-2 right-2 w-7 h-7 bg-black/70 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors">
            <X size={12}/>
          </button>
        </div>
      )}

      {/* URL paste fallback */}
      <input type="text" value={isBase64 ? "" : value} onChange={e => onChange(e.target.value)}
        placeholder="Or paste URL (YouTube link, https://...image.jpg)"
        className="w-full bg-gray-900/40 border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-gray-500 focus:outline-none focus:border-cyan-500/30 placeholder-gray-800 font-mono"/>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, ok, hide }: { msg:string; ok:boolean; hide:()=>void }) {
  useEffect(() => { const t = setTimeout(hide, 2800); return ()=>clearTimeout(t); }, [hide]);
  return (
    <div className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3 rounded-xl border shadow-2xl text-sm font-mono
      ${ok ? "bg-gray-900 border-green-500/30 text-green-400":"bg-gray-900 border-red-500/30 text-red-400"}`}>
      {ok ? <CheckCircle size={14}/> : <XCircle size={14}/>} {msg}
    </div>
  );
}

// ─── TagInput helper ──────────────────────────────────────────────────────────
function TagInput({ label, items, onAdd, onRemove }:
  { label:string; items:string[]; onAdd:(v:string)=>void; onRemove:(i:number)=>void }) {
  const [val, setVal] = useState("");
  return (
    <div className="space-y-2">
      <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest">{label}</label>
      <div className="flex gap-2">
        <input value={val} onChange={e=>setVal(e.target.value)}
          onKeyDown={e=>{ if(e.key==="Enter"){ e.preventDefault(); if(val.trim()){ onAdd(val.trim()); setVal(""); }}}}
          className="flex-1 bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-cyan-500/50 placeholder-gray-700"
          placeholder="Type and press Enter"/>
        <button type="button" onClick={()=>{ if(val.trim()){ onAdd(val.trim()); setVal(""); }}}
          className="px-3 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors">
          <Plus size={14}/>
        </button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {items.map((t,i) => <Tag key={i} label={t} onRemove={()=>onRemove(i)}/>)}
        </div>
      )}
    </div>
  );
}

// ─── Project Form ─────────────────────────────────────────────────────────────
function ProjectForm({ initial, onSave, onCancel }:
  { initial?:Project; onSave:(p:Partial<Project>)=>void; onCancel:()=>void }) {
  const now = new Date().toISOString();
  const [f, setF] = useState<Project>(initial ?? {
    id:"", title:"", genre:"", shortDesc:"", detailedDesc:"",
    features:[], techStack:[], highlights:[], platform:[],
    mediaType:"none", mediaUrl:"", status:"completed", order:99,
    createdAt:now, updatedAt:now,
  });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  function setMedia(url: string) {
    const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    const type: Project["mediaType"] = yt ? "youtube" : (url ? "image" : "none");
    setF(p => ({ ...p, mediaUrl: url, mediaType: type }));
  }

  async function submit() {
    if (!f.title.trim()) { setErr("Title is required"); return; }
    if (!f.genre.trim()) { setErr("Genre is required"); return; }
    setBusy(true); setErr("");
    await onSave(f);
    setBusy(false);
  }

  const ytId = f.mediaType==="youtube" ? (f.mediaUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1]??null) : null;

  return (
    <div className="space-y-5">
      {err && <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg px-4 py-3 text-sm"><XCircle size={13}/>{err}</div>}

      <div className="grid grid-cols-2 gap-4">
        <Inp label="Title *" value={f.title} onChange={e=>setF(p=>({...p,title:e.target.value}))} placeholder="Multiplayer Battle Arena"/>
        <Inp label="Genre *" value={f.genre} onChange={e=>setF(p=>({...p,genre:e.target.value}))} placeholder="Multiplayer / Action"/>
      </div>

      <Txa label="Short Description *" value={f.shortDesc} rows={2}
        onChange={e=>setF(p=>({...p,shortDesc:e.target.value}))} placeholder="2-3 line compelling summary..."/>
      <Txa label="Detailed Description" value={f.detailedDesc} rows={4}
        onChange={e=>setF(p=>({...p,detailedDesc:e.target.value}))} placeholder="Full project details..."/>

      {/* Media */}
      <div className="p-4 bg-black/30 rounded-xl border border-white/[0.05] space-y-4">
        <div>
          <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-3">Project Media</label>
          <div className="flex gap-2 flex-wrap">
            {(["none","image","youtube"] as const).map(t => (
              <button key={t} type="button"
                onClick={()=>setF(p=>({...p, mediaType:t, mediaUrl: t==="none"?"":p.mediaUrl}))}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs border transition-all
                  ${f.mediaType===t ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300":"border-white/10 text-gray-500 hover:border-white/20"}`}>
                {t==="youtube"&&<Youtube size={12}/>}
                {t==="image"&&<Upload size={12}/>}
                {t==="none"&&<span className="w-3 h-3 rounded-full border border-current"/>}
                {t==="none"?"No Media":t==="image"?"Image / Video":"YouTube Link"}
              </button>
            ))}
          </div>
        </div>

        {f.mediaType==="image" && (
          <FileUploader label="Upload Image or Video" accept="image/*,video/mp4,video/webm"
            value={f.mediaUrl} onChange={setMedia}/>
        )}

        {f.mediaType==="youtube" && (
          <div className="space-y-3">
            <Inp label="YouTube URL" value={f.mediaUrl.startsWith("data:")?"":f.mediaUrl}
              onChange={e=>setMedia(e.target.value)} placeholder="https://www.youtube.com/watch?v=..."/>
            {ytId && (
              <div className="rounded-xl overflow-hidden aspect-video">
                <iframe className="w-full h-full"
                  src={`https://www.youtube.com/embed/${ytId}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/>
              </div>
            )}
          </div>
        )}
      </div>

      <TagInput label="Features" items={f.features}
        onAdd={v=>setF(p=>({...p,features:[...p.features,v]}))}
        onRemove={i=>setF(p=>({...p,features:p.features.filter((_,j)=>j!==i)}))}/>
      <TagInput label="Tech Stack" items={f.techStack}
        onAdd={v=>setF(p=>({...p,techStack:[...p.techStack,v]}))}
        onRemove={i=>setF(p=>({...p,techStack:p.techStack.filter((_,j)=>j!==i)}))}/>
      <TagInput label="Key Highlights" items={f.highlights}
        onAdd={v=>setF(p=>({...p,highlights:[...p.highlights,v]}))}
        onRemove={i=>setF(p=>({...p,highlights:p.highlights.filter((_,j)=>j!==i)}))}/>
      <TagInput label="Platforms" items={f.platform}
        onAdd={v=>setF(p=>({...p,platform:[...p.platform,v]}))}
        onRemove={i=>setF(p=>({...p,platform:p.platform.filter((_,j)=>j!==i)}))}/>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">Status</label>
          <select value={f.status} onChange={e=>setF(p=>({...p,status:e.target.value as Project["status"]}))}
            className="w-full bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-cyan-500/50">
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
          </select>
        </div>
        <Inp label="Display Order (lower = first)" type="number" value={f.order}
          onChange={e=>setF(p=>({...p,order:parseInt(e.target.value)||99}))}/>
      </div>

      <div className="flex gap-3 pt-3 border-t border-white/[0.05]">
        <button type="button" onClick={submit} disabled={busy}
          className="flex items-center gap-2 px-6 py-2.5 bg-cyan-500 text-gray-900 rounded-lg font-mono text-sm font-bold hover:bg-cyan-400 transition-colors disabled:opacity-50">
          <Save size={14}/> {busy?"Saving…":initial?"Update Project":"Add Project"}
        </button>
        <button type="button" onClick={onCancel}
          className="px-6 py-2.5 border border-white/10 text-gray-400 rounded-lg text-sm hover:border-white/20 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Post Form ────────────────────────────────────────────────────────────────
function PostForm({ initial, onSave, onCancel }:
  { initial?:Post; onSave:(p:Partial<Post>)=>void; onCancel:()=>void }) {
  const [f, setF] = useState<Partial<Post>>(initial ?? {
    title:"", excerpt:"", content:"", coverImage:"", tags:[], published:false,
  });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!f.title?.trim()) { setErr("Title is required"); return; }
    if (!f.content?.trim()) { setErr("Content is required"); return; }
    setBusy(true); setErr("");
    await onSave(f);
    setBusy(false);
  }

  return (
    <div className="space-y-5">
      {err && <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg px-4 py-3 text-sm"><XCircle size={13}/>{err}</div>}

      <Inp label="Title *" value={f.title||""} onChange={e=>setF(p=>({...p,title:e.target.value}))} placeholder="How I Built Multiplayer in Unity..."/>
      <Txa label="Excerpt (card preview) *" value={f.excerpt||""} rows={2}
        onChange={e=>setF(p=>({...p,excerpt:e.target.value}))} placeholder="1-2 sentence compelling summary..."/>

      <FileUploader label="Cover Image (optional)" accept="image/*"
        value={f.coverImage||""} onChange={url=>setF(p=>({...p,coverImage:url}))}/>

      <TagInput label="Tags" items={f.tags||[]}
        onAdd={v=>setF(p=>({...p,tags:[...(p.tags||[]),v]}))}
        onRemove={i=>setF(p=>({...p,tags:(p.tags||[]).filter((_,j)=>j!==i)}))}/>

      <div>
        <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">Content * (HTML supported)</label>
        <textarea value={f.content||""} rows={18} onChange={e=>setF(p=>({...p,content:e.target.value}))}
          className="w-full bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 font-mono focus:outline-none focus:border-cyan-500/50 resize-none"
          placeholder={"<h2>Introduction</h2>\n<p>Your content here...</p>\n\n<h2>Next Section</h2>\n<p>More content...</p>"}/>
        <p className="text-xs text-gray-700 mt-1 font-mono">// Tip: use &lt;h2&gt; &lt;p&gt; &lt;ul&gt;&lt;li&gt; &lt;strong&gt; &lt;code&gt; &lt;blockquote&gt;</p>
      </div>

      <button type="button" onClick={()=>setF(p=>({...p,published:!p.published}))}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all
          ${f.published ? "bg-green-500/20 border-green-500/30 text-green-300":"border-white/10 text-gray-500 hover:border-white/20"}`}>
        {f.published ? <Eye size={14}/> : <EyeOff size={14}/>}
        {f.published ? "Published — visible to public":"Draft — not visible yet"}
      </button>

      <div className="flex gap-3 pt-3 border-t border-white/[0.05]">
        <button type="button" onClick={submit} disabled={busy}
          className="flex items-center gap-2 px-6 py-2.5 bg-cyan-500 text-gray-900 rounded-lg font-mono text-sm font-bold hover:bg-cyan-400 disabled:opacity-50 transition-colors">
          <Save size={14}/> {busy?"Saving…":initial?"Update Post":"Save Post"}
        </button>
        <button type="button" onClick={onCancel}
          className="px-6 py-2.5 border border-white/10 text-gray-400 rounded-lg text-sm hover:border-white/20 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState("");
  const [pwdErr, setPwdErr] = useState("");
  const [tab, setTab] = useState<"dash"|"projects"|"posts"|"comments">("dash");
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [editProj, setEditProj] = useState<Project|"new"|null>(null);
  const [editPost, setEditPost] = useState<Post|"new"|null>(null);
  const [toast, setToast] = useState<{msg:string;ok:boolean}|null>(null);

  // Fix cursor
  useEffect(() => {
    document.body.classList.add("normal-cursor");
    return () => document.body.classList.remove("normal-cursor");
  }, []);

  function notify(msg: string, ok=true) { setToast({msg,ok}); }

  const loadAll = useCallback(() => {
    const storedP = load<Project[]>(SK.projects, []);
    const storedPo = load<Post[]>(SK.posts, []);
    const storedC = load<Comment[]>(SK.comments, []);
    const p = storedP.length ? storedP : SEED_PROJECTS;
    const po = storedPo.length ? storedPo : SEED_POSTS;
    if (!storedP.length) save(SK.projects, SEED_PROJECTS);
    if (!storedPo.length) save(SK.posts, SEED_POSTS);
    setProjects(p.sort((a,b)=>a.order-b.order));
    setPosts(po);
    setComments(storedC);
  }, []);

  // Check saved session
  useEffect(() => {
    if (localStorage.getItem("pf_auth")==="1") { setAuthed(true); loadAll(); }
  }, [loadAll]);

  function login() {
    const pass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";
    if (pwd === pass) { localStorage.setItem("pf_auth","1"); setAuthed(true); loadAll(); }
    else setPwdErr("Wrong password.");
  }

  function logout() { localStorage.removeItem("pf_auth"); setAuthed(false); }

  // Project CRUD
  function saveProj(data: Partial<Project>) {
    const now = new Date().toISOString();
    let next: Project[];
    if (editProj==="new") {
      const n: Project = { id:uid("proj"), title:data.title||"Untitled", genre:data.genre||"",
        shortDesc:data.shortDesc||"", detailedDesc:data.detailedDesc||"",
        features:data.features||[], techStack:data.techStack||[], highlights:data.highlights||[],
        platform:data.platform||[], mediaType:data.mediaType||"none", mediaUrl:data.mediaUrl||"",
        status:data.status||"completed", order:data.order??99, createdAt:now, updatedAt:now };
      next = [...projects, n];
      notify("✓ Project added!");
    } else if (editProj) {
      next = projects.map(p => p.id===(editProj as Project).id ? {...p,...data,updatedAt:now} : p);
      notify("✓ Project updated!");
    } else return;
    next.sort((a,b)=>a.order-b.order);
    setProjects(next); save(SK.projects, next); setEditProj(null);
  }

  function delProj(id: string) {
    if (!confirm("Delete this project?")) return;
    const next = projects.filter(p=>p.id!==id);
    setProjects(next); save(SK.projects, next); notify("Project deleted");
  }

  // Post CRUD
  function savePostFn(data: Partial<Post>) {
    let next: Post[];
    if (editPost==="new") {
      const n: Post = { id:uid("post"), slug:slugify(data.title||"untitled"),
        title:data.title||"Untitled", excerpt:data.excerpt||"", content:data.content||"",
        coverImage:data.coverImage||"", tags:data.tags||[], published:data.published||false,
        createdAt:new Date().toISOString(), views:0 };
      next = [n, ...posts];
      notify("✓ Post saved!");
    } else if (editPost) {
      next = posts.map(p => p.id===(editPost as Post).id ? {...p,...data} : p);
      notify("✓ Post updated!");
    } else return;
    setPosts(next); save(SK.posts, next); setEditPost(null);
  }

  function delPost(id: string) {
    if (!confirm("Delete post and all its comments?")) return;
    const np = posts.filter(p=>p.id!==id);
    const nc = comments.filter(c=>c.postId!==id);
    setPosts(np); setComments(nc); save(SK.posts,np); save(SK.comments,nc); notify("Post deleted");
  }

  function togglePub(post: Post) {
    const next = posts.map(p=>p.id===post.id?{...p,published:!p.published}:p);
    setPosts(next); save(SK.posts,next);
    notify(post.published?"Post unpublished":"✓ Post published!");
  }

  // Comment CRUD
  function approveC(id: string) {
    const next = comments.map(c=>c.id===id?{...c,approved:true}:c);
    setComments(next); save(SK.comments,next); notify("✓ Comment approved!");
  }
  function delC(id: string) {
    const next = comments.filter(c=>c.id!==id);
    setComments(next); save(SK.comments,next); notify("Comment deleted");
  }

  const pending = comments.filter(c=>!c.approved);

  // ── Login ──────────────────────────────────────────────────────────────────
  if (!authed) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6" style={{cursor:"auto"}}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/20">
            <span className="text-gray-900 font-bold text-2xl">A</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-gray-600 font-mono text-xs mt-1">// Unity Portfolio CMS</p>
        </div>
        <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">Password</label>
            <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&login()}
              className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2.5 text-gray-200 focus:outline-none focus:border-cyan-500/50 placeholder-gray-700"
              placeholder="Enter admin password" autoFocus/>
          </div>
          {pwdErr && <p className="text-red-400 text-xs font-mono flex items-center gap-1"><XCircle size={12}/>{pwdErr}</p>}
          <button onClick={login} className="w-full flex items-center justify-center gap-2 py-2.5 bg-cyan-500 text-gray-900 rounded-xl font-bold hover:bg-cyan-400 transition-colors">
            <LogIn size={16}/> Enter Admin Panel
          </button>
        </div>
        <p className="text-center text-gray-800 text-xs font-mono mt-4">Default: admin123 — set NEXT_PUBLIC_ADMIN_PASSWORD to change</p>
      </div>
    </div>
  );

  // ── Admin UI ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-950 text-gray-200" style={{cursor:"auto"}}>
      {toast && <Toast msg={toast.msg} ok={toast.ok} hide={()=>setToast(null)}/>}

      {/* Topbar */}
      <div className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur border-b border-white/[0.05] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-cyan-500 rounded-lg flex items-center justify-center">
            <span className="text-gray-900 font-bold text-sm">A</span>
          </div>
          <span className="font-mono text-sm text-gray-400">Admin Panel</span>
          {pending.length>0 && (
            <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-mono px-2 py-0.5 rounded-full animate-pulse">
              {pending.length} pending
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <a href="/" target="_blank" className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-cyan-400 font-mono transition-colors">
            <ExternalLink size={12}/> Site
          </a>
          <a href="/blog" target="_blank" className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-cyan-400 font-mono transition-colors">
            <ExternalLink size={12}/> Blog
          </a>
          <button onClick={logout} className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-red-400 font-mono transition-colors">
            <LogOut size={12}/> Logout
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 min-h-[calc(100vh-49px)] bg-gray-900/40 border-r border-white/[0.05] p-4 sticky top-[49px] flex-shrink-0">
          {([
            { id:"dash", icon:<LayoutDashboard size={15}/>, label:"Dashboard" },
            { id:"projects", icon:<FolderOpen size={15}/>, label:`Projects (${projects.length})` },
            { id:"posts", icon:<FileText size={15}/>, label:`Posts (${posts.length})` },
            { id:"comments", icon:<MessageSquare size={15}/>, label:"Comments", badge:pending.length },
          ] as const).map(item=>(
            <button key={item.id}
              onClick={()=>{ setTab(item.id); setEditProj(null); setEditPost(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-1 transition-all font-mono
                ${tab===item.id ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/20":"text-gray-500 hover:text-gray-300 hover:bg-white/5"}`}>
              {item.icon}
              <span className="flex-1 text-left">{item.label}</span>
              {"badge" in item && item.badge ? <span className="bg-red-500/30 text-red-400 text-xs px-1.5 py-0.5 rounded-full">{item.badge}</span> : null}
            </button>
          ))}
        </aside>

        {/* Content */}
        <main className="flex-1 p-8 min-w-0">

          {/* DASHBOARD */}
          {tab==="dash" && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Welcome back 👾</h2>
                <p className="text-gray-600 font-mono text-xs">Changes save instantly to this browser.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {l:"Projects", v:projects.length, c:"text-cyan-400"},
                  {l:"Posts", v:posts.length, c:"text-purple-400"},
                  {l:"Published", v:posts.filter(p=>p.published).length, c:"text-green-400"},
                  {l:"Pending Comments", v:pending.length, c:"text-amber-400"},
                ].map(s=>(
                  <div key={s.l} className="bg-gray-900 border border-white/[0.06] rounded-xl p-5">
                    <div className={`text-3xl font-bold mb-1 ${s.c}`}>{s.v}</div>
                    <div className="text-xs text-gray-600 font-mono uppercase tracking-widest">{s.l}</div>
                  </div>
                ))}
              </div>
              <div className="bg-gray-900 border border-white/[0.06] rounded-xl p-5">
                <h3 className="font-mono text-sm text-gray-400 mb-4">// Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <button onClick={()=>{setTab("projects");setEditProj("new");}}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg text-sm hover:bg-cyan-500/20 transition-colors">
                    <Plus size={14}/> New Project
                  </button>
                  <button onClick={()=>{setTab("posts");setEditPost("new");}}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-lg text-sm hover:bg-purple-500/20 transition-colors">
                    <Plus size={14}/> Write Post
                  </button>
                  {pending.length>0 && (
                    <button onClick={()=>setTab("comments")}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/20 transition-colors">
                      <MessageSquare size={14}/> Review {pending.length} Comments
                    </button>
                  )}
                </div>
              </div>
              <div className="bg-blue-500/5 border border-blue-500/15 rounded-xl p-4">
                <p className="font-mono text-xs text-blue-400/60 mb-1">// Storage info</p>
                <p className="text-gray-500 text-sm">Data is saved in your browser localStorage — works on any device, no database needed. To share across devices, push changes to GitHub and redeploy.</p>
              </div>
            </div>
          )}

          {/* PROJECTS */}
          {tab==="projects" && (
            <div className="max-w-5xl">
              {editProj ? (
                <div>
                  <button onClick={()=>setEditProj(null)} className="flex items-center gap-2 text-gray-500 hover:text-gray-300 font-mono text-sm mb-6">
                    <ArrowLeft size={14}/> Back to Projects
                  </button>
                  <h2 className="text-xl font-bold text-white mb-6">
                    {editProj==="new" ? "Add New Project" : `Edit: ${(editProj as Project).title}`}
                  </h2>
                  <div className="bg-gray-900 border border-white/[0.06] rounded-xl p-6">
                    <ProjectForm initial={editProj==="new"?undefined:editProj as Project} onSave={saveProj} onCancel={()=>setEditProj(null)}/>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-white">Projects</h2>
                      <p className="text-gray-600 font-mono text-xs mt-0.5">{projects.length} total</p>
                    </div>
                    <button onClick={()=>setEditProj("new")}
                      className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-gray-900 rounded-lg font-mono text-sm font-bold hover:bg-cyan-400 transition-colors">
                      <Plus size={14}/> Add Project
                    </button>
                  </div>
                  <div className="space-y-3">
                    {projects.map(proj=>{
                      const ytId = proj.mediaType==="youtube" ? proj.mediaUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1] : null;
                      return (
                        <div key={proj.id} className="bg-gray-900 border border-white/[0.06] rounded-xl p-4 flex items-center gap-4 group hover:border-white/10 transition-all">
                          <div className="w-20 h-14 rounded-lg bg-gray-800 flex-shrink-0 overflow-hidden">
                            {ytId ? <img src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} alt="" className="w-full h-full object-cover"/>
                              : proj.mediaType==="image"&&proj.mediaUrl ? <img src={proj.mediaUrl} alt="" className="w-full h-full object-cover"/>
                              : <div className="w-full h-full flex items-center justify-center text-2xl">🎮</div>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-white truncate">{proj.title}</div>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <span className="font-mono text-xs text-cyan-500">{proj.genre}</span>
                              <span className="text-gray-700">·</span>
                              <span className={`font-mono text-xs ${proj.status==="completed"?"text-green-500":"text-amber-500"}`}>{proj.status}</span>
                              <span className="text-gray-700">·</span>
                              <span className="font-mono text-xs text-gray-600">
                                {proj.mediaType==="youtube"?"▶ YouTube":proj.mediaType==="image"&&proj.mediaUrl?"🖼 Image":"No media"}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={()=>setEditProj(proj)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg text-xs font-mono transition-all">
                              <Pencil size={12}/> Edit
                            </button>
                            <button onClick={()=>delProj(proj.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg text-xs font-mono transition-all">
                              <Trash2 size={12}/> Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {projects.length===0 && <div className="text-center py-16 text-gray-700 font-mono">// No projects yet.</div>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* POSTS */}
          {tab==="posts" && (
            <div className="max-w-5xl">
              {editPost ? (
                <div>
                  <button onClick={()=>setEditPost(null)} className="flex items-center gap-2 text-gray-500 hover:text-gray-300 font-mono text-sm mb-6">
                    <ArrowLeft size={14}/> Back to Posts
                  </button>
                  <h2 className="text-xl font-bold text-white mb-6">
                    {editPost==="new"?"Write New Post":`Edit: ${(editPost as Post).title}`}
                  </h2>
                  <div className="bg-gray-900 border border-white/[0.06] rounded-xl p-6">
                    <PostForm initial={editPost==="new"?undefined:editPost as Post} onSave={savePostFn} onCancel={()=>setEditPost(null)}/>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-white">Posts</h2>
                      <p className="text-gray-600 font-mono text-xs mt-0.5">{posts.filter(p=>p.published).length} published · {posts.filter(p=>!p.published).length} drafts</p>
                    </div>
                    <button onClick={()=>setEditPost("new")}
                      className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-gray-900 rounded-lg font-mono text-sm font-bold hover:bg-cyan-400 transition-colors">
                      <Plus size={14}/> Write Post
                    </button>
                  </div>
                  <div className="space-y-3">
                    {posts.map(post=>(
                      <div key={post.id} className="bg-gray-900 border border-white/[0.06] rounded-xl p-4 flex items-center gap-4 group hover:border-white/10 transition-all">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white truncate">{post.title}</div>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className={`font-mono text-xs px-2 py-0.5 rounded ${post.published?"bg-green-500/15 text-green-400 border border-green-500/20":"bg-gray-700/50 text-gray-500 border border-white/[0.05]"}`}>
                              {post.published?"● Published":"○ Draft"}
                            </span>
                            <span className="font-mono text-xs text-gray-600">{new Date(post.createdAt).toLocaleDateString()}</span>
                            {post.tags.slice(0,3).map(t=>(
                              <span key={t} className="bg-cyan-500/8 border border-cyan-500/15 text-cyan-500/70 text-xs font-mono px-1.5 py-0.5 rounded">{t}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <button onClick={()=>togglePub(post)} title={post.published?"Unpublish":"Publish"}
                            className="p-2 text-gray-500 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all">
                            {post.published?<EyeOff size={13}/>:<Eye size={13}/>}
                          </button>
                          {post.published && (
                            <a href={`/blog/${post.slug}`} target="_blank"
                              className="p-2 text-gray-500 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all">
                              <ExternalLink size={13}/>
                            </a>
                          )}
                          <button onClick={()=>setEditPost(post)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg text-xs font-mono transition-all">
                            <Pencil size={12}/> Edit
                          </button>
                          <button onClick={()=>delPost(post.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg text-xs font-mono transition-all">
                            <Trash2 size={12}/> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                    {posts.length===0 && <div className="text-center py-16 text-gray-700 font-mono">// No posts yet.</div>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* COMMENTS */}
          {tab==="comments" && (
            <div className="max-w-4xl">
              <h2 className="text-xl font-bold text-white mb-1">Comments</h2>
              <p className="text-gray-600 font-mono text-xs mb-6">{comments.length} total · {pending.length} awaiting approval</p>
              <div className="space-y-3">
                {comments.map(c=>{
                  const post = posts.find(p=>p.id===c.postId);
                  return (
                    <div key={c.id} className={`bg-gray-900 border rounded-xl p-5 ${c.approved?"border-white/[0.06]":"border-amber-500/20 bg-amber-500/[0.02]"}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className="font-semibold text-white text-sm">{c.name}</span>
                            {c.email && <span className="text-gray-600 text-xs font-mono">{c.email}</span>}
                            <span className={`text-xs font-mono px-2 py-0.5 rounded ${c.approved?"bg-green-500/10 text-green-500":"bg-amber-500/10 text-amber-400"}`}>
                              {c.approved?"✓ Approved":"⏳ Pending"}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm leading-relaxed mb-2">{c.message}</p>
                          <div className="font-mono text-xs text-gray-700">
                            on: <span className="text-gray-500">{post?.title||"Unknown post"}</span>
                            {" · "}{new Date(c.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!c.approved && (
                            <button onClick={()=>approveC(c.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-xs font-mono hover:bg-green-500/20 transition-colors">
                              <CheckCircle size={12}/> Approve
                            </button>
                          )}
                          <button onClick={()=>delC(c.id)}
                            className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                            <Trash2 size={13}/>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {comments.length===0 && <div className="text-center py-16 text-gray-700 font-mono">// No comments yet.</div>}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
