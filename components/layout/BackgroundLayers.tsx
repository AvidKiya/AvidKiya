"use client";
export function BackgroundLayers(){
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="glow-orb" style={{ width: 420, height: 420, background: "radial-gradient(circle, rgba(93,122,230,0.28), transparent 70%)", top: "-120px", left: "-80px" }} />
      <div className="glow-orb" style={{ width: 340, height: 340, background: "radial-gradient(circle, rgba(52,211,153,0.18), transparent 70%)", bottom: "10%", right: "-60px" }} />
      <div className="glow-orb" style={{ width: 260, height: 260, background: "radial-gradient(circle, rgba(192,132,252,0.14), transparent 70%)", top: "45%", left: "55%" }} />
    </div>
  );
}
