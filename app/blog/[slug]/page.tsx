"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Twitter, Linkedin, Facebook, Link2, Send, MessageSquare, Eye, CheckCircle, X } from "lucide-react";

interface Post {
  id: string; slug: string; title: string; excerpt: string;
  content: string; coverImage: string; tags: string[];
  published: boolean; createdAt: string; views: number;
}
interface Comment {
  id: string; postId: string; name: string; message: string;
  email: string; approved: boolean; createdAt: string;
}

function timeAgo(date: string) {
  const days = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days/7)}w ago`;
  return new Date(date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
}

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Fix cursor on this page
  useEffect(() => {
    document.body.classList.add("normal-cursor");
    return () => document.body.classList.remove("normal-cursor");
  }, []);

  // Load post from localStorage
  useEffect(() => {
    if (!slug) return;
    try {
      const stored = localStorage.getItem("pf_posts");
      if (stored) {
        const all: Post[] = JSON.parse(stored);
        const found = all.find(p => p.slug === slug && p.published);
        if (found) {
          // Increment views
          const updated = all.map(p => p.id === found.id ? {...p, views: p.views + 1} : p);
          localStorage.setItem("pf_posts", JSON.stringify(updated));
          setPost({...found, views: found.views + 1});
          // Load comments
          const storedC = localStorage.getItem("pf_comments");
          if (storedC) {
            const allC: Comment[] = JSON.parse(storedC);
            setComments(allC.filter(c => c.postId === found.id && c.approved));
          }
          setLoading(false);
          return;
        }
      }
    } catch {}
    // Fallback to API
    fetch(`/api/posts/${slug}`)
      .then(r => { if (!r.ok) throw new Error("not found"); return r.json(); })
      .then(p => { setPost(p); setLoading(false); })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [slug]);

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !form.name.trim() || !form.message.trim()) return;
    setSubmitting(true);
    // Save to localStorage
    const newComment: Comment = {
      id: `cmt-${Date.now()}`, postId: post.id,
      name: form.name.trim(), email: form.email.trim(),
      message: form.message.trim(), approved: false,
      createdAt: new Date().toISOString(),
    };
    try {
      const stored = localStorage.getItem("pf_comments");
      const all: Comment[] = stored ? JSON.parse(stored) : [];
      all.unshift(newComment);
      localStorage.setItem("pf_comments", JSON.stringify(all));
    } catch {}
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
    }, 500);
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center" style={{cursor:"auto"}}>
      <div className="font-mono text-gray-700 animate-pulse text-sm">// Loading post...</div>
    </div>
  );

  if (notFound || !post) return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center gap-4" style={{cursor:"auto"}}>
      <div className="font-heading text-7xl text-gray-800">404</div>
      <div className="font-mono text-gray-600 text-sm">// Post not found</div>
      <Link href="/blog" className="btn-outline mt-4">← Back to Blog</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-base" style={{cursor:"auto"}}>
      {/* Nav bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-bg-base/90 backdrop-blur border-b border-white/[0.04]">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/blog" className="flex items-center gap-2 text-gray-500 hover:text-accent-cyan font-mono text-xs transition-colors uppercase tracking-widest">
            <ArrowLeft size={13}/> All Posts
          </Link>
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 bg-accent-cyan rounded flex items-center justify-center">
              <span className="font-heading text-bg-base text-xs">U</span>
            </div>
            <span className="font-mono text-[0.65rem] text-gray-600 group-hover:text-accent-cyan transition-colors uppercase tracking-widest">dev.unity</span>
          </Link>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-6 pt-28 pb-24">
        {/* Cover */}
        {post.coverImage && (
          <div className="rounded-2xl overflow-hidden mb-10 h-64 md:h-96 relative">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover"/>
            <div className="absolute inset-0" style={{background:"linear-gradient(to top, rgba(6,8,9,0.5), transparent)"}}/>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {post.tags.map(tag => <span key={tag} className="tag-pill text-[0.62rem]">{tag}</span>)}
        </div>

        {/* Title */}
        <h1 className="section-heading text-[clamp(2.2rem,5vw,4rem)] text-white leading-none mb-6">{post.title}</h1>

        {/* Meta */}
        <div className="flex items-center gap-4 pb-8 border-b border-white/[0.05] mb-10 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent-cyan/20 border border-accent-cyan/30 flex items-center justify-center">
              <span className="font-heading text-accent-cyan text-sm">A</span>
            </div>
            <span className="text-sm text-gray-400 font-medium">Ali Hamza</span>
          </div>
          <span className="text-gray-700">·</span>
          <span className="font-mono text-xs text-gray-600">{timeAgo(post.createdAt)}</span>
          <span className="text-gray-700">·</span>
          <span className="font-mono text-xs text-gray-600 flex items-center gap-1"><Eye size={11}/> {post.views}</span>
        </div>

        {/* Content */}
        <div className="prose-custom mb-14"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Share */}
        <div className="border-t border-b border-white/[0.05] py-8 mb-14">
          <p className="font-mono text-xs text-gray-600 uppercase tracking-widest mb-4">// Share this post</p>
          <div className="flex flex-wrap gap-3">
            {[
              { label:"LinkedIn", icon:<Linkedin size={13}/>, color:"border-blue-500/20 text-blue-400 hover:bg-blue-500/10",
                url:`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
              { label:"Facebook", icon:<Facebook size={13}/>, color:"border-blue-600/20 text-blue-500 hover:bg-blue-600/10",
                url:`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
              { label:"X / Twitter", icon:<Twitter size={13}/>, color:"border-white/10 text-gray-400 hover:bg-white/5",
                url:`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}` },
            ].map(s => (
              <button key={s.label} onClick={() => window.open(s.url,"_blank")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-mono transition-all hover:scale-105 ${s.color}`}>
                {s.icon} {s.label}
              </button>
            ))}
            <button onClick={copyLink}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-mono transition-all hover:scale-105 ${copied?"border-green-500/30 text-green-400":"border-white/10 text-gray-500 hover:bg-white/5"}`}>
              {copied ? <CheckCircle size={13}/> : <Link2 size={13}/>}
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>

        {/* Comments */}
        <div>
          <h2 className="font-heading text-3xl text-white mb-8 flex items-center gap-3">
            <MessageSquare size={22} className="text-accent-cyan"/>
            Comments
            <span className="font-mono text-lg text-gray-700">({comments.length})</span>
          </h2>

          {/* Existing comments */}
          <div className="space-y-4 mb-10">
            {comments.length === 0 && (
              <p className="font-mono text-sm text-gray-700 py-6">// Be the first to comment!</p>
            )}
            {comments.map(c => (
              <div key={c.id} className="card-base p-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center flex-shrink-0">
                    <span className="font-heading text-accent-cyan text-sm">{c.name[0]?.toUpperCase()}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-white text-sm">{c.name}</span>
                      <span className="font-mono text-[0.58rem] text-gray-700">{timeAgo(c.createdAt)}</span>
                    </div>
                    <p className="text-gray-400 text-sm font-light leading-relaxed">{c.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Comment form */}
          <div className="card-base p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px]"
              style={{background:"linear-gradient(90deg,transparent,rgba(0,245,212,0.4),transparent)"}}/>
            <h3 className="font-heading text-2xl text-white mb-5">Leave a Comment</h3>

            {submitted ? (
              <div className="flex items-center gap-3 py-6">
                <div className="w-10 h-10 rounded-full bg-accent-green/10 border border-accent-green/30 flex items-center justify-center">
                  <CheckCircle size={18} className="text-accent-green"/>
                </div>
                <div>
                  <p className="text-white font-medium">Comment submitted!</p>
                  <p className="text-gray-500 text-sm font-light">It'll appear after admin approval. Thanks!</p>
                </div>
                <button onClick={()=>setSubmitted(false)} className="ml-auto text-gray-600 hover:text-gray-400 transition-colors"><X size={16}/></button>
              </div>
            ) : (
              <form onSubmit={submitComment} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-600 uppercase tracking-widest mb-1.5">Name *</label>
                    <input required value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}
                      className="form-input" placeholder="Your name"/>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-600 uppercase tracking-widest mb-1.5">Email (optional)</label>
                    <input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}
                      className="form-input" placeholder="Not displayed publicly"/>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-600 uppercase tracking-widest mb-1.5">Comment *</label>
                  <textarea required rows={4} value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))}
                    className="form-input resize-none" placeholder="Share your thoughts, questions, or feedback..."/>
                </div>
                <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
                  <Send size={13}/> {submitting?"Posting…":"Post Comment"}
                </button>
                <p className="text-gray-700 font-mono text-xs">// Comments are reviewed before appearing publicly.</p>
              </form>
            )}
          </div>
        </div>
      </article>

      <style>{`
        .prose-custom { color: #9ca3af; font-size: 1.05rem; line-height: 1.85; font-weight: 300; }
        .prose-custom h2 { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; color: white; margin: 2.5rem 0 1rem; letter-spacing: 0.03em; }
        .prose-custom h3 { font-family: 'Bebas Neue', sans-serif; font-size: 1.5rem; color: #e2e8f0; margin: 2rem 0 0.75rem; }
        .prose-custom p { margin-bottom: 1.25rem; }
        .prose-custom strong { color: #e2e8f0; font-weight: 500; }
        .prose-custom ul, .prose-custom ol { padding-left: 1.5rem; margin-bottom: 1.25rem; }
        .prose-custom li { margin-bottom: 0.5rem; }
        .prose-custom code { font-family: 'JetBrains Mono',monospace; font-size:0.82em; background:#0e1419; border:1px solid rgba(255,255,255,0.08); padding:0.15em 0.45em; border-radius:4px; color:#00f5d4; }
        .prose-custom pre { background:#0e1419; border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:1.25rem; overflow-x:auto; margin-bottom:1.5rem; }
        .prose-custom pre code { background:none; border:none; padding:0; color:#e2e8f0; }
        .prose-custom a { color:#00f5d4; text-decoration:underline; text-underline-offset:3px; }
        .prose-custom blockquote { border-left:2px solid #00f5d4; padding-left:1rem; margin:1.5rem 0; color:#6b7280; font-style:italic; }
        .prose-custom hr { border-color: rgba(255,255,255,0.08); margin: 2rem 0; }
      `}</style>
    </div>
  );
}
