"use client";
import { useState } from "react";
import { Send, MessageSquare, Clock, Globe, ArrowRight } from "lucide-react";

const infoItems = [
  {
    icon: <Clock size={15} />,
    label: "Response Time",
    value: "Within 24 hours",
    accent: "#00f5d4",
  },
  {
    icon: <Globe size={15} />,
    label: "Timezone",
    value: "PKT (UTC+5) — Flexible",
    accent: "#7b61ff",
  },
  {
    icon: <MessageSquare size={15} />,
    label: "Preferred Contact",
    value: "Email · Upwork · Fiverr",
    accent: "#ffbe0b",
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", budget: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // TODO: hook up to your preferred form backend (Formspree, EmailJS, etc.)
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    setSent(true);
  };

  return (
    <section id="contact" className="py-28 bg-bg-base relative overflow-hidden">
      <div className="absolute inset-0 grid-bg pointer-events-none" />

      {/* Ambient */}
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(123,97,255,0.06) 0%, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="section-label justify-center">// Contact</div>
          <h2 className="section-heading text-[clamp(2.5rem,5vw,4rem)] text-white mb-4">
            Let's Build Something Great
          </h2>
          <p className="text-gray-500 font-light max-w-lg mx-auto text-[1.02rem]">
            Have a game idea or need help with your project? I'm currently available for new freelance
            engagements — local and international.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-10">
          {/* FORM */}
          <div className="card-base p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px]"
              style={{ background: "linear-gradient(90deg, transparent, rgba(0,245,212,0.4), transparent)" }} />

            {sent ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-accent-green/10 border border-accent-green/30 flex items-center justify-center">
                  <span className="text-3xl">✓</span>
                </div>
                <h3 className="font-heading text-3xl text-white">Message Sent!</h3>
                <p className="text-gray-500 font-light max-w-xs">
                  I'll review your project details and get back to you within 24 hours.
                </p>
                <button
                  className="btn-outline mt-4"
                  onClick={() => { setSent(false); setForm({ name: "", email: "", budget: "", message: "" }); }}
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-mono text-[0.6rem] text-gray-600 uppercase tracking-widest mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="John Smith"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[0.6rem] text-gray-600 uppercase tracking-widest mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      className="form-input"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[0.6rem] text-gray-600 uppercase tracking-widest mb-2">
                    Project Budget
                  </label>
                  <select
                    className="form-input"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  >
                    <option value="" disabled>Select your budget range</option>
                    <option value="<500">Under $500</option>
                    <option value="500-1500">$500 – $1,500</option>
                    <option value="1500-5000">$1,500 – $5,000</option>
                    <option value="5000+">$5,000+</option>
                    <option value="discuss">Let's Discuss</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[0.6rem] text-gray-600 uppercase tracking-widest mb-2">
                    Project Details *
                  </label>
                  <textarea
                    required
                    rows={5}
                    className="form-input resize-none"
                    placeholder="Tell me about your game idea, what you need built, timeline, and any specific requirements..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <>
                      <div className="w-4 h-4 border border-bg-base border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message <Send size={14} />
                    </>
                  )}
                </button>

                <p className="text-gray-700 font-mono text-[0.58rem] text-center">
                  // No spam. No unsolicited follow-ups. Just a conversation.
                </p>
              </form>
            )}
          </div>

          {/* RIGHT — Info */}
          <div className="flex flex-col gap-5">
            {/* Info cards */}
            {infoItems.map((item) => (
              <div key={item.label} className="card-base p-5 flex items-center gap-4">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${item.accent}12`, color: item.accent }}
                >
                  {item.icon}
                </div>
                <div>
                  <div className="font-mono text-[0.58rem] text-gray-600 uppercase tracking-widest">{item.label}</div>
                  <div className="text-white text-sm font-medium mt-0.5">{item.value}</div>
                </div>
              </div>
            ))}

            {/* Platforms */}
            <div className="card-base p-5 space-y-3">
              <div className="section-label text-[0.58rem]">// Find Me On</div>
              {[
                { name: "Upwork", desc: "Freelance Platform", url: "#" },
                { name: "Fiverr", desc: "Project Marketplace", url: "#" },
                { name: "LinkedIn", desc: "Professional Network", url: "#" },
                { name: "GitHub", desc: "Code Portfolio", url: "#" },
              ].map((p) => (
                <a
                  key={p.name}
                  href={p.url}
                  className="flex items-center justify-between group p-2 rounded hover:bg-bg-hover transition-colors"
                >
                  <div>
                    <div className="text-white text-sm font-medium">{p.name}</div>
                    <div className="font-mono text-[0.55rem] text-gray-600 uppercase tracking-wide">{p.desc}</div>
                  </div>
                  <ArrowRight size={13} className="text-gray-700 group-hover:text-accent-cyan group-hover:translate-x-1 transition-all" />
                </a>
              ))}
            </div>

            {/* Availability note */}
            <div className="card-base p-5 border-accent-green/10">
              <div className="flex items-start gap-3">
                <div className="status-badge mt-0.5 flex-shrink-0">
                  <div className="status-dot" />
                  Live
                </div>
                <p className="text-gray-500 text-xs font-light leading-relaxed">
                  Currently accepting new clients for both short-term tasks and long-term game
                  development partnerships.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
