import json
import re
import webbrowser
from pathlib import Path

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

GRADE_ORDER = ["Kindergarten", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"]

SUBJECT_COLORS = {
    "Language Arts":  "#34d399",   # emerald
    "Mathematics":    "#60a5fa",   # blue
    "Science":        "#fb923c",   # orange
    "Social Studies": "#c084fc",   # purple
}
KINDER_COLOR = "#2dd4bf"   # teal

SKIP_FILES = {"OHPC Kindergarten Guidelines 14November2024_curriculum.json"}


# ---------------------------------------------------------------------------
# Data loading
# ---------------------------------------------------------------------------

def extract_unit_name(filename: str) -> str:
    stem = Path(filename).stem
    stem = stem.replace("_curriculum", "")
    stem = re.sub(r"^kindergarten-", "", stem)
    return stem.replace("-", " ").title()


def load_curriculum_data(directory: Path) -> list:
    records = []
    for json_file in sorted(directory.glob("*_curriculum.json")):
        if json_file.name in SKIP_FILES:
            continue
        with open(json_file, encoding="utf-8") as f:
            curriculum = json.load(f)
        meta    = curriculum.get("metadata", {})
        grade   = meta.get("grade", "Unknown Grade")
        subject = meta.get("subject", "Unknown")
        if grade == "Kindergarten" and subject == "Unknown":
            subject = extract_unit_name(json_file.name)
        records.append({"grade": grade, "subject": subject,
                         "strands": curriculum.get("strands", [])})
    return records


# ---------------------------------------------------------------------------
# Data organisation
# ---------------------------------------------------------------------------

def organize_by_grade(data):
    out = {}
    for item in data:
        out.setdefault(item["grade"], {})[item["subject"]] = item["strands"]
    return out


def organize_by_subject(data):
    out = {}
    for item in data:
        out.setdefault(item["subject"], {})[item["grade"]] = item["strands"]
    return out


# ---------------------------------------------------------------------------
# Tree builders
# ---------------------------------------------------------------------------

def _trunc(text, n=90):
    text = (text or "").strip()
    return text[:n] + "…" if len(text) > n else text


def _strand_children(strands):
    children = []
    for strand in strands:
        elo_nodes = []
        for elo in strand.get("essential_learning_outcomes", []):
            code  = elo.get("elo_code", "")
            desc  = _trunc(elo.get("elo_description", ""), 100)
            label = f"{code}: {desc}" if code else desc
            sco_nodes = [
                {"name": _trunc(s, 100), "type": "sco"}
                for s in elo.get("specific_curriculum_outcomes", [])[:12]
                if s.strip()
            ]
            elo_nodes.append({"name": label, "type": "elo", "children": sco_nodes})
        children.append({"name": strand.get("strand_name", "Unnamed Strand"),
                          "type": "strand", "children": elo_nodes})
    return children


def build_by_grade_tree(by_grade):
    root = {"name": "OECS Curriculum", "type": "root", "children": []}
    for grade in GRADE_ORDER:
        if grade not in by_grade:
            continue
        root["children"].append({"name": grade, "type": "grade", "children": [
            {"name": subject, "type": "subject", "subject": subject,
             "children": _strand_children(strands)}
            for subject, strands in sorted(by_grade[grade].items())
        ]})
    return root


def build_by_subject_tree(by_subject):
    root    = {"name": "OECS Curriculum", "type": "root", "children": []}
    regular = ["Language Arts", "Mathematics", "Science", "Social Studies"]
    kinder_units = sorted(s for s in by_subject if s not in regular)

    for subject in regular:
        if subject not in by_subject:
            continue
        grades = by_subject[subject]
        root["children"].append({
            "name": subject, "type": "subject", "subject": subject,
            "children": [
                {"name": grade, "type": "grade",
                 "children": _strand_children(grades[grade])}
                for grade in GRADE_ORDER if grade in grades
            ]
        })

    if kinder_units:
        root["children"].append({"name": "Kindergarten Units", "type": "grade", "children": [
            {"name": unit, "type": "subject", "subject": unit,
             "children": _strand_children(list(by_subject[unit].values())[0])}
            for unit in kinder_units if unit in by_subject
        ]})
    return root


# ---------------------------------------------------------------------------
# HTML generation  (uses plain-string template – no f-string escaping issues)
# ---------------------------------------------------------------------------

HTML_TEMPLATE = r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>OECS Curriculum Tree</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<script src="https://d3js.org/d3.v7.min.js"></script>
<style>
/* ── Reset ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; overflow: hidden; }
body {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  background: #060d1b;
  color: #e2e8f0;
}

/* ── Stars background ── */
#starfield {
  position: fixed; inset: 0; z-index: 0;
  pointer-events: none;
}

/* ── Header ── */
#header {
  position: relative; z-index: 20;
  background: rgba(6,13,27,.75);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(255,255,255,.07);
  padding: 11px 18px;
  display: flex; align-items: center; justify-content: space-between;
  box-shadow: 0 1px 30px rgba(0,0,0,.5);
}
.hdr-title { font-size: 1.15em; font-weight: 700; letter-spacing: -.01em;
  background: linear-gradient(120deg, #fde68a 0%, #34d399 50%, #60a5fa 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.hdr-sub { font-size: .72em; color: #64748b; margin-top: 2px; }

#ctrl { display: flex; gap: 7px; align-items: center; flex-wrap: wrap; }
.btn {
  padding: 6px 14px; border: none; border-radius: 20px;
  cursor: pointer; font-size: .78em; font-weight: 600;
  font-family: inherit; transition: all .25s; white-space: nowrap;
}
.btn-on {
  background: linear-gradient(135deg, #fde68a, #f59e0b);
  color: #1a0a00;
  box-shadow: 0 0 18px rgba(251,191,36,.45);
}
.btn-off {
  background: rgba(255,255,255,.07);
  color: #94a3b8;
  border: 1px solid rgba(255,255,255,.12);
}
.btn-off:hover { background: rgba(255,255,255,.14); color: #e2e8f0; }

/* ── Layout ── */
#app { display: flex; height: calc(100vh - 52px); position: relative; z-index: 1; }

/* ── Sidebar ── */
#sidebar {
  width: 195px; flex-shrink: 0;
  background: rgba(6,13,27,.65);
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255,255,255,.06);
  padding: 13px 11px; overflow-y: auto;
}
#sidebar::-webkit-scrollbar { width: 3px; }
#sidebar::-webkit-scrollbar-thumb { background: rgba(255,255,255,.15); border-radius: 2px; }
.sb-head {
  font-size: .65em; font-weight: 700; letter-spacing: .1em;
  text-transform: uppercase; color: #475569; margin: 12px 0 6px;
}
.sb-head:first-child { margin-top: 0; }
.fi {
  display: flex; align-items: center; gap: 7px;
  padding: 4px 5px; border-radius: 7px; cursor: pointer;
  font-size: .81em; color: #94a3b8; transition: background .18s;
}
.fi:hover { background: rgba(255,255,255,.06); color: #e2e8f0; }
.fi input[type=checkbox] { accent-color: #fde68a; cursor: pointer; flex-shrink: 0; }
.cdot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.leg { display: flex; align-items: center; gap: 7px; margin-bottom: 6px; font-size: .77em; color: #64748b; }
.ls  { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; display: inline-block; }

/* ── Canvas ── */
#canvas { flex: 1; overflow: hidden; position: relative; }
#tree-svg { width: 100%; height: 100%; display: block; }

/* ── D3 nodes / links ── */
.link { fill: none; stroke-linecap: round; }
.node { cursor: pointer; }

/* ── Tooltip ── */
#tip {
  position: fixed; z-index: 200; display: none; pointer-events: none;
  filter: drop-shadow(0 8px 32px rgba(0,0,0,.6));
}
.tip-card {
  background: rgba(8,16,36,.97);
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 14px; padding: 12px 15px;
  font-size: 12px; line-height: 1.65; max-width: 270px;
  animation: tipIn .14s ease;
}
@keyframes tipIn {
  from { opacity: 0; transform: translateY(-6px) scale(.97); }
  to   { opacity: 1; transform: translateY(0)   scale(1);    }
}

/* ── Info bar ── */
#infobar {
  position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%);
  background: rgba(255,255,255,.05); backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,.07);
  padding: 4px 14px; border-radius: 20px;
  font-size: 10.5px; color: #475569; pointer-events: none; white-space: nowrap;
}

/* ── Zoom controls ── */
#zc { position: absolute; top: 10px; right: 10px; display: flex; flex-direction: column; gap: 4px; }
.zb {
  width: 30px; height: 30px;
  background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.12);
  border-radius: 8px; cursor: pointer; color: #94a3b8; font-size: 18px;
  display: flex; align-items: center; justify-content: center;
  transition: all .2s; backdrop-filter: blur(10px);
}
.zb:hover { background: rgba(255,255,255,.16); color: white; }

/* ── Animations ── */
@keyframes rootPulse {
  0%,100% { opacity: .18; r: 28px; }
  50%      { opacity: .35; r: 34px; }
}
@keyframes subjectGlow {
  0%,100% { opacity: .12; }
  50%      { opacity: .28; }
}
@keyframes leafFloat {
  0%,100% { transform: translate(var(--lx), var(--ly)); }
  50%      { transform: translate(var(--lx), calc(var(--ly) - 3px)); }
}
@keyframes scoPulse {
  0%,100% { opacity: .6; }
  50%      { opacity: 1; }
}
.root-halo { animation: rootPulse 3.5s ease-in-out infinite; }
.subject-halo { animation: subjectGlow 4s ease-in-out infinite; }
.sco-dot { animation: scoPulse 2.5s ease-in-out infinite; }
</style>
</head>
<body>

<canvas id="starfield"></canvas>

<div id="header">
  <div>
    <div class="hdr-title">&#127795; OECS Curriculum Tree</div>
    <div class="hdr-sub">Kindergarten &rarr; Grade 5 &nbsp;&middot;&nbsp; Interactive knowledge tree</div>
  </div>
  <div id="ctrl">
    <button class="btn btn-on"  id="btn-grade"   onclick="switchView('grade')">By Grade</button>
    <button class="btn btn-off" id="btn-subject" onclick="switchView('subject')">By Subject</button>
    <button class="btn btn-off" onclick="expandAll()">Expand All</button>
    <button class="btn btn-off" onclick="collapseAll()">Collapse</button>
    <button class="btn btn-off" onclick="resetZoom()">Reset View</button>
  </div>
</div>

<div id="app">
  <div id="sidebar">
    <div class="sb-head">Grades</div>
    <div id="gf"></div>
    <div class="sb-head">Subjects</div>
    <div id="sf"></div>
    <div class="sb-head">Legend</div>
    <div id="lf"></div>
  </div>

  <div id="canvas">
    <svg id="tree-svg">
      <defs>
        <filter id="f-gold" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="f-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="f-sm" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <!-- leaf shape for ELO/SCO terminal nodes -->
        <path id="leaf-shape"
          d="M0,-8 C4,-7 7,-3 6,2 Q3,7 0,9 Q-3,7 -6,2 C-7,-3 -4,-7 0,-8 Z"/>
      </defs>

      <!-- ground strip (fixed in SVG, not in zoom group) -->
      <rect id="ground" x="0" y="0" width="100%" height="55"
        fill="url(#grd-grad)" opacity="0"/>

      <!-- main zoom/pan group -->
      <g id="tg"></g>
    </svg>

    <div id="tip"><div class="tip-card" id="tip-inner"></div></div>
    <div id="infobar">Click to expand &nbsp;&middot;&nbsp; Scroll to zoom &nbsp;&middot;&nbsp; Drag to pan</div>
    <div id="zc">
      <button class="zb" onclick="zoomIn()">+</button>
      <button class="zb" onclick="zoomOut()">&minus;</button>
    </div>
  </div>
</div>

<script>
// ═══════════════════════════════════════════════════════════════════════════
// DATA  (injected by Python)
// ═══════════════════════════════════════════════════════════════════════════
const GRADE_TREE   = __GRADE_JSON__;
const SUBJECT_TREE = __SUBJECT_JSON__;
const SUB_COLORS   = __COLORS_JSON__;
const K_COLOR      = "__KINDER_COLOR__";

const ALL_GRADES   = ["Kindergarten","Grade 1","Grade 2","Grade 3","Grade 4","Grade 5"];
const ALL_SUBJECTS = ["Language Arts","Mathematics","Science","Social Studies","Kindergarten Units"];

// ═══════════════════════════════════════════════════════════════════════════
// STAR FIELD
// ═══════════════════════════════════════════════════════════════════════════
(function () {
  const cv = document.getElementById('starfield');
  const cx = cv.getContext('2d');
  let stars = [];
  function resize() {
    cv.width = innerWidth; cv.height = innerHeight;
    stars = Array.from({length: 160}, () => ({
      x: Math.random() * cv.width,
      y: Math.random() * cv.height * .85,
      r: Math.random() * 1.1 + .2,
      a: Math.random(), da: (Math.random()-.5)*.004,
    }));
  }
  function draw() {
    cx.clearRect(0,0,cv.width,cv.height);
    // Sky gradient
    const g = cx.createLinearGradient(0,0,0,cv.height);
    g.addColorStop(0,  '#0a1628');
    g.addColorStop(.7, '#060d1b');
    g.addColorStop(1,  '#071a10');
    cx.fillStyle = g; cx.fillRect(0,0,cv.width,cv.height);
    // Stars
    stars.forEach(s => {
      s.a = Math.max(.05, Math.min(1, s.a+s.da));
      if (s.a<=.05||s.a>=1) s.da=-s.da;
      cx.beginPath(); cx.arc(s.x,s.y,s.r,0,Math.PI*2);
      cx.fillStyle = `rgba(255,255,255,${s.a})`; cx.fill();
    });
    requestAnimationFrame(draw);
  }
  resize(); draw();
  window.addEventListener('resize', resize);
})();

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════
function subColor(name) { return SUB_COLORS[name] || K_COLOR; }

function ancestorSubColor(d) {
  let n = d;
  while (n) {
    if (n.data.type === 'subject') return subColor(n.data.subject || n.data.name);
    n = n.parent;
  }
  return '#94a3b8';
}

function nColor(d) {
  const t = d.data.type, s = d.data.subject;
  if (t === 'root')    return '#fde68a';
  if (t === 'grade')   return '#cbd5e1';
  if (t === 'subject') return subColor(s);
  if (t === 'strand')  return d3.color(ancestorSubColor(d)).brighter(.7).formatHex();
  if (t === 'elo')     return d3.color(ancestorSubColor(d)).brighter(1.1).formatHex();
  if (t === 'sco')     return '#64748b';
  return '#64748b';
}

function nRadius(d) {
  return [22, 15, 11, 8, 6, 4][Math.min(d.depth, 5)];
}

function linkW(d) {
  return [10, 6, 4, 2.5, 1.8, 1.2][Math.min(d.source.depth, 5)];
}

function glowFilter(d) {
  if (d.data.type === 'root') return 'url(#f-gold)';
  if (d.depth <= 2) return 'url(#f-glow)';
  return 'url(#f-sm)';
}

// Is this a leaf (currently no children)?
function isLeaf(d) { return !d.children && !d._children; }

// ═══════════════════════════════════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════════════════════════════════
function buildSidebar() {
  const gf = document.getElementById('gf');
  ALL_GRADES.forEach(gr => {
    const d = document.createElement('div'); d.className = 'fi';
    const id = 'g_' + gr.replace(/\s/g,'_');
    d.innerHTML = `<input type="checkbox" checked id="${id}" onchange="toggleGrade('${gr}',this.checked)">
                   <label for="${id}" style="cursor:pointer">${gr}</label>`;
    gf.appendChild(d);
  });

  const sf = document.getElementById('sf');
  ALL_SUBJECTS.forEach(s => {
    const col = SUB_COLORS[s] || K_COLOR;
    const d = document.createElement('div'); d.className = 'fi';
    const id = 's_' + s.replace(/\s/g,'_');
    d.innerHTML = `<input type="checkbox" checked id="${id}" onchange="toggleSub('${s}',this.checked)">
                   <span class="cdot" style="background:${col}"></span>
                   <label for="${id}" style="cursor:pointer">${s}</label>`;
    sf.appendChild(d);
  });

  const LEG = [
    ['#fde68a', 'OECS Curriculum (root)'],
    ['#cbd5e1', 'Grade level'],
    [null,       'Subject (color-coded)'],
    [null,       'Strand'],
    [null,       'Essential Learning Outcome'],
    ['#64748b', 'Specific Outcome (SCO)'],
  ];
  const lf = document.getElementById('lf');
  LEG.forEach(([col, label]) => {
    const d = document.createElement('div'); d.className = 'leg';
    const bg = col
      ? `background:${col}`
      : 'background:linear-gradient(135deg,#34d399,#60a5fa,#fb923c,#c084fc)';
    d.innerHTML = `<span class="ls" style="${bg}"></span>${label}`;
    lf.appendChild(d);
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// FILTER
// ═══════════════════════════════════════════════════════════════════════════
let activeGrades = new Set(ALL_GRADES);
let activeSubs   = new Set(ALL_SUBJECTS);

function filterNode(n) {
  if (!n) return null;
  const c = Object.assign({}, n);
  if (c.type === 'grade' && currentView === 'grade' && !activeGrades.has(c.name)) return null;
  if (c.type === 'grade' && currentView === 'subject'
      && !activeGrades.has(c.name) && c.name !== 'Kindergarten Units') return null;
  if (c.type === 'subject') {
    const key = SUB_COLORS[c.name] ? c.name : 'Kindergarten Units';
    if (!activeSubs.has(key) && !activeSubs.has(c.name)) return null;
  }
  if (c.children) c.children = c.children.map(filterNode).filter(Boolean);
  return c;
}

function toggleGrade(g, on) { on ? activeGrades.add(g) : activeGrades.delete(g); filterRender(); }
function toggleSub(s, on)   { on ? activeSubs.add(s)   : activeSubs.delete(s);   filterRender(); }

function filterRender() {
  const raw = currentView === 'grade' ? GRADE_TREE : SUBJECT_TREE;
  renderTree(filterNode(raw));
}

// ═══════════════════════════════════════════════════════════════════════════
// SVG / ZOOM SETUP
// ═══════════════════════════════════════════════════════════════════════════
let svg, tg, zoom, W, H;

function initSVG() {
  const el = document.getElementById('canvas');
  W = el.clientWidth; H = el.clientHeight;
  svg = d3.select('#tree-svg').attr('width', W).attr('height', H);
  tg  = d3.select('#tg');

  // Ground gradient (defined dynamically so it can be absolute)
  const defs = svg.select('defs');
  defs.selectAll('#grd-grad').remove();
  const gg = defs.append('linearGradient').attr('id','grd-grad')
    .attr('x1','0').attr('y1','0').attr('x2','0').attr('y2','1');
  gg.append('stop').attr('offset','0%').attr('stop-color','#0d2818').attr('stop-opacity',.9);
  gg.append('stop').attr('offset','100%').attr('stop-color','#030f07').attr('stop-opacity',1);

  svg.select('#ground')
    .attr('y', H - 52).attr('height', 52)
    .attr('opacity', 1);

  zoom = d3.zoom().scaleExtent([.04, 4])
    .on('zoom', e => tg.attr('transform', e.transform));
  svg.call(zoom);
}

// ═══════════════════════════════════════════════════════════════════════════
// RENDER
// ═══════════════════════════════════════════════════════════════════════════
let root, nodeId = 0, currentView = 'grade';

function renderTree(data) {
  if (!data) return;
  tg.selectAll('*').remove();
  nodeId = 0;

  root = d3.hierarchy(data, d => d._children || d.children);
  // Collapse below depth 1 initially
  root.descendants().forEach(d => {
    if (d.depth >= 2 && d.children) { d._children = d.children; d.children = null; }
  });

  update(root);
  // Position root at bottom-center
  svg.call(zoom.transform, d3.zoomIdentity.translate(W/2, H - 100).scale(.88));
}

// ── Branch path (strict 45° geometric connectors) ────────────────────────
function branch(d) {
  const sx = d.source.vx, sy = d.source.vy;
  const tx = d.target.vx, ty = d.target.vy;
  const dx = Math.abs(tx - sx);
  const dy = Math.abs(sy - ty);   // sy > ty always (tree grows up)

  if (dx < 1) return `M${sx},${sy} L${tx},${ty}`;   // pure vertical

  if (dx <= dy) {
    // Vertical segment first, then 45° diagonal to target
    const ky = ty + dx;            // kink point: dy left = dx, so angle is 45°
    return `M${sx},${sy} L${sx},${ky} L${tx},${ty}`;
  } else {
    // 45° diagonal first, then horizontal to target
    const kx = tx > sx ? sx + dy : sx - dy;
    return `M${sx},${sy} L${kx},${ty} L${tx},${ty}`;
  }
}

// ── Trunk (thick brown line below root) ──────────────────────────────────
function drawTrunk() {
  tg.selectAll('.trunk').remove();
  if (!root) return;
  const rx = root.vx, ry = root.vy;
  const trunkLen = 70;
  tg.insert('line', ':first-child')
    .attr('class', 'trunk')
    .attr('x1', rx).attr('y1', ry + nRadius(root))
    .attr('x2', rx).attr('y2', ry + nRadius(root) + trunkLen)
    .style('stroke', '#6b3a1f')
    .style('stroke-width', 18)
    .style('stroke-linecap', 'round')
    .style('filter', 'url(#f-sm)');

  // Root roots (small lines spreading from trunk base)
  [[-.6,1.1,35],  [.6,1.1,30],  [-.9,1.05,22],  [.9,1.05,22]].forEach(([dx,dy,len]) => {
    tg.insert('line', ':first-child')
      .attr('class','trunk')
      .attr('x1', rx).attr('y1', ry + nRadius(root) + trunkLen)
      .attr('x2', rx + dx*len).attr('y2', ry + nRadius(root) + trunkLen + dy*20)
      .style('stroke','#4a2810')
      .style('stroke-width', 6)
      .style('stroke-linecap','round')
      .style('opacity',.7);
  });
}

// ── Main update function ──────────────────────────────────────────────────
function update(source) {
  // Layout: tree grows UPWARD, root at bottom
  const layout = d3.tree()
    .nodeSize([55, 175])
    .separation((a, b) => a.parent === b.parent ? 1.1 : 1.9);
  layout(root);

  // Flip Y so root is at origin (bottom), children go up (negative Y)
  root.descendants().forEach(d => {
    d.vx = d.x;
    d.vy = -d.y;
  });

  const sx0 = (source.vx !== undefined ? source.vx : 0);
  const sy0 = (source.vy !== undefined ? source.vy : 0);

  const nodes = root.descendants();
  const links = root.links();

  // ── Links ──────────────────────────────────────────────────────────────
  const link = tg.selectAll('.link').data(links, d => d.target.id);

  link.enter().insert('path', '.node')
    .attr('class', 'link')
    .attr('d', () => { const o={vx:sx0,vy:sy0}; return branch({source:o,target:o}); })
    .style('stroke', d => {
      let n = d.target;
      while (n && n.data.type !== 'subject') n = n.parent;
      return n ? subColor(n.data.subject || n.data.name) : '#1e3a5f';
    })
    .style('stroke-opacity', .5)
    .style('stroke-width', d => linkW(d))
    .merge(link)
    .transition().duration(550).ease(d3.easeCubicOut)
    .attr('d', branch);

  link.exit()
    .transition().duration(320)
    .attr('d', () => { const o={vx:source.vx,vy:source.vy}; return branch({source:o,target:o}); })
    .remove();

  // ── Nodes ──────────────────────────────────────────────────────────────
  const node = tg.selectAll('.node').data(nodes, d => d.id || (d.id = ++nodeId));

  const nEnter = node.enter().append('g')
    .attr('class', 'node')
    .attr('transform', `translate(${sx0},${sy0})`)
    .style('opacity', 0)
    .on('click', (event, d) => {
      event.stopPropagation();
      if (d.children)       { d._children = d.children;  d.children  = null; }
      else if (d._children) { d.children  = d._children; d._children = null; }
      update(d);
    })
    .on('mouseover', showTip)
    .on('mousemove',  moveTip)
    .on('mouseout',   hideTip);

  // Outer halo (animated glow ring)
  nEnter.append('circle')
    .attr('class', d => d.data.type === 'root' ? 'root-halo' : d.data.type === 'subject' ? 'subject-halo' : '')
    .attr('r', d => nRadius(d) + (d.data.type === 'root' ? 10 : 6))
    .style('fill', d => nColor(d))
    .style('opacity', d => d.data.type === 'root' ? .18 : .1)
    .style('pointer-events', 'none');

  // Main body – use leaf path for ELO/SCO leaf nodes, circle otherwise
  nEnter.each(function(d) {
    const g = d3.select(this);
    const isLeafNode = isLeaf(d) && (d.data.type === 'elo' || d.data.type === 'sco');
    if (isLeafNode) {
      const angle = d.vx < 0 ? -25 : d.vx > 0 ? 25 : 0;
      g.append('use')
        .attr('href', '#leaf-shape')
        .attr('class', d.data.type === 'sco' ? 'sco-dot' : '')
        .style('fill', nColor(d))
        .style('stroke', d3.color(nColor(d)).darker(.8).formatHex())
        .style('stroke-width', 1)
        .attr('filter', glowFilter(d))
        .attr('transform', `scale(${d.data.type === 'sco' ? 0.6 : 1}) rotate(${angle})`);
    } else {
      g.append('circle')
        .attr('class', 'node-circle')
        .attr('r', 0)
        .style('fill', nColor(d))
        .style('stroke', d3.color(nColor(d)).darker(.6).formatHex())
        .style('stroke-width', d.depth === 0 ? 3 : 2)
        .attr('filter', glowFilter(d));
    }
  });

  // Inner ring detail for root and grade nodes
  nEnter.filter(d => d.data.type === 'root' || d.data.type === 'grade')
    .append('circle')
    .attr('r', d => nRadius(d) * .45)
    .style('fill', 'none')
    .style('stroke', d => d.data.type === 'root' ? 'rgba(255,255,255,.35)' : 'rgba(255,255,255,.2)')
    .style('stroke-width', 1.5)
    .style('pointer-events', 'none');

  // Expand indicator
  nEnter.append('text')
    .attr('class', 'exp-ind')
    .attr('dy', '.32em')
    .style('fill', 'rgba(255,255,255,.45)')
    .style('font-size', '8px')
    .style('font-weight', '600')
    .style('text-anchor', 'middle')
    .style('pointer-events', 'none');

  // Label
  nEnter.append('text')
    .attr('class', 'node-lbl')
    .attr('dy', d => d.data.type === 'root' ? (nRadius(d) + 16) + 'px' : '.32em')
    .style('fill', d => {
      if (d.data.type === 'root') return '#fde68a';
      if (d.depth <= 1) return '#e2e8f0';
      return d3.color(nColor(d)).brighter(1).formatHex();
    })
    .style('font-size', d => ['13px','12px','11px','10px','9px','8px'][Math.min(d.depth,5)])
    .style('font-weight', d => d.depth <= 2 ? '600' : '400')
    .style('pointer-events', 'none')
    .style('text-anchor', d => d.data.type === 'root' ? 'middle' : null); // handled below

  // ── Merge & transition ──────────────────────────────────────────────────
  const nMerge = nEnter.merge(node);

  nMerge.transition().duration(550).ease(d3.easeCubicOut)
    .attr('transform', d => `translate(${d.vx},${d.vy})`)
    .style('opacity', 1);

  nMerge.select('.node-circle')
    .transition().duration(550).ease(d3.easeBackOut.overshoot(1.3))
    .attr('r', nRadius)
    .style('fill', d => d._children ? d3.color(nColor(d)).brighter(.6).formatHex() : nColor(d));

  // Update label position and text
  nMerge.select('text.node-lbl')
    .attr('x', d => {
      if (d.data.type === 'root') return 0;
      const side = (d.children || d._children) ? -(nRadius(d)+9) : (nRadius(d)+9);
      return side;
    })
    .style('text-anchor', d => {
      if (d.data.type === 'root') return 'middle';
      return (d.children || d._children) ? 'end' : 'start';
    })
    .text(d => {
      const name = d.data.name;
      const maxL = [20,18,22,32,40,50][Math.min(d.depth,5)];
      return name.length > maxL ? name.slice(0, maxL) + '…' : name;
    });

  nMerge.select('text.exp-ind')
    .text(d => d._children ? `+${d._children.length}` : '');

  node.exit()
    .transition().duration(320)
    .attr('transform', `translate(${source.vx},${source.vy})`)
    .style('opacity', 0)
    .remove();

  drawTrunk();
}

// ═══════════════════════════════════════════════════════════════════════════
// TOOLTIP
// ═══════════════════════════════════════════════════════════════════════════
function showTip(event, d) {
  const col = nColor(d);
  const {name, type} = d.data;
  let html = `<div style="color:${col};font-weight:700;font-size:13px;margin-bottom:4px">${name}</div>`;
  html += `<div style="color:#475569;font-size:10px;text-transform:uppercase;letter-spacing:.07em">${type}</div>`;
  if (d._children)
    html += `<div style="color:#64748b;font-size:11px;margin-top:6px">&#9654; ${d._children.length} items &mdash; click to expand</div>`;
  else if (d.children && d.depth > 0)
    html += `<div style="color:#64748b;font-size:11px;margin-top:6px">&#9660; click to collapse</div>`;
  document.getElementById('tip-inner').innerHTML = html;
  document.getElementById('tip').style.display = 'block';
  moveTip(event);
}
function moveTip(ev) {
  const tip = document.getElementById('tip');
  const tw = tip.offsetWidth || 220;
  const x = ev.clientX + 18;
  tip.style.left = (x + tw > innerWidth ? ev.clientX - tw - 12 : x) + 'px';
  tip.style.top  = (ev.clientY - 14) + 'px';
}
function hideTip() { document.getElementById('tip').style.display = 'none'; }

// ═══════════════════════════════════════════════════════════════════════════
// CONTROLS
// ═══════════════════════════════════════════════════════════════════════════
function switchView(v) {
  currentView = v;
  document.getElementById('btn-grade').className   = v==='grade'   ? 'btn btn-on' : 'btn btn-off';
  document.getElementById('btn-subject').className = v==='subject' ? 'btn btn-on' : 'btn btn-off';
  filterRender();
  setTimeout(resetZoom, 80);
}
function expandAll() {
  root.descendants().forEach(d => { if (d._children) { d.children=d._children; d._children=null; } });
  update(root);
}
function collapseAll() {
  root.descendants().forEach(d => { if (d.depth>0&&d.children) { d._children=d.children; d.children=null; } });
  update(root);
}
function resetZoom() {
  svg.transition().duration(500).call(zoom.transform,
    d3.zoomIdentity.translate(W/2, H-100).scale(.88));
}
function zoomIn()  { svg.transition().duration(240).call(zoom.scaleBy, 1.4); }
function zoomOut() { svg.transition().duration(240).call(zoom.scaleBy, 0.72); }

// ═══════════════════════════════════════════════════════════════════════════
// BOOT
// ═══════════════════════════════════════════════════════════════════════════
buildSidebar();
initSVG();
filterRender();
window.addEventListener('resize', () => { initSVG(); filterRender(); });
</script>
</body>
</html>
"""


def generate_html(grade_tree: dict, subject_tree: dict, output_path: Path):
    html = (HTML_TEMPLATE
            .replace("__GRADE_JSON__",    json.dumps(grade_tree,   ensure_ascii=False))
            .replace("__SUBJECT_JSON__",  json.dumps(subject_tree, ensure_ascii=False))
            .replace("__COLORS_JSON__",   json.dumps(SUBJECT_COLORS))
            .replace("__KINDER_COLOR__",  KINDER_COLOR))

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Generated: {output_path}")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    directory   = Path(__file__).parent
    output_path = directory / "curriculum_roadmap.html"

    print("Loading curriculum files...")
    data = load_curriculum_data(directory)
    print(f"  {len(data)} files loaded")

    print("Organising data...")
    by_grade   = organize_by_grade(data)
    by_subject = organize_by_subject(data)

    print("Building trees...")
    grade_tree   = build_by_grade_tree(by_grade)
    subject_tree = build_by_subject_tree(by_subject)

    print("Writing HTML...")
    generate_html(grade_tree, subject_tree, output_path)

    print("Opening in browser...")
    webbrowser.open(output_path.as_uri())


if __name__ == "__main__":
    main()
