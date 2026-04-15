"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Twitter, Linkedin, Facebook, Link2, Send, MessageSquare, Eye, CheckCircle } from "lucide-react";

interface Post {
  id: string; slug: string; title: string; excerpt: string;
  content: string; coverImage: string; tags: string[];
  published: boolean; createdAt: string; views: number;
}

interface Comment {
  id: string; name: string; message: string; approved: boolean; createdAt: string;
}

function ShareButton({ icon, label, onClick, color }: { icon: React.ReactNode; label: string; onClick: () => void; color: string }) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-mono transition-all hover:scale-105 ${color}`}>
      {icon} {label}
    </button>
  );
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
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

  useEffect(() => {
    async function load() {
      try {
        const [postRes, cmtRes] = await Promise.all([
          fetch(`/api/posts/${slug}`),
          fetch(`/api/comments?postId=${slug}`),
        ]);
        if (postRes.ok) {
          const p = await postRes.json();
          setPost(p);
          // Load comments by post ID
          const cRes = await fetch(`/api/comments?postId=${p.id}`);
          if (cRes.ok) setComments(await cRes.json());
        }
      } catch {}
      setLoading(false);
    }
    load();
  }, [slug]);

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post!.id, ...form }),
      });
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
    } catch {}
    setSubmitting(false);
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = post?.title || "";

  const shareLinks = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="font-mono text-gray-700 animate-pulse">// Loading post...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center gap-4">
        <div className="font-heading text-6xl text-gray-800">404</div>
        <div className="font-mono text-gray-600">// Post not found</div>
        <Link href="/blog" className="btn-outline mt-4">← Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Simple top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-bg-base/90 backdrop-blur border-b border-white/[0.04]">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/blog" className="flex items-center gap-2 text-gray-500 hover:text-accent-cyan font-mono text-sm transition-colors">
            <ArrowLeft size={14} /> Blog
          </Link>
          <Link href="/" className="font-mono text-xs text-gray-600 hover:text-accent-cyan transition-colors">
            unity.dev
          </Link>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-6 pt-28 pb-24">
        {/* Cover image */}
        {post.coverImage && (
          <div className="rounded-2xl overflow-hidden mb-10 h-72 md:h-96">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map(tag => (
            <span key={tag} className="tag-pill text-[0.65rem]">{tag}</span>
          ))}
        </div>

        {/* Title */}
        <h1 className="font-heading text-[clamp(2.5rem,5vw,4.5rem)] text-white leading-none mb-6">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 pb-8 border-b border-white/[0.06] mb-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent-cyan/20 border border-accent-cyan/30 flex items-center justify-center">
              <span className="font-heading text-accent-cyan text-sm">U</span>
            </div>
            <span className="text-sm text-gray-400">Unity Dev</span>
          </div>
          <span className="text-gray-700">·</span>
          <span className="font-mono text-xs text-gray-600">{timeAgo(post.createdAt)}</span>
          <span className="text-gray-700">·</span>
          <span className="font-mono text-xs text-gray-600 flex items-center gap-1">
            <Eye size={11} /> {post.views} views
          </span>
        </div>

        {/* Content */}
        <div className="prose-custom mb-12"
          style={{
            color: "#9ca3af",
            fontSize: "1.05rem",
            lineHeight: "1.85",
            fontWeight: 300,
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Share section */}
        <div className="border-t border-b border-white/[0.06] py-8 mb-12">
          <p className="font-mono text-xs text-gray-600 uppercase tracking-widest mb-4">// Share this post</p>
          <div className="flex flex-wrap gap-3">
            <ShareButton
              icon={<Linkedin size={14} />} label="LinkedIn"
              color="border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
              onClick={() => window.open(shareLinks.linkedin, "_blank")} />
            <ShareButton
              icon={<Facebook size={14} />} label="Facebook"
              color="border-blue-600/20 text-blue-500 hover:bg-blue-600/10"
              onClick={() => window.open(shareLinks.facebook, "_blank")} />
            <ShareButton
              icon={<Twitter size={14} />} label="X / Twitter"
              color="border-white/10 text-gray-400 hover:bg-white/5"
              onClick={() => window.open(shareLinks.twitter, "_blank")} />
            <ShareButton
              icon={copied ? <CheckCircle size={14} /> : <Link2 size={14} />}
              label={copied ? "Copied!" : "Copy Link"}
              color={copied ? "border-green-500/30 text-green-400" : "border-white/10 text-gray-500 hover:bg-white/5"}
              onClick={copyLink} />
          </div>
        </div>

        {/* Comments */}
        <div>
          <h2 className="font-heading text-3xl text-white mb-8 flex items-center gap-3">
            <MessageSquare size={22} className="text-accent-cyan" />
            Comments
            <span className="font-mono text-lg text-gray-700">({comments.length})</span>
          </h2>

          {/* Existing comments */}
          <div className="space-y-4 mb-10">
            {comments.length === 0 && (
              <p className="font-mono text-sm text-gray-700 py-4">// Be the first to comment!</p>
            )}
            {comments.map(comment => (
              <div key={comment.id} className="card-base p-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center flex-shrink-0">
                    <span className="font-heading text-accent-cyan text-sm">{comment.name[0].toUpperCase()}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white text-sm">{comment.name}</span>
                      <span className="font-mono text-[0.6rem] text-gray-700">{timeAgo(comment.createdAt)}</span>
                    </div>
                    <p className="text-gray-400 text-sm font-light leading-relaxed">{comment.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Comment form */}
          <div className="card-base p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px]"
              style={{ background: "linear-gradient(90deg, transparent, rgba(0,245,212,0.4), transparent)" }} />

            <h3 className="font-heading text-2xl text-white mb-5">Leave a Comment</h3>

            {submitted ? (
              <div className="flex items-center gap-3 py-6">
                <CheckCircle className="text-accent-green" size={20} />
                <div>
                  <p className="text-white font-medium">Comment submitted!</p>
                  <p className="text-gray-500 text-sm font-light">It'll appear after approval. Thanks for engaging!</p>
                </div>
              </div>
            ) : (
              <form onSubmit={submitComment} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-600 uppercase tracking-widest mb-1.5">Name *</label>
                    <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="form-input" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-600 uppercase tracking-widest mb-1.5">Email (optional)</label>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="form-input" placeholder="Not displayed publicly" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-600 uppercase tracking-widest mb-1.5">Comment *</label>
                  <textarea required rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="form-input resize-none" placeholder="Share your thoughts, questions, or feedback..." />
                </div>
                <button type="submit" disabled={submitting}
                  className="btn-primary disabled:opacity-50">
                  <Send size={14} /> {submitting ? "Posting..." : "Post Comment"}
                </button>
                <p className="text-gray-700 font-mono text-xs">// Comments are reviewed before appearing publicly.</p>
              </form>
            )}
          </div>
        </div>
      </article>

      <style>{`
        .prose-custom h2 { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; color: white; margin: 2.5rem 0 1rem; letter-spacing: 0.03em; }
        .prose-custom h3 { font-family: 'Bebas Neue', sans-serif; font-size: 1.5rem; color: #e2e8f0; margin: 2rem 0 0.75rem; }
        .prose-custom p { margin-bottom: 1.25rem; }
        .prose-custom strong { color: #e2e8f0; font-weight: 500; }
        .prose-custom ul, .prose-custom ol { padding-left: 1.5rem; margin-bottom: 1.25rem; }
        .prose-custom li { margin-bottom: 0.5rem; }
        .prose-custom code { font-family: 'JetBrains Mono', monospace; font-size: 0.82em; background: #0e1419; border: 1px solid rgba(255,255,255,0.08); padding: 0.15em 0.45em; border-radius: 4px; color: #00f5d4; }
        .prose-custom pre { background: #0e1419; border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 1.25rem; overflow-x: auto; margin-bottom: 1.5rem; }
        .prose-custom pre code { background: none; border: none; padding: 0; color: #e2e8f0; }
        .prose-custom a { color: #00f5d4; text-decoration: underline; text-underline-offset: 3px; }
        .prose-custom blockquote { border-left: 2px solid #00f5d4; padding-left: 1rem; margin: 1.5rem 0; color: #6b7280; font-style: italic; }
      `}</style>
    </div>
  );
}
