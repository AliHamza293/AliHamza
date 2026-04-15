import { getPosts } from "@/lib/store";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function BlogPage() {
  const posts = getPosts(true);

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-bg-base pt-24 pb-24">
        {/* Header */}
        <div className="max-w-6xl mx-auto px-6 md:px-12 mb-16">
          <div className="section-label">// Blog & Insights</div>
          <h1 className="section-heading text-[clamp(3rem,6vw,5rem)] text-white mb-4">
            Game Dev<br />
            <span className="gradient-text">Insights</span>
          </h1>
          <p className="text-gray-500 font-light text-lg max-w-xl">
            Deep dives into Unity development, multiplayer architecture, and the realities
            of shipping games as a freelance developer.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-6 md:px-12">
          {posts.length === 0 ? (
            <div className="text-center py-24 text-gray-700 font-mono">// No posts yet. Check back soon.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <Link key={post.id} href={`/blog/${post.slug}`}
                  className={`card-base overflow-hidden group flex flex-col ${i === 0 ? "md:col-span-2 lg:col-span-2" : ""}`}>

                  {/* Cover image or gradient banner */}
                  <div className={`relative overflow-hidden flex-shrink-0 ${i === 0 ? "h-64" : "h-44"}`}>
                    {post.coverImage ? (
                      <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full relative"
                        style={{ background: `linear-gradient(135deg, ${["#00f5d4", "#7b61ff", "#ff6b35", "#ffbe0b"][i % 4]}15, #0e1419)` }}>
                        {/* Grid pattern inside card */}
                        <div className="absolute inset-0 grid-bg opacity-50" />
                        <div className="absolute bottom-4 left-4">
                          <span className="font-heading text-6xl opacity-10 text-white">{String(i + 1).padStart(2, "0")}</span>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-card/80 via-transparent to-transparent" />
                    {/* Tags overlay */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="tag-pill text-[0.58rem]">{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-mono text-[0.6rem] text-gray-600">{timeAgo(post.createdAt)}</span>
                      <span className="text-gray-800">·</span>
                      <span className="font-mono text-[0.6rem] text-gray-600">{post.views} views</span>
                    </div>

                    <h2 className={`font-heading text-white mb-3 group-hover:text-accent-cyan transition-colors leading-tight ${i === 0 ? "text-3xl" : "text-xl"}`}>
                      {post.title}
                    </h2>

                    <p className="text-gray-500 text-sm font-light leading-relaxed flex-1 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="mt-4 pt-4 border-t border-white/[0.04] flex items-center justify-between">
                      <span className="font-mono text-[0.65rem] text-accent-cyan uppercase tracking-widest group-hover:gap-2 transition-all">
                        Read More →
                      </span>
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-accent-cyan/20 border border-accent-cyan/30 flex items-center justify-center">
                          <span className="font-heading text-accent-cyan text-xs">U</span>
                        </div>
                        <span className="font-mono text-[0.6rem] text-gray-600">Unity Dev</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
