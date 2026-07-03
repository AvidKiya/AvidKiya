"use client";
import { useCms } from "@/contexts/CmsContext";
export default function GiftsPage(){
  const { cms, resolve } = useCms();
  return (
    <div>
      <h1 className="text-3xl font-black mb-2">{resolve(cms.gifts.title)}</h1>
      <p className="text-text-muted mb-8">{resolve(cms.gifts.subtitle)}</p>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <h2 className="font-black text-xl mb-4">{resolve(cms.gifts.downloadTitle)}</h2>
          <div className="space-y-3">
            {cms.gifts.downloads.map(d=>(
              <div key={d.id} className="flex items-center justify-between p-3 rounded-xl bg-bg-soft border border-border">
                <div>
                  <div className="font-bold">{resolve(d.title)}</div>
                  <div className="text-xs text-text-muted">{resolve(d.desc)}</div>
                </div>
                <a href={d.url} className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold">DL</a>
              </div>
            ))}
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <h2 className="font-black text-xl mb-4">حمایت</h2>
          <div className="space-y-3">
            {cms.gifts.donationLinks.map(dl=>(
              <a key={dl.id} href={dl.url} target="_blank" className="block p-4 rounded-xl text-white font-bold text-center" style={{ background: dl.platform==="zarinpal" ? "linear-gradient(90deg,#f59e0b,#fbbf24)" : dl.platform==="bmc" ? "linear-gradient(90deg,#f97316,#fb923c)" : "linear-gradient(90deg,#f59e0b,#eab308)" }}>
                {resolve(dl.label)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
