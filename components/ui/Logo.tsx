"use client";

import { useCms } from "@/contexts/CmsContext";

/**
 * Renders the brand mark — an image if `brand.logoImage` is set,
 * otherwise the letter fallback (`brand.logoLetter`).
 */
export default function Logo({
  size = 36,
  radius = 10,
  bg = "var(--primary)",
  fg = "var(--on-primary)",
  className,
  style,
}: {
  size?: number;
  radius?: number;
  bg?: string;
  fg?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { state } = useCms();
  const img = state.brand.logoImage;

  const wrapper: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: radius,
    background: bg,
    color: fg,
    display: "grid",
    placeItems: "center",
    fontWeight: 700,
    fontSize: size * 0.55,
    overflow: "hidden",
    ...style,
  };

  if (img) {
    return (
      <div className={className} style={{ ...wrapper, background: "transparent" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img}
          alt="Logo"
          width={size}
          height={size}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
    );
  }
  return (
    <div className={className} style={wrapper}>
      {state.brand.logoLetter}
    </div>
  );
}
