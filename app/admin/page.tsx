"use client";
import { useState, useEffect, useCallback } from "react";
import {
  LogIn, LogOut, Plus, Pencil, Trash2, Eye, EyeOff,
  CheckCircle, XCircle, LayoutDashboard, FolderOpen,
  FileText, MessageSquare, Youtube, Image, Save,
  ArrowLeft, X, GripVertical, ExternalLink
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Project {
  id: string; title: string; genre: string; shortDesc: string;
  detailedDesc: string; features: string[]; techStack: string[];
  highlights: string[]; mediaType: "youtube" | "image" | "none";
  mediaUrl: string; status: "completed" | "in-progress";
  platform: string[]; order: number;
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

// ─── Helpers ─────────────────────────────────────────────────────────────────
const api = async (url: string, method = "GET", body?: unknown) => {
  const res = await fetch(url, {
    method, headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

function getYouTubeId(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : null;
}

function Tag({ label, onRemove }: { label: string; onRemove?: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono px-2 py-0.5 rounded">
      {label}
      {onRemove && <button onClick={onRemove} className="hover:text-red-400 ml-1"><X size={10} /></button>}
    </span>
  );
}

function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">{label}</label>
      <input {...props} className="w-full bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-cyan-500/50 transition-colors placeholder-gray-700" />
    </div>
  );
}

function Textarea({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">{label}</label>
      <textarea {...props} className="w-full bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-cyan-500/50 transition-colors placeholder-gray-700 resize-none" />
    </div>
  );
}

// ─── Project Form ─────────────────────────────────────────────────────────────
const EMPTY_PROJECT: Partial<Project> = {
  title: "", genre: "", shortDesc: "", detailedDesc: "",
  features: [], techStack: [], highlights: [],
  mediaType: "none", mediaUrl: "", status: "completed",
  platform: [], order: 99,
};

function ProjectForm({ initial, onSave, onCancel }: {
  initial?: Project; onSave: (p: Partial<Project>) => void; onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<Project>>(initial || EMPTY_PROJECT);
  const [tagInput, setTagInput] = useState({ features: "", techStack: "", highlights: "", platform: "" });
  const [saving, setSaving] = useState(false);

  const addTag = (field: "features" | "techStack" | "highlights" | "platform") => {
    const val = tagInput[field].trim();
    if (!val) return;
    setForm(f => ({ ...f, [field]: [...(f[field] as string[] || []), val] }));
    setTagInput(t => ({ ...t, [field]: "" }));
  };

  const removeTag = (field: "features" | "techStack" | "highlights" | "platform", idx: number) => {
    setForm(f => ({ ...f, [field]: (f[field] as string[]).filter((_, i) => i !== idx) }));
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  const ytId = form.mediaType === "youtube" && form.mediaUrl ? getYouTubeId(form.mediaUrl) : null;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Title *" value={form.title || ""} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Multiplayer Battle Arena" />
        <Input label="Genre *" value={form.genre || ""} onChange={e => setForm(f => ({ ...f, genre: e.target.value }))} placeholder="Multiplayer / Action" />
      </div>

      <Textarea label="Short Description (2-3 lines) *" value={form.shortDesc || ""} rows={2}
        onChange={e => setForm(f => ({ ...f, shortDesc: e.target.value }))} placeholder="A compelling 2-3 line summary..." />

      <Textarea label="Detailed Description *" value={form.detailedDesc || ""} rows={4}
        onChange={e => setForm(f => ({ ...f, detailedDesc: e.target.value }))} placeholder="In-depth description of the project..." />

      {/* Media */}
      <div className="space-y-3 p-4 bg-black/30 rounded-xl border border-white/5">
        <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest">Media Type</label>
        <div className="flex gap-3">
          {(["none", "youtube", "image"] as const).map(t => (
            <button key={t} onClick={() => setForm(f => ({ ...f, mediaType: t, mediaUrl: "" }))}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition-all ${form.mediaType === t ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300" : "border-white/10 text-gray-500 hover:border-white/20"}`}>
              {t === "youtube" && <Youtube size={14} />}
              {t === "image" && <Image size={14} />}
              {t === "none" && <span className="w-3.5 h-3.5 rounded-full border border-current" />}
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {form.mediaType !== "none" && (
          <Input
            label={form.mediaType === "youtube" ? "YouTube URL" : "Image URL"}
            value={form.mediaUrl || ""}
            onChange={e => setForm(f => ({ ...f, mediaUrl: e.target.value }))}
            placeholder={form.mediaType === "youtube" ? "https://www.youtube.com/watch?v=..." : "https://..."}
          />
        )}

        {/* YouTube preview */}
        {ytId && (
          <div className="rounded-lg overflow-hidden aspect-video">
            <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${ytId}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
        )}

        {/* Image preview */}
        {form.mediaType === "image" && form.mediaUrl && (
          <img src={form.mediaUrl} alt="preview" className="rounded-lg max-h-48 object-cover w-full" />
        )}
      </div>

      {/* Arrays */}
      {(["features", "techStack", "highlights", "platform"] as const).map(field => (
        <div key={field} className="space-y-2">
          <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest">
            {field === "techStack" ? "Tech Stack" : field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          <div className="flex gap-2">
            <input value={tagInput[field]} onChange={e => setTagInput(t => ({ ...t, [field]: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag(field))}
              className="flex-1 bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-cyan-500/50 placeholder-gray-700"
              placeholder={`Add ${field === "techStack" ? "tech" : field.slice(0, -1)} + Enter`} />
            <button onClick={() => addTag(field)} className="px-3 py-2 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors">
              <Plus size={14} />
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(form[field] as string[] || []).map((tag, i) => (
              <Tag key={i} label={tag} onRemove={() => removeTag(field, i)} />
            ))}
          </div>
        </div>
      ))}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">Status</label>
          <select value={form.status || "completed"} onChange={e => setForm(f => ({ ...f, status: e.target.value as Project["status"] }))}
            className="w-full bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-cyan-500/50">
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
          </select>
        </div>
        <Input label="Display Order" type="number" value={form.order || 99}
          onChange={e => setForm(f => ({ ...f, order: parseInt(e.target.value) }))} />
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-cyan-500 text-gray-900 rounded-lg font-mono text-sm font-semibold hover:bg-cyan-400 transition-colors disabled:opacity-50">
          <Save size={14} /> {saving ? "Saving..." : "Save Project"}
        </button>
        <button onClick={onCancel} className="px-6 py-2.5 border border-white/10 text-gray-400 rounded-lg text-sm hover:border-white/20 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Post Form ────────────────────────────────────────────────────────────────
const EMPTY_POST: Partial<Post> = {
  title: "", excerpt: "", content: "", coverImage: "", tags: [], published: false,
};

function PostForm({ initial, onSave, onCancel }: {
  initial?: Post; onSave: (p: Partial<Post>) => void; onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<Post>>(initial || EMPTY_POST);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);

  const addTag = () => {
    const val = tagInput.trim();
    if (!val) return;
    setForm(f => ({ ...f, tags: [...(f.tags || []), val] }));
    setTagInput("");
  };

  const handleSave = async () => { setSaving(true); await onSave(form); setSaving(false); };

  return (
    <div className="space-y-5">
      <Input label="Title *" value={form.title || ""} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
        placeholder="How I Built Multiplayer in Unity..." />

      <Textarea label="Excerpt (shown in card preview) *" value={form.excerpt || ""} rows={2}
        onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="A compelling 1-2 sentence summary..." />

      <Input label="Cover Image URL (optional)" value={form.coverImage || ""}
        onChange={e => setForm(f => ({ ...f, coverImage: e.target.value }))} placeholder="https://..." />
      {form.coverImage && (
        <img src={form.coverImage} alt="cover preview" className="rounded-lg max-h-40 object-cover w-full" />
      )}

      <div>
        <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">Tags</label>
        <div className="flex gap-2 mb-2">
          <input value={tagInput} onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())}
            className="flex-1 bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-cyan-500/50 placeholder-gray-700"
            placeholder="Unity, C#, Game Dev... + Enter" />
          <button onClick={addTag} className="px-3 py-2 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/30">
            <Plus size={14} />
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(form.tags || []).map((tag, i) => (
            <Tag key={i} label={tag} onRemove={() => setForm(f => ({ ...f, tags: (f.tags || []).filter((_, j) => j !== i) }))} />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">Content (HTML supported) *</label>
        <textarea value={form.content || ""} rows={14}
          onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
          className="w-full bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 font-mono focus:outline-none focus:border-cyan-500/50 resize-none"
          placeholder={"<h2>Introduction</h2>\n<p>Your post content here...</p>\n\n<h2>Section 2</h2>\n<p>More content...</p>"} />
        <p className="text-xs text-gray-700 mt-1 font-mono">// Tip: Use &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;&lt;li&gt;, &lt;strong&gt;, &lt;code&gt; for rich formatting</p>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={() => setForm(f => ({ ...f, published: !f.published }))}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all ${form.published ? "bg-green-500/20 border-green-500/30 text-green-300" : "border-white/10 text-gray-500"}`}>
          {form.published ? <Eye size={14} /> : <EyeOff size={14} />}
          {form.published ? "Published" : "Draft"}
        </button>
        <span className="text-xs text-gray-600 font-mono">// Toggle to publish/unpublish</span>
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-cyan-500 text-gray-900 rounded-lg font-mono text-sm font-semibold hover:bg-cyan-400 disabled:opacity-50">
          <Save size={14} /> {saving ? "Saving..." : "Save Post"}
        </button>
        <button onClick={onCancel} className="px-6 py-2.5 border border-white/10 text-gray-400 rounded-lg text-sm hover:border-white/20">
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [logging, setLogging] = useState(false);
  const [tab, setTab] = useState<"dashboard" | "projects" | "posts" | "comments">("dashboard");
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [editProject, setEditProject] = useState<Project | null | "new">(null);
  const [editPost, setEditPost] = useState<Post | null | "new">(null);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [p, po, c] = await Promise.all([
        api("/api/projects"),
        api("/api/posts"),
        api("/api/comments"),
      ]);
      setProjects(p); setPosts(po); setComments(c);
    } catch { /* not authed yet */ }
    setLoading(false);
  }, []);

  // Check if already logged in
  useEffect(() => {
    api("/api/projects").then(p => { setProjects(p); setAuthed(true); loadData(); }).catch(() => {});
  }, []);

  const login = async () => {
    setLogging(true); setLoginError("");
    try {
      await api("/api/auth", "POST", { password });
      setAuthed(true);
      await loadData();
    } catch { setLoginError("Wrong password. Try again."); }
    setLogging(false);
  };

  const logout = async () => {
    await api("/api/auth", "DELETE");
    setAuthed(false);
  };

  // Project actions
  const saveProject = async (data: Partial<Project>) => {
    if (editProject === "new") {
      await api("/api/projects", "POST", data);
    } else if (editProject) {
      await api(`/api/projects/${editProject.id}`, "PUT", data);
    }
    setEditProject(null);
    await loadData();
  };

  const deleteProj = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await api(`/api/projects/${id}`, "DELETE");
    await loadData();
  };

  // Post actions
  const savePost = async (data: Partial<Post>) => {
    if (editPost === "new") {
      await api("/api/posts", "POST", data);
    } else if (editPost) {
      await api(`/api/posts/${(editPost as Post).id}`, "PUT", data);
    }
    setEditPost(null);
    await loadData();
  };

  const deletePost_ = async (id: string) => {
    if (!confirm("Delete this post and all its comments?")) return;
    await api(`/api/posts/${id}`, "DELETE");
    await loadData();
  };

  const togglePublish = async (post: Post) => {
    await api(`/api/posts/${post.id}`, "PUT", { published: !post.published });
    await loadData();
  };

  // Comment actions
  const approveComment = async (id: string) => {
    await api("/api/comments", "PATCH", { id });
    await loadData();
  };

  const deleteComment_ = async (id: string) => {
    await api("/api/comments", "DELETE", { id });
    await loadData();
  };

  // ── Login Screen ────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="font-bold text-gray-900 text-xl">A</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-gray-600 font-mono text-xs mt-1">// Unity Portfolio CMS</p>
          </div>

          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 space-y-4">
            <Input label="Password" type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent) => e.key === "Enter" && login()}
              placeholder="Enter your admin password" />
            {loginError && (
              <p className="text-red-400 text-xs font-mono flex items-center gap-1">
                <XCircle size={12} /> {loginError}
              </p>
            )}
            <button onClick={login} disabled={logging}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-cyan-500 text-gray-900 rounded-xl font-semibold hover:bg-cyan-400 transition-colors disabled:opacity-50">
              <LogIn size={16} /> {logging ? "Logging in..." : "Enter Admin Panel"}
            </button>
          </div>

          <p className="text-center text-gray-800 text-xs font-mono mt-6">
            Set ADMIN_PASSWORD in your .env.local file
          </p>
        </div>
      </div>
    );
  }

  const pendingComments = comments.filter(c => !c.approved);
  const publishedPosts = posts.filter(p => p.published);

  // ── Admin UI ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-950 text-gray-200">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur border-b border-white/[0.06] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-cyan-500 rounded flex items-center justify-center">
            <span className="font-bold text-gray-900 text-sm">A</span>
          </div>
          <span className="font-mono text-sm text-gray-400">Admin Panel</span>
          {pendingComments.length > 0 && (
            <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-mono px-2 py-0.5 rounded-full">
              {pendingComments.length} pending
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-300 font-mono transition-colors">
            <ExternalLink size={12} /> View Site
          </a>
          <button onClick={logout} className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-red-400 font-mono transition-colors">
            <LogOut size={12} /> Logout
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 min-h-[calc(100vh-49px)] bg-gray-900/50 border-r border-white/[0.06] p-4 sticky top-[49px] flex-shrink-0">
          {[
            { id: "dashboard", icon: <LayoutDashboard size={15} />, label: "Dashboard" },
            { id: "projects", icon: <FolderOpen size={15} />, label: "Projects" },
            { id: "posts", icon: <FileText size={15} />, label: "Posts" },
            { id: "comments", icon: <MessageSquare size={15} />, label: "Comments", badge: pendingComments.length },
          ].map(item => (
            <button key={item.id} onClick={() => { setTab(item.id as typeof tab); setEditProject(null); setEditPost(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-1 transition-all font-mono ${tab === item.id ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/20" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"}`}>
              {item.icon} {item.label}
              {item.badge ? <span className="ml-auto bg-red-500/30 text-red-400 text-xs px-1.5 py-0.5 rounded-full">{item.badge}</span> : null}
            </button>
          ))}
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8 min-w-0">
          {loading && <div className="text-center text-gray-600 font-mono py-20">// Loading...</div>}

          {/* ── DASHBOARD ── */}
          {!loading && tab === "dashboard" && (
            <div className="space-y-6 max-w-4xl">
              <h2 className="text-2xl font-bold text-white">Welcome back 👾</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Projects", value: projects.length, color: "cyan" },
                  { label: "Posts", value: posts.length, color: "purple" },
                  { label: "Published", value: publishedPosts.length, color: "green" },
                  { label: "Pending Comments", value: pendingComments.length, color: "amber" },
                ].map(s => (
                  <div key={s.label} className="bg-gray-900 border border-white/[0.06] rounded-xl p-5">
                    <div className={`text-3xl font-bold mb-1 ${s.color === "cyan" ? "text-cyan-400" : s.color === "purple" ? "text-purple-400" : s.color === "green" ? "text-green-400" : "text-amber-400"}`}>
                      {s.value}
                    </div>
                    <div className="text-xs text-gray-600 font-mono uppercase tracking-widest">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-900 border border-white/[0.06] rounded-xl p-5">
                <h3 className="font-mono text-sm text-gray-400 mb-3">// Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => { setTab("projects"); setEditProject("new"); }}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg text-sm hover:bg-cyan-500/20 transition-colors">
                    <Plus size={14} /> New Project
                  </button>
                  <button onClick={() => { setTab("posts"); setEditPost("new"); }}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-lg text-sm hover:bg-purple-500/20 transition-colors">
                    <Plus size={14} /> New Post
                  </button>
                  {pendingComments.length > 0 && (
                    <button onClick={() => setTab("comments")}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/20 transition-colors">
                      <MessageSquare size={14} /> Review {pendingComments.length} Comments
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── PROJECTS ── */}
          {!loading && tab === "projects" && (
            <div className="max-w-5xl">
              {editProject ? (
                <div>
                  <button onClick={() => setEditProject(null)} className="flex items-center gap-2 text-gray-500 hover:text-gray-300 font-mono text-sm mb-6 transition-colors">
                    <ArrowLeft size={14} /> Back to Projects
                  </button>
                  <h2 className="text-xl font-bold text-white mb-6">
                    {editProject === "new" ? "Add New Project" : `Edit: ${(editProject as Project).title}`}
                  </h2>
                  <div className="bg-gray-900 border border-white/[0.06] rounded-xl p-6">
                    <ProjectForm
                      initial={editProject === "new" ? undefined : editProject as Project}
                      onSave={saveProject}
                      onCancel={() => setEditProject(null)}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Projects <span className="text-gray-600 font-mono text-sm ml-2">({projects.length})</span></h2>
                    <button onClick={() => setEditProject("new")}
                      className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-gray-900 rounded-lg font-mono text-sm font-semibold hover:bg-cyan-400 transition-colors">
                      <Plus size={14} /> Add Project
                    </button>
                  </div>
                  <div className="space-y-3">
                    {projects.map(project => (
                      <div key={project.id} className="bg-gray-900 border border-white/[0.06] rounded-xl p-5 flex items-center gap-4 group hover:border-white/10 transition-colors">
                        {/* Thumbnail */}
                        <div className="w-20 h-14 rounded-lg bg-gray-800 flex-shrink-0 overflow-hidden">
                          {project.mediaType === "youtube" && project.mediaUrl && getYouTubeId(project.mediaUrl) ? (
                            <img src={`https://img.youtube.com/vi/${getYouTubeId(project.mediaUrl)}/mqdefault.jpg`} alt="" className="w-full h-full object-cover" />
                          ) : project.mediaType === "image" && project.mediaUrl ? (
                            <img src={project.mediaUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-700 text-xl">🎮</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white truncate">{project.title}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-mono text-xs text-cyan-500">{project.genre}</span>
                            <span className="text-gray-700">·</span>
                            <span className={`font-mono text-xs ${project.status === "completed" ? "text-green-500" : "text-amber-500"}`}>
                              {project.status}
                            </span>
                            <span className="text-gray-700">·</span>
                            <span className="font-mono text-xs text-gray-600">order: {project.order}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setEditProject(project)}
                            className="p-2 text-gray-500 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => deleteProj(project.id)}
                            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {projects.length === 0 && (
                      <div className="text-center py-16 text-gray-700 font-mono">
                        // No projects yet. Add your first one!
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── POSTS ── */}
          {!loading && tab === "posts" && (
            <div className="max-w-5xl">
              {editPost ? (
                <div>
                  <button onClick={() => setEditPost(null)} className="flex items-center gap-2 text-gray-500 hover:text-gray-300 font-mono text-sm mb-6 transition-colors">
                    <ArrowLeft size={14} /> Back to Posts
                  </button>
                  <h2 className="text-xl font-bold text-white mb-6">
                    {editPost === "new" ? "Write New Post" : `Edit: ${(editPost as Post).title}`}
                  </h2>
                  <div className="bg-gray-900 border border-white/[0.06] rounded-xl p-6">
                    <PostForm
                      initial={editPost === "new" ? undefined : editPost as Post}
                      onSave={savePost}
                      onCancel={() => setEditPost(null)}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Posts <span className="text-gray-600 font-mono text-sm ml-2">({posts.length})</span></h2>
                    <button onClick={() => setEditPost("new")}
                      className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-gray-900 rounded-lg font-mono text-sm font-semibold hover:bg-cyan-400 transition-colors">
                      <Plus size={14} /> Write Post
                    </button>
                  </div>
                  <div className="space-y-3">
                    {posts.map(post => (
                      <div key={post.id} className="bg-gray-900 border border-white/[0.06] rounded-xl p-5 flex items-center gap-4 group hover:border-white/10 transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white truncate">{post.title}</div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className={`font-mono text-xs px-2 py-0.5 rounded ${post.published ? "bg-green-500/15 text-green-400 border border-green-500/20" : "bg-gray-700/50 text-gray-500 border border-white/5"}`}>
                              {post.published ? "Published" : "Draft"}
                            </span>
                            <span className="text-gray-700 font-mono text-xs">{new Date(post.createdAt).toLocaleDateString()}</span>
                            <span className="text-gray-700">·</span>
                            <span className="font-mono text-xs text-gray-600">{post.views} views</span>
                            {post.tags.slice(0, 3).map(t => <Tag key={t} label={t} />)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => togglePublish(post)}
                            className="p-2 text-gray-500 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all"
                            title={post.published ? "Unpublish" : "Publish"}>
                            {post.published ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                          {post.published && (
                            <a href={`/blog/${post.slug}`} target="_blank"
                              className="p-2 text-gray-500 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all">
                              <ExternalLink size={14} />
                            </a>
                          )}
                          <button onClick={() => setEditPost(post)}
                            className="p-2 text-gray-500 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => deletePost_(post.id)}
                            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {posts.length === 0 && (
                      <div className="text-center py-16 text-gray-700 font-mono">// No posts yet. Write your first one!</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── COMMENTS ── */}
          {!loading && tab === "comments" && (
            <div className="max-w-4xl">
              <h2 className="text-xl font-bold text-white mb-6">
                Comments <span className="text-gray-600 font-mono text-sm ml-2">({comments.length} total · {pendingComments.length} pending)</span>
              </h2>
              <div className="space-y-3">
                {comments.map(comment => {
                  const post = posts.find(p => p.id === comment.postId);
                  return (
                    <div key={comment.id} className={`bg-gray-900 border rounded-xl p-5 ${comment.approved ? "border-white/[0.06]" : "border-amber-500/20"}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-semibold text-white text-sm">{comment.name}</span>
                            {comment.email && <span className="text-gray-600 text-xs font-mono">{comment.email}</span>}
                            <span className={`text-xs font-mono px-2 py-0.5 rounded ${comment.approved ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-400"}`}>
                              {comment.approved ? "Approved" : "Pending"}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm mb-2">{comment.message}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-700 font-mono">
                            <span>on: <span className="text-gray-500">{post?.title || comment.postId}</span></span>
                            <span>·</span>
                            <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!comment.approved && (
                            <button onClick={() => approveComment(comment.id)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-xs hover:bg-green-500/20 transition-colors">
                              <CheckCircle size={12} /> Approve
                            </button>
                          )}
                          <button onClick={() => deleteComment_(comment.id)}
                            className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {comments.length === 0 && (
                  <div className="text-center py-16 text-gray-700 font-mono">// No comments yet.</div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
