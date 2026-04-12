import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ── Streaming text types ───────────────────────────── */
interface TextSegment { speaker: string; text: string; }
interface LivePage { textSegments: TextSegment[]; [key: string]: unknown; }

const LINES_PER_PAGE = 4;
const MAX_LINE_CHARS = 65;

/* ── Layout pool & caption pool ──────────────────────── */
const LAYOUT_POOL = [
  "cover", "scene1", "scene2", "scene3", "scene4",
  "sceneCards", "sceneSplit",
];

const CAPTIONS = [
  "Once upon a loading time…",
  "A little hero appears…",
  "Through the enchanted forest…",
  "Friends along the way…",
  "The treasure is found!",
  "A new chapter begins…",
  "What happens next?",
  "Magic fills the air…",
  "Turning the page…",
  "The story unfolds…",
  "And then one day…",
  "Off on an adventure…",
];

let _lastLayoutDay = "";
let _lastCaptionDay = "";

function randomFrom(pool: string[], avoid: string) {
  const filtered = pool.filter(x => x !== avoid);
  return filtered[Math.floor(Math.random() * filtered.length)];
}

function makePage(id: number) {
  const layout = randomFrom(LAYOUT_POOL, _lastLayoutDay);
  const caption = randomFrom(CAPTIONS, _lastCaptionDay);
  _lastLayoutDay = layout;
  _lastCaptionDay = caption;
  return { id, layout, caption };
}

let _nextIdDay = 0;
function nextPage() {
  return makePage(_nextIdDay++);
}

/* ══════════════════════════════════════════════════════
   FLIP ENGINE — Bezier path + circular ease-out
   ══════════════════════════════════════════════════════ */

function circularEaseOut(t: number) {
  return Math.sqrt(1 - (t - 1) * (t - 1));
}

function bezierPoint(p0: {x:number,y:number}, p1: {x:number,y:number}, p2: {x:number,y:number}, p3: {x:number,y:number}, t: number) {
  const u = 1 - t;
  return {
    x: u*u*u*p0.x + 3*t*u*u*p1.x + 3*t*t*u*p2.x + t*t*t*p3.x,
    y: u*u*u*p0.y + 3*t*u*u*p1.y + 3*t*t*u*p2.y + t*t*t*p3.y,
  };
}

const CORNER_PATH = {
  p0: { x: 1.0, y: 1.0 },
  p1: { x: 0.85, y: 0.50 },
  p2: { x: 0.20, y: 0.50 },
  p3: { x: 0.0, y: 1.0 },
};

function getFlipState(rawT: number) {
  const t = circularEaseOut(rawT);
  const corner = bezierPoint(CORNER_PATH.p0, CORNER_PATH.p1, CORNER_PATH.p2, CORNER_PATH.p3, t);

  const foldRatio = CORNER_PATH.p0.x - corner.x;
  const rotateY = -foldRatio * 180;
  const liftAmount = CORNER_PATH.p0.y - corner.y;
  const rotateZ = -liftAmount * 8;
  const arcHeight = Math.max(0, liftAmount);
  const translateZ = arcHeight * 28;
  const bendAmount = Math.sin(t * Math.PI);
  const rotateX = bendAmount * 2.5;

  const originMigration = Math.min(1, foldRatio * 1.3);
  const originSmooth = originMigration * originMigration * (3 - 2 * originMigration);
  const originX = 100 - originSmooth * 100;
  const originY = 100 - originSmooth * 50;

  const sinT = Math.sin(t * Math.PI);
  return {
    rotateY, rotateZ, rotateX, translateZ,
    originX, originY, foldRatio, t,
    shadowBelow: 0.5 * sinT,
    foldEdgeShadow: 0.3 * sinT,
    foldEdgeHighlight: 0.2 * sinT,
    boxShadowSpread: sinT,
  };
}

/* ── Decorations ─────────────────────────────────────── */
const Star = ({ x, y, size = 12, delay = 0 }: { x: string; y: string; size?: number; delay?: number }) => (
  <svg style={{
    position: "absolute", left: x, top: y, width: size, height: size,
    animation: `twinkleDay 2s ease-in-out ${delay}s infinite`, pointerEvents: "none",
  }} viewBox="0 0 24 24">
    <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4 5.6 21.2 8 14 2 9.2h7.6z"
      fill="#FFD166" stroke="#F4A623" strokeWidth="0.5" />
  </svg>
);

const Cloud = ({ x, y, scale = 1, delay = 0 }: { x: string; y: string; scale?: number; delay?: number }) => (
  <svg style={{
    position: "absolute", left: x, top: y, width: 60 * scale, height: 30 * scale,
    animation: `floatCloudDay 6s ease-in-out ${delay}s infinite`, pointerEvents: "none", opacity: 0.55,
  }} viewBox="0 0 60 30">
    <ellipse cx="30" cy="20" rx="28" ry="10" fill="white" />
    <ellipse cx="20" cy="14" rx="14" ry="10" fill="white" />
    <ellipse cx="38" cy="12" rx="16" ry="12" fill="white" />
    <ellipse cx="28" cy="10" rx="10" ry="8" fill="white" />
  </svg>
);

/* ── Skeleton primitives ─────────────────────────────── */
const Bone = ({ w = "100%", h = 12, r = 8, style = {} }: { w?: number | string; h?: number; r?: number; style?: React.CSSProperties }) => (
  <div className="bone-day" style={{
    width: typeof w === "number" ? `${w}px` : w,
    height: `${h}px`, borderRadius: `${r}px`, ...style,
  }} />
);

const Circle = ({ size = 48, style = {} }: { size?: number; style?: React.CSSProperties }) => (
  <div className="bone-day" style={{
    width: size, height: size, borderRadius: "50%", flexShrink: 0, ...style,
  }} />
);

/* ── Page layouts ────────────────────────────────────── */
const CoverPage = () => (
  <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, position: "relative" }}>
    <Star x="12%" y="10%" size={16} delay={0} />
    <Star x="80%" y="8%" size={13} delay={0.5} />
    <Star x="65%" y="75%" size={11} delay={1} />
    <Bone w={180} h={24} r={12} style={{ opacity: 0.7 }} />
    <Bone w={120} h={14} r={8} style={{ opacity: 0.5 }} />
    <div style={{ marginTop: 6 }}><Bone w={90} h={90} r={45} style={{ opacity: 0.4 }} /></div>
    <Bone w={100} h={12} r={8} style={{ opacity: 0.5, marginTop: 2 }} />
  </div>
);

const Scene1Page = () => (
  <div style={{ display: "flex", height: "100%", gap: 20, alignItems: "center", padding: "0 6px" }}>
    <div style={{ flex: "0 0 38%", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <Bone w="100%" h={110} r={14} />
      <div style={{ display: "flex", gap: 5 }}><Circle size={16} /><Circle size={16} /><Circle size={16} /></div>
    </div>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 9 }}>
      <Bone w="75%" h={16} r={8} />
      <Bone w="100%" h={10} /><Bone w="92%" h={10} /><Bone w="100%" h={10} /><Bone w="55%" h={10} />
      <div style={{ height: 4 }} />
      <Bone w="100%" h={10} /><Bone w="80%" h={10} />
    </div>
  </div>
);

const Scene2Page = () => (
  <div style={{ display: "flex", height: "100%", gap: 20, alignItems: "center", padding: "0 6px", flexDirection: "row-reverse" }}>
    <div style={{ flex: "0 0 42%", display: "flex", flexDirection: "column", gap: 7 }}>
      <Bone w="100%" h={80} r={14} />
      <div style={{ display: "flex", gap: 7 }}><Bone w="48%" h={48} r={10} /><Bone w="48%" h={48} r={10} /></div>
    </div>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 9 }}>
      <Bone w="65%" h={16} r={8} />
      <Bone w="100%" h={10} /><Bone w="88%" h={10} /><Bone w="100%" h={10} /><Bone w="70%" h={10} />
      <Bone w="100%" h={10} /><Bone w="50%" h={10} />
    </div>
  </div>
);

const Scene3Page = () => (
  <div style={{ display: "flex", height: "100%", gap: 18, alignItems: "center", padding: "0 6px" }}>
    <div style={{ flex: "0 0 33%", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <Circle size={60} />
      <Bone w={70} h={12} r={7} />
      <div style={{ display: "flex", gap: 10, marginTop: 2 }}><Circle size={34} /><Circle size={34} /></div>
      <div style={{ display: "flex", gap: 6 }}><Bone w={42} h={9} r={5} /><Bone w={42} h={9} r={5} /></div>
    </div>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 9 }}>
      <Bone w="70%" h={16} r={8} />
      <Bone w="100%" h={10} /><Bone w="100%" h={10} /><Bone w="85%" h={10} />
      <Bone w="100%" h={10} /><Bone w="60%" h={10} />
      <div style={{ height: 3 }} />
      <Bone w="100%" h={10} /><Bone w="38%" h={10} />
    </div>
  </div>
);

const Scene4Page = () => (
  <div style={{ display: "flex", height: "100%", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, position: "relative" }}>
    <Star x="8%" y="8%" size={14} delay={0.2} />
    <Star x="88%" y="12%" size={18} delay={0.7} />
    <Star x="18%" y="72%" size={11} delay={1.2} />
    <Star x="80%" y="68%" size={13} delay={0.4} />
    <Bone w={140} h={85} r={18} />
    <Bone w={160} h={18} r={9} />
    <Bone w={200} h={10} /><Bone w={140} h={10} />
    <Bone w={110} h={28} r={14} style={{ marginTop: 4, opacity: 0.6 }} />
  </div>
);

const SceneCardsPage = () => (
  <div style={{ display: "flex", height: "100%", flexDirection: "column", gap: 12, padding: "0 6px", justifyContent: "center" }}>
    <Bone w="50%" h={16} r={8} />
    <div style={{ display: "flex", gap: 10 }}>
      {[1,2,3].map(k => (
        <div key={k} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          background: "rgba(232,201,160,0.15)", borderRadius: 12, padding: "14px 8px" }}>
          <Circle size={40} />
          <Bone w="80%" h={10} />
          <Bone w="60%" h={8} />
        </div>
      ))}
    </div>
    <Bone w="90%" h={10} />
    <Bone w="75%" h={10} />
  </div>
);

const SceneSplitPage = () => (
  <div style={{ display: "flex", height: "100%", gap: 14, alignItems: "stretch", padding: "0 4px" }}>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 9 }}>
      <Bone w="60%" h={16} r={8} />
      <Bone w="100%" h={10} /><Bone w="90%" h={10} /><Bone w="100%" h={10} />
      <Bone w="45%" h={10} />
      <div style={{ height: 6 }} />
      <div style={{ display: "flex", gap: 8 }}>
        <Bone w={70} h={28} r={14} />
        <Bone w={70} h={28} r={14} />
      </div>
    </div>
    <div style={{ width: 2, background: "rgba(200,170,130,0.15)", borderRadius: 1, margin: "10px 0" }} />
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 9 }}>
      <Bone w="100%" h={65} r={12} />
      <Bone w="80%" h={10} />
      <Bone w="100%" h={10} />
      <Bone w="70%" h={10} />
      <Bone w="55%" h={10} />
    </div>
  </div>
);

/* ── Streaming text page ────────────────────────────── */
const StreamingPageDay = ({ lines, fillerCount }: { lines: string[]; fillerCount: number }) => (
  <div style={{ display: "flex", height: "100%", flexDirection: "column", justifyContent: "center", gap: 10, padding: "8px 14px" }}>
    {lines.map((line, i) => (
      <p key={i} style={{
        margin: 0, fontSize: 11, lineHeight: 1.55,
        color: "var(--text-label)", fontWeight: line.includes(":") ? 500 : 400,
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        animation: "fadeInLineDay 0.35s ease both",
        animationDelay: `${i * 0.08}s`,
      }}>
        {line}
      </p>
    ))}
    {Array.from({ length: fillerCount }).map((_, i) => (
      <Bone key={`f${i}`} w={`${60 + ((i * 17) % 35)}%`} h={10} />
    ))}
  </div>
);

const PAGE_MAP: Record<string, React.FC> = {
  cover: CoverPage, scene1: Scene1Page, scene2: Scene2Page,
  scene3: Scene3Page, scene4: Scene4Page,
  sceneCards: SceneCardsPage, sceneSplit: SceneSplitPage,
};

export default function KidsStorybookSkeletonDay({ livePages = [] }: { livePages?: LivePage[] }) {
  const [pages, setPages] = useState(() => [nextPage(), nextPage(), nextPage()]);
  const [flipping, setFlipping] = useState(false);
  const [flipProgress, setFlipProgress] = useState(0);
  const [caption, setCaption] = useState(() => pages[1]?.caption || "");
  const animRef = useRef<number | null>(null);
  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevTextPageRef = useRef(0);

  /* ── Flatten livePages into display lines ── */
  const allLines = useMemo(() => {
    const out: string[] = [];
    for (const p of livePages) {
      for (const seg of (p.textSegments || [])) {
        const prefix = seg.speaker && seg.speaker !== 'narrator' ? `${seg.speaker}: ` : '';
        const full = prefix + seg.text;
        out.push(full.length > MAX_LINE_CHARS ? full.slice(0, MAX_LINE_CHARS - 1) + '…' : full);
      }
    }
    return out;
  }, [livePages]);

  const hasStreaming = allLines.length > 0;
  const textPageIndex = Math.max(0, Math.ceil(allLines.length / LINES_PER_PAGE) - 1);

  const doFlip = useCallback(() => {
    if (flipping) return;
    setFlipping(true);
    setFlipProgress(0);

    const start = performance.now();
    const duration = 2200;

    const animate = () => {
      const raw = Math.min((performance.now() - start) / duration, 1);
      setFlipProgress(raw);

      if (raw < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setPages(prev => {
          const fresh = nextPage();
          const newPages = [prev[1], prev[2], fresh];
          setCaption(newPages[1].caption);
          return newPages;
        });
        setFlipping(false);
        setFlipProgress(0);
      }
    };
    animRef.current = requestAnimationFrame(animate);
  }, [flipping]);

  useEffect(() => {
    autoRef.current = setTimeout(doFlip, 3800);
    return () => { if (autoRef.current) clearTimeout(autoRef.current); };
  }, [pages, doFlip]);

  /* ── Flip when a new text page fills up ── */
  useEffect(() => {
    if (hasStreaming && textPageIndex > prevTextPageRef.current) {
      prevTextPageRef.current = textPageIndex;
      doFlip();
    }
  }, [textPageIndex, hasStreaming, doFlip]);

  useEffect(() => () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    if (autoRef.current) clearTimeout(autoRef.current);
  }, []);

  /* ── Current text slice for the visible page ── */
  const currentTextLines = hasStreaming
    ? allLines.slice(textPageIndex * LINES_PER_PAGE, (textPageIndex + 1) * LINES_PER_PAGE)
    : [];
  const fillerCount = hasStreaming ? Math.max(0, LINES_PER_PAGE - currentTextLines.length) : 0;

  const fs = flipping ? getFlipState(flipProgress) : null;

  return (
    <div style={{
      height: "100%", width: "100%",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "linear-gradient(170deg, #a8d8ea 0%, #c5e8f2 30%, #f2e6d0 65%, #edd9bb 100%)",
      fontFamily: "'Baloo 2', 'Nunito', 'Comic Sans MS', cursive, sans-serif",
      padding: "20px 16px", overflow: "hidden", position: "relative",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&display=swap');

        @keyframes twinkleDay {
          0%, 100% { opacity: 0.35; transform: scale(0.8) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.15) rotate(12deg); }
        }
        @keyframes floatCloudDay {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(14px); }
        }
        @keyframes shimmerDay {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
        @keyframes bounceCaptionDay {
          0% { opacity: 0; transform: translateY(10px) scale(0.95); }
          60% { transform: translateY(-2px) scale(1.02); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        .bone-day {
          background: linear-gradient(90deg, #e8c9a0 0%, #f5e1c4 40%, #faf0e0 50%, #f5e1c4 60%, #e8c9a0 100%);
          background-size: 400px 100%;
          animation: shimmerDay 1.8s ease-in-out infinite;
        }

        .storybook-outer-day {
          position: relative;
          width: min(94vw, 600px);
          aspect-ratio: 1.5;
        }

        .book-body-day {
          width: 100%; height: 100%;
          position: relative;
          transform-style: preserve-3d;
          perspective: 1600px;
          transform: rotateX(2deg);
        }

        .page-card-day {
          position: absolute; inset: 0;
          transform-style: preserve-3d;
          will-change: transform;
        }

        .page-side-day {
          position: absolute; inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 6px 16px 16px 6px;
          overflow: hidden;
          box-sizing: border-box;
          padding: 22px 24px;
        }

        .page-front-day {
          background: #fdf6ea;
          background-image:
            radial-gradient(circle at 15% 85%, rgba(255,200,150,0.12) 0%, transparent 50%),
            radial-gradient(circle at 85% 15%, rgba(180,220,255,0.1) 0%, transparent 50%);
        }

        .page-front-day::before {
          content: '';
          position: absolute; inset: 0;
          background: repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(170,150,120,0.04) 28px, rgba(170,150,120,0.04) 29px);
          pointer-events: none;
        }

        .page-back-day {
          background: linear-gradient(135deg, #f0e4d0, #e6d4bc);
          transform: rotateY(180deg);
        }

        .back-pattern-day {
          position: absolute; inset: 0;
          opacity: 0.05;
          background-image:
            radial-gradient(circle at 25% 25%, #8b5e3c 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, #8b5e3c 1px, transparent 1px);
          background-size: 20px 20px;
          pointer-events: none;
        }

        .back-deco-day {
          position: absolute; inset: 14px;
          border: 2px dashed rgba(170,130,90,0.12);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
        }

        .shadow-overlay-day {
          position: absolute; inset: 0;
          pointer-events: none;
          border-radius: 6px 16px 16px 6px;
          z-index: 2;
        }

        .stack-edge-day {
          position: absolute;
          border-radius: 4px 14px 14px 4px;
          z-index: -1;
        }

        .story-caption-day {
          margin-top: 16px; font-size: 16px; font-weight: 600;
          color: #8b5e3c; letter-spacing: 0.2px;
          animation: bounceCaptionDay 0.55s ease forwards;
          text-shadow: 0 1px 2px rgba(255,255,255,0.5);
          height: 24px;
        }

        .loading-dots-day {
          display: flex; gap: 6px; margin-top: 18px; align-items: center;
        }

        .loading-dot-day {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(201,74,74,0.35);
          animation: dotPulseDay 1.4s ease-in-out infinite;
        }

        @keyframes dotPulseDay {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.35; }
          40% { transform: scale(1.4); opacity: 1; }
        }
        @keyframes fadeInLineDay {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <Cloud x="3%" y="2%" scale={1.2} delay={0} />
      <Cloud x="68%" y="0%" scale={0.85} delay={2.5} />
      <Cloud x="38%" y="5%" scale={0.65} delay={4.5} />
      <Star x="93%" y="6%" size={15} delay={0.3} />
      <Star x="2%" y="14%" size={11} delay={1.6} />

      <div style={{
        fontSize: 12, fontWeight: 700, letterSpacing: 3.5,
        textTransform: "uppercase", color: "var(--text-muted)",
        marginBottom: 12, opacity: 0.6,
      }}>
        ✦ Loading Your Story ✦
      </div>

      <div className="storybook-outer-day">
        <div className="book-body-day">
          <div className="stack-edge-day" style={{ inset: "3px 1px -3px 4px", background: "#f0e4d0" }} />
          <div className="stack-edge-day" style={{ inset: "6px 2px -6px 7px", background: "#e8d8c2" }} />
          <div className="stack-edge-day" style={{ inset: "9px 3px -9px 10px", background: "#dfd0b6" }} />

          {pages[0] && (() => {
            const Content = PAGE_MAP[pages[0].layout];
            return (
              <div className="page-card-day" style={{ transformOrigin: "0% 50%", transform: "rotateY(-180deg)", zIndex: 1 }}>
                <div className="page-side-day page-front-day"><Content /></div>
                <div className="page-side-day page-back-day">
                  <div className="back-pattern-day" />
                  <div className="back-deco-day">
                    <svg width="44" height="44" viewBox="0 0 44 44" opacity="0.12">
                      <circle cx="22" cy="22" r="18" stroke="#8b5e3c" strokeWidth="1.2" fill="none" />
                      <path d="M22 6L22 38M6 22L38 22" stroke="#8b5e3c" strokeWidth="0.6" />
                      <circle cx="22" cy="22" r="7" stroke="#8b5e3c" strokeWidth="0.6" fill="none" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })()}

          {pages[2] && (() => {
            const Content = PAGE_MAP[pages[2].layout];
            return (
              <div className="page-card-day" style={{ transformOrigin: "0% 50%", transform: "rotateY(0deg)", zIndex: 2 }}>
                <div className="page-side-day page-front-day">
                  <Content />
                  {fs && (() => {
                    const sweep = 100 - fs.foldRatio * 140;
                    return (
                      <div className="shadow-overlay-day" style={{
                        background: `linear-gradient(to left,
                          transparent ${sweep + 30}%,
                          rgba(40,25,10,${fs.shadowBelow * 0.15}) ${sweep + 18}%,
                          rgba(40,25,10,${fs.shadowBelow * 0.45}) ${sweep + 6}%,
                          rgba(40,25,10,${fs.shadowBelow * 0.35}) ${sweep}%,
                          rgba(40,25,10,${fs.shadowBelow * 0.1}) ${sweep - 10}%,
                          transparent ${sweep - 25}%
                        )`,
                      }} />
                    );
                  })()}
                </div>
                <div className="page-side-day page-back-day">
                  <div className="back-pattern-day" />
                  <div className="back-deco-day">
                    <svg width="44" height="44" viewBox="0 0 44 44" opacity="0.12">
                      <circle cx="22" cy="22" r="18" stroke="#8b5e3c" strokeWidth="1.2" fill="none" />
                      <path d="M22 6L22 38M6 22L38 22" stroke="#8b5e3c" strokeWidth="0.6" />
                      <circle cx="22" cy="22" r="7" stroke="#8b5e3c" strokeWidth="0.6" fill="none" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })()}

          {pages[1] && (() => {
            const BoneContent = PAGE_MAP[pages[1].layout];
            let cardStyle: React.CSSProperties;
            let shadowEl: React.ReactNode = null;

            if (flipping && fs) {
              const bsBlur = 8 + fs.boxShadowSpread * 18;
              const bsOpacity = fs.boxShadowSpread * 0.25;
              const bsOffsetX = (fs.t < 0.5 ? -1 : 1) * fs.boxShadowSpread * 6;
              const sweepX = 100 - fs.foldRatio * 130;

              cardStyle = {
                transformOrigin: `${fs.originX}% ${fs.originY}%`,
                transform: `rotateY(${fs.rotateY}deg) rotateZ(${fs.rotateZ}deg) rotateX(${fs.rotateX}deg) translateZ(${fs.translateZ}px)`,
                boxShadow: `${bsOffsetX}px ${3 + fs.boxShadowSpread * 5}px ${bsBlur}px rgba(40,25,10,${bsOpacity})`,
                borderRadius: "6px 16px 16px 6px",
                zIndex: 10,
              };

              shadowEl = (
                <div className="shadow-overlay-day" style={{
                  background: `linear-gradient(to left,
                    transparent ${sweepX + 22}%,
                    rgba(255,255,240,${fs.foldEdgeHighlight * 0.7}) ${sweepX + 10}%,
                    rgba(255,255,240,${fs.foldEdgeHighlight}) ${sweepX + 5}%,
                    rgba(40,25,10,${fs.foldEdgeShadow * 0.5}) ${sweepX}%,
                    rgba(40,25,10,${fs.foldEdgeShadow * 0.3}) ${sweepX - 5}%,
                    transparent ${sweepX - 18}%
                  )`,
                }} />
              );
            } else {
              cardStyle = {
                transformOrigin: "100% 100%",
                transform: "rotateY(0deg)",
                zIndex: 5,
              };
            }

            return (
              <div className="page-card-day" style={cardStyle}>
                <div className="page-side-day page-front-day">
                  {hasStreaming
                    ? <StreamingPageDay lines={currentTextLines} fillerCount={fillerCount} />
                    : <BoneContent />}
                  {shadowEl}
                </div>
                <div className="page-side-day page-back-day">
                  <div className="back-pattern-day" />
                  <div className="back-deco-day">
                    <svg width="44" height="44" viewBox="0 0 44 44" opacity="0.12">
                      <circle cx="22" cy="22" r="18" stroke="#8b5e3c" strokeWidth="1.2" fill="none" />
                      <path d="M22 6L22 38M6 22L38 22" stroke="#8b5e3c" strokeWidth="0.6" />
                      <circle cx="22" cy="22" r="7" stroke="#8b5e3c" strokeWidth="0.6" fill="none" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      <div className="story-caption-day" key={hasStreaming ? `p${textPageIndex}` : caption}>
        {hasStreaming ? `Writing page ${textPageIndex + 1}…` : caption}
      </div>

      <div className="loading-dots-day">
        <div className="loading-dot-day" style={{ animationDelay: "0s" }} />
        <div className="loading-dot-day" style={{ animationDelay: "0.2s" }} />
        <div className="loading-dot-day" style={{ animationDelay: "0.4s" }} />
      </div>
    </div>
  );
}
