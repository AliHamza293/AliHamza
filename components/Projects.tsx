"use client";
import { useState, useEffect } from "react";
import { X, CheckCircle2, Layers, Cpu, Youtube } from "lucide-react";

interface Project {
  id: string; title: string; genre: string; shortDesc: string;
  detailedDesc: string; features: string[]; techStack: string[];
  highlights: string[]; mediaType: "youtube" | "image" | "none";
  mediaUrl: string; status: "completed" | "in-progress";
  platform: string[]; order: number;
}

function getYouTubeId(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : null;
}

function MediaDisplay({ project, full = false }: { project: Project; full?: boolean }) {
  const ytId = project.mediaType === "youtube" ? getYouTubeId(project.mediaUrl) : null;

  if (project.mediaType === "youtube" && ytId) {
    if (full) {
      return (
        <div className="w-full aspect-video rounded-xl overflow-hidden">
          <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${ytId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
      );
    }
    return (
      <div className="relative w-full h-full">
        <img src={`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-2xl">
            <Youtube size={20} className="text-white ml-0.5" />
          </div>
        </div>
      </div>
    );
  }

  if (project.mediaType === "image" && project.mediaUrl) {
    return <img src={project.mediaUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />;
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-bg-hover">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute inset-0 border border-accent-cyan/20 rounded-lg animate-pulse" />
        <span className="text-2xl">🎮</span>
      </div>
      <span className="font-mono text-[0.6rem] text-gray-700 uppercase tracking-widest">{project.genre}</span>
    </div>
  );
}

function Modal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="relative">
          <div className="h-56 bg-bg-hover overflow-hidden">
            <MediaDisplay project={project} />
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-bg-base/80 border border-white/10 rounded flex items-center justify-center text-gray-400 hover:text-accent-cyan hover:border-accent-cyan/30 transition-all">
            <X size={14} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-6" style={{ background: "linear-gradient(to top, #0a0e12, transparent)" }}>
            <span className="tag-pill text-[0.6rem] mb-2 inline-block">{project.genre}</span>
            <h2 className="font-heading text-4xl text-white">{project.title}</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4 flex-wrap">
            {project.platform.map(p => (
              <span key={p} className="font-mono text-[0.6rem] text-gray-500 bg-bg-hover px-3 py-1 rounded uppercase tracking-wide">📱 {p}</span>
            ))}
            <div className="status-badge text-[0.6rem] py-1 px-3">
              <div className="status-dot w-1.5 h-1.5" />
              {project.status === "completed" ? "Shipped" : "In Progress"}
            </div>
          </div>

          {project.mediaType === "youtube" && project.mediaUrl && (
            <MediaDisplay project={project} full />
          )}

          <p className="text-gray-400 font-light leading-relaxed">{project.shortDesc}</p>
          <div>
            <div className="section-label text-[0.6rem] mb-2">// Project Overview</div>
            <p className="text-gray-500 font-light leading-relaxed text-sm">{project.detailedDesc}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3"><Layers size={13} className="text-accent-cyan" /><span className="font-mono text-[0.65rem] text-accent-cyan uppercase tracking-widest">Features</span></div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {project.features.map(f => (
                <li key={f} className="flex items-start gap-2 text-[0.8rem] text-gray-400 font-light">
                  <CheckCircle2 size={12} className="text-accent-green mt-0.5 flex-shrink-0" />{f}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3"><Cpu size={13} className="text-purple-400" /><span className="font-mono text-[0.65rem] text-purple-400 uppercase tracking-widest">Tech Stack</span></div>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map(t => <span key={t} className="tag-pill-purple font-mono text-[0.62rem] px-2 py-1 rounded">{t}</span>)}
            </div>
          </div>

          {project.highlights.length > 0 && (
            <div className="bg-bg-hover rounded-lg p-4 border border-white/[0.04]">
              <div className="font-mono text-[0.62rem] text-accent-amber uppercase tracking-widest mb-3">⚡ Key Achievements</div>
              <ul className="space-y-2">
                {project.highlights.map(h => (
                  <li key={h} className="flex items-start gap-2 text-sm text-gray-300 font-light">
                    <span className="text-accent-amber text-xs mt-0.5">▸</span>{h}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selected, setSelected] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects").then(r => r.json()).then(setProjects).finally(() => setLoading(false));
  }, []);

  return (
    <section id="projects" className="py-28 bg-bg-secondary relative overflow-hidden">
      <div className="absolute inset-0 grid-bg-sm opacity-30 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="section-label">// Projects</div>
            <h2 className="section-heading text-[clamp(2.5rem,5vw,4rem)] text-white">Games I've Built</h2>
            <p className="text-gray-500 font-light mt-2 max-w-md text-[1.02rem]">Real games. Real clients. Real results.</p>
          </div>
          <div className="status-badge flex-shrink-0"><div className="status-dot" />Open for Work</div>
        </div>

        {loading ? (
          <div className="text-center py-24 font-mono text-gray-700 animate-pulse">// Loading projects...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <article key={project.id} className="card-base overflow-hidden cursor-none group flex flex-col" onClick={() => setSelected(project)}>
                <div className="relative h-52 overflow-hidden flex-shrink-0">
                  <MediaDisplay project={project} />
                  <div className="absolute inset-0 bg-bg-base/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="font-mono text-[0.65rem] text-accent-cyan uppercase tracking-widest border border-accent-cyan/30 px-4 py-2 rounded">View Details →</span>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="font-mono text-[0.58rem] text-accent-cyan uppercase tracking-widest bg-bg-base/80 backdrop-blur px-2.5 py-1 rounded border border-accent-cyan/20">{project.genre}</span>
                  </div>
                  <div className="absolute top-3 right-3 flex gap-1">
                    {project.platform.map(p => <span key={p} className="font-mono text-[0.5rem] text-gray-400 bg-bg-base/80 px-2 py-1 rounded uppercase">{p}</span>)}
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <div className="flex items-center gap-1 bg-bg-base/80 px-2 py-1 rounded">
                      <span className={`w-1.5 h-1.5 rounded-full ${project.status === "completed" ? "bg-accent-green" : "bg-accent-amber animate-pulse"}`} />
                      <span className={`font-mono text-[0.5rem] uppercase ${project.status === "completed" ? "text-accent-green" : "text-accent-amber"}`}>{project.status === "completed" ? "Done" : "WIP"}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-heading text-2xl text-white leading-none mb-2 group-hover:text-accent-cyan transition-colors">{project.title}</h3>
                  <p className="text-gray-500 text-sm font-light leading-relaxed mb-4 flex-1">{project.shortDesc}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.techStack.slice(0, 4).map(t => <span key={t} className="tag-pill-purple font-mono text-[0.58rem] px-2 py-0.5 rounded">{t}</span>)}
                    {project.techStack.length > 4 && <span className="font-mono text-[0.58rem] text-gray-600 px-2 py-0.5">+{project.techStack.length - 4}</span>}
                  </div>
                  <ul className="space-y-1 mb-4">
                    {project.highlights.slice(0, 2).map(h => (
                      <li key={h} className="flex items-start gap-2 text-[0.75rem] text-gray-600 font-light">
                        <CheckCircle2 size={11} className="text-accent-green mt-0.5 flex-shrink-0" />{h}
                      </li>
                    ))}
                  </ul>
                  <button className="btn-outline w-full justify-center py-2 text-[0.68rem] mt-auto">Case Study →</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      {selected && <Modal project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
