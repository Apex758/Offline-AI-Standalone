import { useState } from "react";

const TABS = [
  { id: "one", label: "One" },
  { id: "two", label: "Two" },
  { id: "three", label: "Three" },
  { id: "four", label: "Four" },
];

const TAB_W = 130;
const TAB_H = 36;
const OVERLAP = -16;
const EXTEND = 4; // how far active tab extends below border line

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

function TabShape({ isActive, isHover, width, height }) {
  const fill = isActive ? "#ffffff" : isHover ? "#ededf0" : "#e4e3e8";

  /*
    Active tab: draw the path at (height + EXTEND) so the trapezoid
    shape itself is taller — the slope, the vertical left wall, and
    the bottom edge all extend below the border line naturally.
    No separate rectangle needed.
  */
  const drawH = isActive ? height + EXTEND : height;

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
        filter: isActive
          ? "drop-shadow(0 -2px 3px rgba(0,0,0,0.12))"
          : "drop-shadow(-3px 2px 4px rgba(0,0,0,0.35)) drop-shadow(0 2px 6px rgba(0,0,0,0.2))",
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main fill */}
      <path
        d={tabPath(width, drawH)}
        fill={fill}
      />
    </svg>
  );
}

export default function FolderTabs() {
  const [active, setActive] = useState("two");
  const [hovering, setHovering] = useState(null);

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <div style={styles.shell}>
        <div style={styles.tabBar}>
          <div style={styles.tabRow}>
            {TABS.map((tab, i) => {
              const isActive = active === tab.id;
              const isHover = hovering === tab.id && !isActive;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActive(tab.id)}
                  onMouseEnter={() => setHovering(tab.id)}
                  onMouseLeave={() => setHovering(null)}
                  style={{
                    ...styles.tab,
                    width: TAB_W,
                    height: TAB_H,
                    zIndex: isActive ? 30 : TABS.length - i,
                    marginRight: i < TABS.length - 1 ? OVERLAP : 0,
                  }}
                >
                  <TabShape
                    isActive={isActive}
                    isHover={isHover}
                    width={TAB_W}
                    height={TAB_H}
                  />

                  <span
                    style={{
                      ...styles.tabLabel,
                      color: isActive ? "#2a2a2a" : isHover ? "#555" : "#888",
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Border line: z-index 10, below active tab (30) but above inactive (1-4) */}
          <div style={styles.borderLine} />
        </div>

        {/* Content panel */}
        <div style={styles.content} key={active}>
          <h2 style={styles.contentTitle}>Lorem ipsum sit amet</h2>
          <p style={styles.contentSub}>
            Praesent risus nisi, iaculis nec condimentum vel, rhoncus vel dolor.
            Aenean nisi lectus, varius dapibus non quam.
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#58585e",
    fontFamily: "'DM Sans', sans-serif",
    padding: "2rem",
  },
  shell: {
    width: "100%",
    maxWidth: 560,
  },

  tabBar: {
    position: "relative",
    height: TAB_H,
    marginLeft: 0,
    marginRight: 8,
    overflow: "visible",
  },
  tabRow: {
    display: "flex",
    alignItems: "flex-end",
    height: "100%",
    position: "relative",
  },

  borderLine: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: -8,
    height: 1,
    background: "rgba(0,0,0,0.15)",
    zIndex: 10,
  },

  tab: {
    position: "relative",
    border: "none",
    background: "none",
    cursor: "pointer",
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    outline: "none",
    flexShrink: 0,
    overflow: "visible",
  },

  tabLabel: {
    position: "relative",
    zIndex: 2,
    fontSize: 14,
    letterSpacing: "0.01em",
    transition: "color 0.15s ease",
    whiteSpace: "nowrap",
    userSelect: "none",
    paddingRight: 6,
  },

  content: {
    background: "#ffffff",
    padding: "1.75rem 2rem 2rem",
    position: "relative",
    zIndex: 5,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: "#2a2a2a",
    letterSpacing: "-0.01em",
    marginBottom: "0.5rem",
  },
  contentSub: {
    fontSize: 13,
    color: "#999",
    lineHeight: 1.65,
  },
};
