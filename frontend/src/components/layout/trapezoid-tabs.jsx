import React from "react";

export const TAB_W = 180;
export const TAB_H = 36;
export const TAB_OVERLAP = -16;
export const TAB_EXTEND = 4;

function tabPath(w, h) {
  const r = 5;
  const rightRun = 28;

  return [
    `M 0,${h}`,
    `L 0,${r}`,
    `Q 0,0 ${r},0`,
    `L ${w - rightRun - r},0`,
    `Q ${w - rightRun},0 ${w - rightRun + r * 0.7},${r * 0.7}`,
    `L ${w},${h}`,
    `Z`,
  ].join(" ");
}

// Darken a hex color by a percentage (0-1)
function darkenHex(hex, amount) {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, Math.round(((num >> 16) & 0xff) * (1 - amount)));
  const g = Math.max(0, Math.round(((num >> 8) & 0xff) * (1 - amount)));
  const b = Math.max(0, Math.round((num & 0xff) * (1 - amount)));
  return `rgb(${r},${g},${b})`;
}

let gradientCounter = 0;

export function TrapezoidTabShape({ isActive, isHover, width, height, activeColor, inactiveColor, hoverColor }) {
  const gradientId = React.useMemo(() => `tab-grad-${gradientCounter++}`, []);

  const drawH = isActive ? height + TAB_EXTEND : height;
  const darkerColor = activeColor ? darkenHex(activeColor, 0.18) : "#1e40af";

  const fill = isActive
    ? `url(#${gradientId})`
    : isHover
      ? (hoverColor || "#ededf0")
      : (inactiveColor || "#e4e3e8");

  return (
    <svg
      width={width}
      height={drawH}
      viewBox={`0 0 ${width} ${drawH}`}
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        display: "block",
        overflow: "visible",
        pointerEvents: "none",
        filter: isActive
          ? "drop-shadow(0 -2px 3px rgba(0,0,0,0.12))"
          : "drop-shadow(-3px 2px 4px rgba(0,0,0,0.35)) drop-shadow(0 2px 6px rgba(0,0,0,0.2))",
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={activeColor || "#3b82f6"} />
          <stop offset="100%" stopColor={darkerColor} />
        </linearGradient>
      </defs>
      <path d={tabPath(width, drawH)} fill={fill} />
    </svg>
  );
}
