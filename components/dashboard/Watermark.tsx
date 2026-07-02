export default function Watermark() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-0 overflow-hidden pointer-events-none">
      <svg
        className="watermark w-full max-w-4xl scale-150 rotate-12"
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#21f1a8" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="400" height="400" fill="url(#grid)" />
        <text
          x="200"
          y="220"
          textAnchor="middle"
          fontFamily="Fira Sans, monospace"
          fontSize="72"
          fontWeight="700"
          fill="#21f1a8"
          opacity="0.5"
        >
          AVIDKIYA
        </text>
      </svg>
    </div>
  );
}
