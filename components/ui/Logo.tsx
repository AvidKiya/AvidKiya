"use client";
import { useCms } from "@/contexts/CmsContext";

export function Logo({ size=36 }:{ size?: number }){
  const { cms, resolve } = useCms();
  const letter = cms.brand.logoLetter || "A";
  const img = cms.brand.logoImage;
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center justify-center rounded-xl overflow-hidden" style={{ width: size, height: size, background: "linear-gradient(135deg, var(--primary-solid), var(--primary))" }}>
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt="logo" className="w-full h-full object-cover" />
        ) : (
          <span className="text-white font-black" style={{ fontSize: size*0.5 }}>{letter}</span>
        )}
      </div>
      <div className="hidden sm:block leading-tight">
        <div className="font-black text-[15px]">{resolve(cms.brand.brandName)}</div>
        <div className="text-[10px] text-text-faint tracking-wider">AVIDKIYA OS</div>
      </div>
    </div>
  );
}
