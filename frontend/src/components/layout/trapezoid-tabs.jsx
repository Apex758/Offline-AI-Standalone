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

export function TrapezoidTabShape({ isActive, isHover, width, height, activeColor, inactiveColor, hoverColor }) {
  const fill = isActive
    ? (activeColor || "#ffffff")
    : isHover
      ? (hoverColor || "#ededf0")
      : (inactiveColor || "#e4e3e8");

  const drawH = isActive ? height + TAB_EXTEND : height;

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
      <path d={tabPath(width, drawH)} fill={fill} />
    </svg>
  );
}
