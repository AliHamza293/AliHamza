export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-bg-secondary border-t border-white/[0.04] py-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-accent-cyan rounded flex items-center justify-center">
              <span className="font-heading text-bg-base text-xs leading-none">U</span>
            </div>
            <span className="font-mono text-[0.65rem] text-gray-600 tracking-widest uppercase">Unity Game Developer</span>
          </div>
          <div className="font-mono text-[0.58rem] text-gray-700 uppercase tracking-widest text-center">
            {`// Built with Next.js + Tailwind · ${year}`}
          </div>
          <div className="flex gap-5">
            {["#about","#skills","#projects","#services","/blog","#contact"].map(href => (
              <a key={href} href={href} className="font-mono text-[0.58rem] text-gray-700 hover:text-accent-cyan uppercase tracking-widest transition-colors">
                {href.replace("#","").replace("/","")}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
