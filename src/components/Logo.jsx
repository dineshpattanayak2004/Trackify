export default function Logo({ size = 48, className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={className}
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#1a1a2e" }} />
          <stop offset="100%" style={{ stopColor: "#0a0a0f" }} />
        </linearGradient>
        <linearGradient id="blueAccent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "#0099ff" }} />
          <stop offset="100%" style={{ stopColor: "#00ccff" }} />
        </linearGradient>
      </defs>
      <rect
        x="16" y="16" width="480" height="480" rx="100" ry="100"
        fill="url(#bgGrad)"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="2"
      />
      {/* T letter */}
      <polygon
        points="130,140 310,140 310,190 240,190 240,380 200,380 200,190 130,190"
        fill="white"
      />
      {/* F letter body */}
      <polygon
        points="260,200 380,200 380,250 300,250 300,290 370,290 370,330 300,330 300,380 260,380"
        fill="white"
      />
      {/* Blue accent on top right */}
      <polygon
        points="310,140 390,140 390,190 310,190 310,165"
        fill="url(#blueAccent)"
      />
    </svg>
  );
}