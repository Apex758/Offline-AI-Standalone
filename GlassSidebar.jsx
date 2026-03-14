import { useState, useEffect } from "react";

/* ── icon bank ── */
const I = {
  home: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  globe: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  star: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  share: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  grid: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  puzzle: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 01-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 10-3.214 3.214c.446.166.855.497.925.968a.979.979 0 01-.276.837l-1.61 1.61a2.404 2.404 0 01-1.705.707 2.402 2.402 0 01-1.704-.706l-1.568-1.568a1.026 1.026 0 00-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 11-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 00-.289-.877l-1.568-1.568A2.402 2.402 0 011.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.303.515.077.877.528 1.073 1.01a2.5 2.5 0 103.259-3.259c-.482-.196-.933-.558-1.01-1.073-.05-.336.062-.676.303-.917l1.525-1.525A2.402 2.402 0 0112 2c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 113.237 3.237c-.464.18-.894.527-.967 1.02z"/></svg>,
  settings: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.32 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  bar: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  book: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
  users: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  dot: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" fill="currentColor" stroke="none"/></svg>,
  bell: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  clock: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  archive: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>,
  folder: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>,
  search: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  chevron: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  plus: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  expand: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>,
  collapse: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 5 5 12 12 19"/></svg>,
};

const railItems = [
  { icon: "home", label: "Home" },
  { icon: "globe", label: "Explore" },
  { icon: "star", label: "Favorites" },
  { icon: "share", label: "Connections" },
  { icon: "grid", label: "Apps" },
  { icon: "puzzle", label: "Extensions" },
];

const documents = [
  { name: "System Management", count: 12, children: [
    { name: "2025 Updates", count: 2, children: [
      { name: "Hiring Process", count: 4 },
      { name: "Billing Process", count: 3 },
    ]},
  ]},
  { name: "Fundamentals", count: 4 },
  { name: "Off Grid Servers", count: 5 },
];

/* ── Folder tree ── */
function FolderTree({ items, depth = 0 }) {
  const [expanded, setExpanded] = useState({});
  return (
    <div>{items.map(item => (
      <div key={item.name}>
        <button onClick={() => item.children && setExpanded(p => ({ ...p, [item.name]: !p[item.name] }))}
          className="nav-item" style={{ paddingLeft: 12 + depth * 18 }}>
          {item.children && (
            <span style={{ transform: expanded[item.name] ? "rotate(90deg)" : "rotate(0)", transition: "transform 0.25s cubic-bezier(.4,0,.2,1)", display: "flex", opacity: 0.4 }}>{I.chevron}</span>
          )}
          <span style={{ opacity: 0.4, display: "flex" }}>{I.folder}</span>
          <span style={{ flex: 1, textAlign: "left" }}>{item.name}</span>
          <span className="badge">{item.count}</span>
        </button>
        {item.children && expanded[item.name] && <FolderTree items={item.children} depth={depth + 1} />}
      </div>
    ))}</div>
  );
}

/* ── main ── */
export default function GlassSidebar() {
  const [open, setOpen] = useState(true);
  const [activeRail, setActiveRail] = useState(0);
  const [activeProject, setActiveProject] = useState("Dashboard");
  const [searchDoc, setSearchDoc] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { requestAnimationFrame(() => setMounted(true)); }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Manrope:wght@400;500;600;700&display=swap');

        .glass-root {
          --glass-bg: rgba(255,255,255,0.12);
          --glass-bg-strong: rgba(255,255,255,0.18);
          --glass-border: rgba(255,255,255,0.2);
          --glass-border-subtle: rgba(255,255,255,0.08);
          --glass-blur: 28px;
          --text-primary: rgba(255,255,255,0.92);
          --text-secondary: rgba(255,255,255,0.45);
          --text-dim: rgba(255,255,255,0.25);
          --accent: rgba(160,210,255,0.7);
          --hover: rgba(255,255,255,0.08);
          --active: rgba(255,255,255,0.14);
          --badge-bg: rgba(255,255,255,0.1);
          --divider: rgba(255,255,255,0.07);
          --rail-width: 64px;
          --panel-width: 280px;
          font-family: 'Outfit', sans-serif;
        }

        .glass-scene {
          width: 100vw; height: 100vh;
          background:
            radial-gradient(ellipse at 20% 50%, rgba(30,60,120,0.9) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 20%, rgba(80,40,100,0.7) 0%, transparent 50%),
            radial-gradient(ellipse at 60% 80%, rgba(20,80,80,0.6) 0%, transparent 50%),
            linear-gradient(160deg, #0a0e1a 0%, #111827 40%, #0c1322 100%);
          overflow: hidden;
          position: relative;
        }

        /* floating orbs behind glass */
        .orb {
          position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.4;
          animation: drift 20s ease-in-out infinite alternate;
        }
        .orb-1 { width: 400px; height: 400px; background: #3b82f6; top: -10%; left: 10%; animation-delay: 0s; }
        .orb-2 { width: 300px; height: 300px; background: #8b5cf6; bottom: -5%; right: 20%; animation-delay: -7s; }
        .orb-3 { width: 250px; height: 250px; background: #06b6d4; top: 50%; left: 40%; animation-delay: -14s; }

        @keyframes drift {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.05); }
          66% { transform: translate(-20px, 30px) scale(0.95); }
          100% { transform: translate(10px, -10px) scale(1.02); }
        }

        /* grid pattern overlay */
        .grid-overlay {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        /* glass panels */
        .glass-rail {
          backdrop-filter: blur(var(--glass-blur)) saturate(1.6);
          -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(1.6);
          background: rgba(10,15,30,0.55);
          border: 1px solid var(--glass-border-subtle);
          border-radius: 20px;
          box-shadow:
            0 8px 32px rgba(0,0,0,0.3),
            inset 0 1px 0 rgba(255,255,255,0.06);
          transition: transform 0.4s cubic-bezier(.4,0,.2,1), opacity 0.4s;
        }

        .glass-panel {
          backdrop-filter: blur(var(--glass-blur)) saturate(1.4);
          -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(1.4);
          background: rgba(255,255,255,0.06);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          box-shadow:
            0 8px 32px rgba(0,0,0,0.2),
            inset 0 1px 0 rgba(255,255,255,0.08);
          transition: width 0.45s cubic-bezier(.4,0,.2,1),
                      opacity 0.35s cubic-bezier(.4,0,.2,1),
                      transform 0.45s cubic-bezier(.4,0,.2,1);
        }

        /* nav items */
        .nav-item {
          display: flex; align-items: center; gap: 10px; width: 100%;
          padding: 8px 12px; background: none; border: none; cursor: pointer;
          color: var(--text-primary); font-size: 13.5px; font-family: inherit;
          border-radius: 12px; font-weight: 400; transition: background 0.2s;
        }
        .nav-item:hover { background: var(--hover); }
        .nav-item.active { background: var(--active); font-weight: 600; }

        .badge {
          font-size: 11px; color: var(--text-secondary); background: var(--badge-bg);
          border-radius: 10px; padding: 2px 9px; font-weight: 500;
          font-family: 'Manrope', sans-serif;
        }

        .section-label {
          font-size: 10px; font-weight: 600; letter-spacing: 1.5px;
          text-transform: uppercase; color: var(--text-dim);
          padding: 14px 12px 6px; font-family: 'Manrope', sans-serif;
        }

        .divider { height: 1px; background: var(--divider); margin: 6px 12px; }

        .rail-btn {
          width: 42px; height: 42px; display: flex; align-items: center;
          justify-content: center; border-radius: 14px; border: none;
          cursor: pointer; transition: all 0.25s cubic-bezier(.4,0,.2,1);
          position: relative; overflow: hidden;
        }
        .rail-btn::before {
          content: ''; position: absolute; inset: 0; border-radius: 14px;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.25s;
        }
        .rail-btn:hover::before { opacity: 1; }

        .search-box {
          display: flex; align-items: center; gap: 8px;
          padding: 7px 12px; margin: 0 8px 8px;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px; transition: border-color 0.2s, background 0.2s;
        }
        .search-box:focus-within {
          border-color: rgba(160,210,255,0.3);
          background: rgba(255,255,255,0.09);
        }
        .search-box input {
          border: none; background: none; outline: none;
          font-size: 13px; color: var(--text-primary); width: 100%;
          font-family: inherit;
        }
        .search-box input::placeholder { color: var(--text-dim); }

        .toggle-btn {
          position: absolute; top: 18px; right: -14px; z-index: 10;
          width: 28px; height: 28px; border-radius: 50%;
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.18);
          color: var(--text-secondary); cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.25s; box-shadow: 0 2px 12px rgba(0,0,0,0.2);
        }
        .toggle-btn:hover {
          background: rgba(255,255,255,0.2); color: var(--text-primary);
          transform: scale(1.1);
        }

        .vert-label {
          writing-mode: vertical-rl; text-orientation: mixed;
          transform: rotate(180deg); font-size: 8px; letter-spacing: 2.5px;
          color: var(--text-dim); font-weight: 700; text-transform: uppercase;
          font-family: 'Manrope', sans-serif;
        }

        /* scrollbar */
        .scroll-area::-webkit-scrollbar { width: 4px; }
        .scroll-area::-webkit-scrollbar-track { background: transparent; }
        .scroll-area::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1); border-radius: 4px;
        }
        .scroll-area::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }

        /* stagger animations */
        .stagger-item {
          opacity: 0; transform: translateX(-8px);
          animation: slideIn 0.35s cubic-bezier(.4,0,.2,1) forwards;
        }
        @keyframes slideIn {
          to { opacity: 1; transform: translateX(0); }
        }

        /* shimmer on glass */
        .shimmer {
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          border-radius: 20px 20px 0 0;
        }

        /* main area placeholder */
        .main-placeholder {
          flex: 1; display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.08); font-size: 80px; font-weight: 700;
          letter-spacing: -4px; user-select: none;
        }
      `}</style>

      <div className="glass-root glass-scene">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="grid-overlay" />

        <div style={{ display: "flex", height: "100%", position: "relative", zIndex: 1 }}>

          {/* ── ICON RAIL ── */}
          <div className="glass-rail" style={{
            width: "var(--rail-width)", display: "flex", flexDirection: "column",
            alignItems: "center", padding: "20px 0", gap: 4, margin: 12,
            opacity: mounted ? 1 : 0, transform: mounted ? "translateX(0)" : "translateX(-20px)",
          }}>
            <div className="shimmer" />
            <div style={{ color: "var(--accent)", marginBottom: 14, padding: 4 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
                <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
              </svg>
            </div>
            <div style={{ width: 28, height: 1, background: "var(--glass-border-subtle)", marginBottom: 8 }} />

            {railItems.map((item, i) => (
              <button key={item.label} className="rail-btn" title={item.label}
                onClick={() => setActiveRail(i)} style={{
                  color: activeRail === i ? "var(--accent)" : "var(--text-dim)",
                  background: activeRail === i ? "rgba(160,210,255,0.1)" : "transparent",
                }}>
                {I[item.icon]}
              </button>
            ))}

            <div style={{ flex: 1 }} />
            <div className="vert-label" style={{ marginBottom: 12 }}>Reagle 2025</div>
            <div style={{ width: 28, height: 1, background: "var(--glass-border-subtle)", marginBottom: 6 }} />

            <button className="rail-btn" title="Settings"
              style={{ color: "var(--text-dim)", background: "transparent" }}>
              {I.settings}
            </button>
          </div>

          {/* ── EXPANDABLE PANEL ── */}
          <div className="glass-panel" style={{
            width: open ? "var(--panel-width)" : 0,
            opacity: open ? 1 : 0,
            transform: open ? "translateX(0)" : "translateX(-12px)",
            margin: "12px 0 12px -6px", display: "flex", flexDirection: "column",
            overflow: "hidden", position: "relative", minWidth: 0,
          }}>
            <div className="shimmer" />

            {/* Toggle button */}
            <button className="toggle-btn" onClick={() => setOpen(o => !o)}
              style={{ transform: open ? "" : "translateX(50px) rotate(180deg)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>

            {/* inner content */}
            <div style={{ width: 280, minWidth: 280 }}>
              {/* User header */}
              <div style={{ padding: "20px 16px 14px", display: "flex", alignItems: "center", gap: 11 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 14, flexShrink: 0,
                  background: "linear-gradient(135deg, rgba(160,210,255,0.3), rgba(139,92,246,0.3))",
                  border: "1px solid rgba(255,255,255,0.12)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--text-primary)", fontSize: 14, fontWeight: 600,
                  fontFamily: "'Manrope', sans-serif",
                }}>JD</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 5, color: "var(--text-primary)" }}>
                    John Doe <span style={{ opacity: 0.3, fontSize: 10 }}>▾</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    customerpop@gmail.com
                  </div>
                </div>
              </div>

              <div className="divider" />

              {/* Scrollable nav */}
              <div className="scroll-area" style={{ flex: 1, overflowY: "auto", padding: "2px 8px 16px", maxHeight: "calc(100vh - 110px)" }}>
                <div className="section-label">Projects</div>
                {[
                  { icon: I.bar, name: "Dashboard", badge: 0 },
                  { icon: I.book, name: "Library" },
                  { icon: I.users, name: "Shared Projects" },
                ].map((item, i) => (
                  <button key={item.name}
                    className={`nav-item stagger-item ${activeProject === item.name ? "active" : ""}`}
                    style={{ animationDelay: `${i * 50}ms` }}
                    onClick={() => setActiveProject(item.name)}>
                    <span style={{ opacity: activeProject === item.name ? 0.9 : 0.4, display: "flex" }}>{item.icon}</span>
                    <span style={{ flex: 1, textAlign: "left" }}>{item.name}</span>
                    {item.badge !== undefined && <span className="badge">{item.badge}</span>}
                  </button>
                ))}

                <div className="divider" />
                <div className="section-label">Status</div>
                {[
                  { icon: I.dot, name: "New", badge: 3 },
                  { icon: I.bell, name: "Updates", badge: 2 },
                  { icon: I.users, name: "Team Review" },
                ].map((item, i) => (
                  <button key={item.name} className="nav-item stagger-item"
                    style={{ animationDelay: `${(i + 3) * 50}ms` }}>
                    <span style={{ opacity: 0.4, display: "flex" }}>{item.icon}</span>
                    <span style={{ flex: 1, textAlign: "left" }}>{item.name}</span>
                    {item.badge !== undefined && <span className="badge">{item.badge}</span>}
                  </button>
                ))}

                <div className="divider" />
                <div className="section-label">History</div>
                {[
                  { icon: I.clock, name: "Recently Edited" },
                  { icon: I.archive, name: "Archive" },
                ].map((item, i) => (
                  <button key={item.name} className="nav-item stagger-item"
                    style={{ animationDelay: `${(i + 6) * 50}ms` }}>
                    <span style={{ opacity: 0.4, display: "flex" }}>{item.icon}</span>
                    <span style={{ flex: 1, textAlign: "left" }}>{item.name}</span>
                  </button>
                ))}

                <div className="divider" />

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 12px 6px" }}>
                  <span className="section-label" style={{ padding: 0 }}>Documents</span>
                  <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-dim)", padding: 2, display: "flex", borderRadius: 8, transition: "color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "var(--text-secondary)"}
                    onMouseLeave={e => e.currentTarget.style.color = "var(--text-dim)"}>
                    {I.plus}
                  </button>
                </div>

                <div className="search-box">
                  <span style={{ opacity: 0.3, display: "flex" }}>{I.search}</span>
                  <input type="text" placeholder="Search" value={searchDoc} onChange={e => setSearchDoc(e.target.value)} />
                </div>

                <FolderTree items={documents} />
              </div>
            </div>
          </div>

          {/* Collapsed expand button */}
          {!open && (
            <button onClick={() => setOpen(true)} className="rail-btn"
              style={{
                position: "absolute", left: 82, top: 24, zIndex: 10,
                color: "var(--text-secondary)", background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              }}>
              {I.expand}
            </button>
          )}

          {/* Main area placeholder */}
          <div className="main-placeholder">
            <span style={{ opacity: mounted ? 1 : 0, transition: "opacity 1s 0.3s" }}>Dashboard</span>
          </div>
        </div>
      </div>
    </>
  );
}
