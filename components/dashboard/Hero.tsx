"use client";
import { useCms } from "@/contexts/CmsContext";
import { useApp } from "@/contexts/AppContext";
import { Editable } from "@/components/cms/Editable";
import { Icon } from "@/components/ui/Icon";

const ascii = `
 █████╗ ██╗   ██╗██╗██████╗ 
██╔══██╗██║   ██║██║██╔══██╗
███████║██║   ██║██║██║  ██║
██╔══██║╚██╗ ██╔╝██║██║  ██║
██║  ██║ ╚████╔╝ ██║██████╔╝
╚═╝  ╚═╝  ╚═══╝  ╚═╝╚═════╝ 
   DEVHUB OS
`;

export function Hero(){
  const { cms, resolve } = useCms();
  const { lang } = useApp();

  const printCV = ()=> { window.open('/resume', '_blank'); };

  return (
    <div className="glass rounded-[28px] relative overflow-hidden p-6 md:p-10 shadow-glow">
      <div className="scan-line" />
      <div className="grid lg:grid-cols-[1.4fr_.9fr] gap-8 items-center">
        <div>
          <pre className="text-[9px] md:text-[11px] leading-tight text-primary/80 font-mono mb-4 whitespace-pre overflow-x-auto">{ascii}</pre>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            <span className="text-[11px] text-success font-mono"><Editable path="dashboard.heroTag">{resolve(cms.dashboard.heroTag)}</Editable></span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black leading-tight">
            <Editable path="dashboard.heroTitleA">{resolve(cms.dashboard.heroTitleA)}</Editable><br/>
            <span className="text-gradient"><Editable path="dashboard.heroTitleB">{resolve(cms.dashboard.heroTitleB)}</Editable></span>
          </h1>
          <p className="text-text-muted mt-4 max-w-xl leading-relaxed">
            <Editable path="dashboard.heroDescription" multiline>{resolve(cms.dashboard.heroDescription)}</Editable>
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <a href="/projects" className="px-5 py-3 rounded-2xl font-bold text-white" style={{ background: "linear-gradient(120deg, var(--primary-solid), var(--primary))" }}>
              <Editable path="dashboard.ctaPrimary">{resolve(cms.dashboard.ctaPrimary)}</Editable>
            </a>
            <a href="/about#contact" className="px-5 py-3 rounded-2xl font-bold border border-border hover:bg-bg-soft">
              <Editable path="dashboard.ctaSecondary">{resolve(cms.dashboard.ctaSecondary)}</Editable>
            </a>
            <button onClick={printCV} className="px-5 py-3 rounded-2xl font-bold border border-border hover:bg-bg-soft text-sm">
              {lang==="fa" ? "چاپ رزومه" : "Print CV"}
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-6 text-[11px]">
            {["Go","TypeScript","Rust","Cloudflare","Postgres","Kubernetes"].map(ch=>(
              <span key={ch} className="px-3 py-1.5 rounded-full bg-bg-soft border border-border text-text-muted">{ch}</span>
            ))}
          </div>
        </div>

        {/* Profile / Hero Object */}
        <div className="glass rounded-[22px] p-5 bg-bg-elev/40">
          {cms.heroObject.kind !== "none" && cms.heroObject.src ? (
            cms.heroObject.kind === "model3d" ? (
              <div className="aspect-square rounded-xl bg-black/30 flex items-center justify-center text-xs text-text-faint">
                {/* model-viewer lazy */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cms.heroObject.posterSrc || "/brand/logo.png"} alt={cms.heroObject.alt || ""} className="max-h-full object-contain" />
                <script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js" async></script>
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cms.heroObject.src} alt={cms.heroObject.alt || ""} className="rounded-xl w-full object-cover aspect-square" />
            )
          ) : (
            <>
              <div className="text-xs text-text-faint mb-3 font-mono">profile.json</div>
              <div className="space-y-3 text-sm">
                <div><span className="text-text-faint">location:</span> {resolve(cms.identity.location)}</div>
                <div><span className="text-text-faint">email:</span> {cms.identity.email}</div>
                <div><span className="text-text-faint">experience:</span> {cms.identity.yearsExperience} yrs</div>
                <div><span className="text-text-faint">status:</span> <span className="text-success">available</span></div>
                <div><span className="text-text-faint">handle:</span> @{cms.identity.handle}</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
