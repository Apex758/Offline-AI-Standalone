import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import type { MilestoneTreeNode } from '../types/milestone';
import curriculumIndex from '../data/curriculumIndex.json';

const currPages = (curriculumIndex as any).indexedPages || [];
const eloGroupsMap = new Map<string, { elo: string; scoRange: [number, number] }[]>();
currPages.forEach((p: any) => {
  if (p.id && p.eloGroups) eloGroupsMap.set(p.id, p.eloGroups);
});

/* ── Progress tree node types ── */
interface SkillNode {
  id: string;
  label: string;
  shortLabel: string;
  type: 'grade' | 'subject' | 'strand' | 'elo' | 'sco';
  expandIds: string[];
  progress: number;
  total: number;
  completed: number;
  children: SkillNode[];
  checked?: boolean;
}

/* ── Helpers ── */
function formatStrand(s: string): string {
  return s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function abbrevSubject(s: string): string {
  const map: Record<string, string> = {
    'Language Arts': 'LA',
    'Mathematics': 'Math',
    'Science': 'Sci',
    'Social Studies': 'SS',
    'Physical Education': 'PE',
    'Health & Family Life Education': 'HFLE',
    'Information Technology': 'IT',
    'Agricultural Science': 'Agri',
    'Visual & Performing Arts': 'Arts',
    'Spanish': 'Span',
    'French': 'Fr',
  };
  return map[s] || s.substring(0, 4);
}

/* ── Build the full tree ── */
function buildSkillTree(treeData: MilestoneTreeNode[]): SkillNode[] {
  return treeData.map(grade => ({
    id: grade.id,
    label: grade.label === 'K' ? 'Kindergarten' : `Grade ${grade.label}`,
    shortLabel: grade.label === 'K' ? 'K' : grade.label,
    type: 'grade' as const,
    expandIds: [grade.id],
    progress: grade.progress?.percentage ?? 0,
    total: grade.progress?.total ?? 0,
    completed: grade.progress?.completed ?? 0,
    children: (grade.children || []).map(subject => ({
      id: subject.id,
      label: subject.label,
      shortLabel: abbrevSubject(subject.label),
      type: 'subject' as const,
      expandIds: [grade.id, subject.id],
      progress: subject.progress?.percentage ?? 0,
      total: subject.progress?.total ?? 0,
      completed: subject.progress?.completed ?? 0,
      children: (subject.children || []).map(strand => {
        const eloChildren: SkillNode[] = [];
        (strand.milestones || []).forEach(m => {
          const groups = eloGroupsMap.get(m.topic_id) || [];
          const cl = m.checklist || [];
          groups.forEach((g, gi) => {
            const scos = cl.slice(g.scoRange[0], g.scoRange[1] + 1);
            const checked = scos.filter(s => s.checked).length;
            eloChildren.push({
              id: `elo-${m.id}-${gi}`,
              label: g.elo,
              shortLabel: `ELO ${eloChildren.length + 1}`,
              type: 'elo',
              expandIds: [grade.id, subject.id, strand.id],
              progress: scos.length > 0 ? Math.round((checked / scos.length) * 100) : 0,
              total: scos.length,
              completed: checked,
              children: scos.map((sco, si) => ({
                id: `sco-${m.id}-${gi}-${si}`,
                label: sco.text,
                shortLabel: sco.key || `SCO ${si + 1}`,
                type: 'sco' as const,
                expandIds: [grade.id, subject.id, strand.id],
                progress: sco.checked ? 100 : 0,
                total: 1,
                completed: sco.checked ? 1 : 0,
                children: [],
                checked: sco.checked,
              })),
            });
          });
        });
        return {
          id: strand.id,
          label: formatStrand(strand.label),
          shortLabel: formatStrand(strand.label).length > 8
            ? formatStrand(strand.label).substring(0, 6) + '..'
            : formatStrand(strand.label),
          type: 'strand' as const,
          expandIds: [grade.id, subject.id, strand.id],
          progress: strand.progress?.percentage ?? 0,
          total: strand.progress?.total ?? 0,
          completed: strand.progress?.completed ?? 0,
          children: eloChildren,
        };
      }),
    })),
  }));
}

/* ── SVG progress ring ── */
const ProgressRing: React.FC<{
  size: number;
  progress: number;
  accentColor: string;
  checked?: boolean;
  type: string;
}> = ({ size, progress, accentColor, checked, type }) => {
  const sw = type === 'sco' ? 2 : 3;
  const r = (size - sw * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;
  const cx = size / 2;

  if (type === 'sco') {
    return (
      <svg width={size} height={size}>
        <circle cx={cx} cy={cx} r={r}
          fill={checked ? accentColor : 'transparent'}
          stroke={checked ? accentColor : 'var(--border-strong)'}
          strokeWidth={sw}
        />
        {checked && (
          <path
            d={`M${cx - size * 0.14} ${cx} l${size * 0.1} ${size * 0.1} l${size * 0.17} -${size * 0.2}`}
            fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          />
        )}
      </svg>
    );
  }

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={cx} cy={cx} r={r}
        fill="none" stroke="var(--border-default)" strokeWidth={sw} opacity={0.5}
      />
      {progress > 0 && (
        <circle cx={cx} cy={cx} r={r}
          fill="none" stroke={accentColor} strokeWidth={sw}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      )}
    </svg>
  );
};

/* ── SVG connector lines from parent to children ── */
const TreeConnectors: React.FC<{
  parentRef: React.RefObject<HTMLDivElement | null>;
  childRefs: React.RefObject<(HTMLDivElement | null)[]>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  accentColor: string;
  animKey: number;
  nodeCount: number;
}> = ({ parentRef, childRefs, containerRef, accentColor, animKey, nodeCount }) => {
  const [paths, setPaths] = useState<string[]>([]);

  const calc = useCallback(() => {
    const parent = parentRef.current;
    const container = containerRef.current;
    const children = childRefs.current;
    if (!parent || !container || !children) return;

    const cRect = container.getBoundingClientRect();
    const pRect = parent.getBoundingClientRect();
    const px = pRect.left + pRect.width / 2 - cRect.left;
    const py = pRect.top + pRect.height - cRect.top;

    const newPaths: string[] = [];
    children.forEach(child => {
      if (!child) return;
      const chRect = child.getBoundingClientRect();
      const chx = chRect.left + chRect.width / 2 - cRect.left;
      const chy = chRect.top - cRect.top;
      const midY = py + (chy - py) / 2;
      newPaths.push(`M${px},${py} C${px},${midY} ${chx},${midY} ${chx},${chy}`);
    });
    setPaths(newPaths);
  }, [parentRef, childRefs, containerRef]);

  useEffect(() => {
    // Recalculate at multiple points to catch post-animation layout
    const t1 = setTimeout(calc, 60);
    const t2 = setTimeout(calc, 250);
    const t3 = setTimeout(calc, 450);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [calc, animKey, nodeCount]);

  // Also recalc on resize
  useEffect(() => {
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [calc]);

  if (paths.length === 0) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ overflow: 'visible', zIndex: 0, width: '100%', height: '100%' }}
    >
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={accentColor}
          strokeWidth="2"
          strokeOpacity={0.3}
          style={{ transition: 'all 0.3s ease' }}
        />
      ))}
    </svg>
  );
};

/* ── Level type badge ── */
const levelLabels: Record<string, string> = {
  grade: 'GRADES',
  subject: 'SUBJECTS',
  strand: 'STRANDS',
  elo: 'ELOs',
  sco: 'SCOs',
};

/* ── Main component ── */
interface Props {
  treeData: MilestoneTreeNode[];
  accentColor: string;
  onNavigate: (expandIds: string[], highlightId?: string) => void;
}

const CurriculumSkillTree: React.FC<Props> = ({ treeData, accentColor, onNavigate }) => {
  const [currentPath, setCurrentPath] = useState<number[]>([]);
  const [animKey, setAnimKey] = useState(0);
  const [zoomDir, setZoomDir] = useState<'in' | 'out'>('in');

  const parentNodeRef = useRef<HTMLDivElement | null>(null);
  const childNodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const treeContainerRef = useRef<HTMLDivElement | null>(null);

  const skillTree = useMemo(() => buildSkillTree(treeData), [treeData]);

  const currentView = useMemo(() => {
    let nodes = skillTree;
    const crumbs: { label: string; shortLabel: string }[] = [];
    let parentNode: SkillNode | null = null;

    for (const idx of currentPath) {
      if (idx >= 0 && idx < nodes.length) {
        parentNode = nodes[idx];
        crumbs.push({ label: parentNode.label, shortLabel: parentNode.shortLabel });
        nodes = parentNode.children;
      } else break;
    }

    return { nodes, crumbs, parentNode };
  }, [skillTree, currentPath]);

  // Determine the type of children being shown
  const childType = currentView.nodes.length > 0 ? currentView.nodes[0].type : null;

  const zoomIn = (index: number) => {
    const node = currentView.nodes[index];
    if (!node) return;
    const highlightId = node.expandIds[node.expandIds.length - 1];
    // Always navigate/highlight on the left, even for leaf nodes
    onNavigate(node.expandIds, highlightId);
    // Only zoom deeper if node has children
    if (node.children.length === 0) return;
    setZoomDir('in');
    setCurrentPath(prev => [...prev, index]);
    setAnimKey(k => k + 1);
  };

  const zoomOut = (level: number) => {
    if (level === 0 && currentPath.length === 0) return;
    setZoomDir('out');
    const newPath = currentPath.slice(0, level);
    setCurrentPath(newPath);
    setAnimKey(k => k + 1);

    if (newPath.length > 0) {
      let nodes = skillTree;
      let lastNode: SkillNode | null = null;
      for (const idx of newPath) {
        if (idx < nodes.length) { lastNode = nodes[idx]; nodes = lastNode.children; }
      }
      if (lastNode) {
        const hId = lastNode.expandIds[lastNode.expandIds.length - 1];
        onNavigate(lastNode.expandIds, hId);
      }
    } else {
      onNavigate([], undefined);
    }
  };

  const nodeSizes: Record<string, number> = {
    grade: 56, subject: 50, strand: 46, elo: 42, sco: 30,
  };

  // Reset child refs array size before render (not in useEffect which runs after)
  if (childNodeRefs.current.length !== currentView.nodes.length) {
    childNodeRefs.current = new Array(currentView.nodes.length).fill(null);
  }

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg-secondary)' }}>
      <style>{`
        @keyframes skillTreeZoomIn {
          from { opacity: 0; transform: scale(0.82) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes skillTreeZoomOut {
          from { opacity: 0; transform: scale(1.15) translateY(-8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .progress-tree-node {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .progress-tree-node:hover {
          transform: scale(1.1);
        }
        .progress-tree-node.is-clickable:active {
          transform: scale(0.95);
        }
      `}</style>

      {/* ── Header & breadcrumb ── */}
      <div className="px-3 pt-3 pb-2 border-b border-theme flex-shrink-0">
        <div
          className="text-[10px] font-bold uppercase tracking-widest mb-1.5"
          style={{ color: accentColor }}
        >
          Progress Tree
        </div>
        <div className="flex items-center flex-wrap gap-1 text-xs">
          <button
            onClick={() => zoomOut(0)}
            className={`transition-colors ${currentPath.length === 0 ? 'font-semibold' : 'text-theme-muted hover:underline'}`}
            style={currentPath.length === 0 ? { color: accentColor } : {}}
          >
            Grades
          </button>
          {currentView.crumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              <span className="text-theme-hint opacity-60">&#8250;</span>
              <button
                onClick={() => zoomOut(i + 1)}
                className={`transition-colors ${i === currentView.crumbs.length - 1 ? 'font-semibold' : 'text-theme-muted hover:underline'}`}
                style={i === currentView.crumbs.length - 1 ? { color: accentColor } : {}}
              >
                {crumb.label.length > 16 ? crumb.shortLabel : crumb.label}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── Tree content ── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div
          key={animKey}
          ref={treeContainerRef}
          className="relative px-3 py-4"
          style={{
            animation: `${zoomDir === 'in' ? 'skillTreeZoomIn' : 'skillTreeZoomOut'} 0.38s cubic-bezier(0.22, 1, 0.36, 1) both`,
          }}
        >
          {/* Parent node (when zoomed in) */}
          {currentView.parentNode && (
            <div className="flex flex-col items-center mb-1">
              <div className="relative" ref={parentNodeRef}>
                <ProgressRing
                  size={64}
                  progress={currentView.parentNode.progress}
                  accentColor={accentColor}
                  type={currentView.parentNode.type}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-theme-title">
                    {currentView.parentNode.progress}%
                  </span>
                </div>
              </div>
              <div className="text-xs font-semibold text-theme-title mt-1 text-center max-w-[140px] leading-tight">
                {currentView.parentNode.label}
              </div>
              <div className="text-[10px] text-theme-hint">
                {currentView.parentNode.completed}/{currentView.parentNode.total}
              </div>
            </div>
          )}

          {/* Level type label */}
          {childType && (
            <div className="flex items-center justify-center my-3">
              <div className="h-px flex-1" style={{ backgroundColor: `${accentColor}20` }} />
              <span
                className="px-2 text-[9px] font-bold uppercase tracking-widest"
                style={{ color: `${accentColor}90` }}
              >
                {levelLabels[childType] || childType}
              </span>
              <div className="h-px flex-1" style={{ backgroundColor: `${accentColor}20` }} />
            </div>
          )}

          {/* SVG connector lines */}
          {currentView.parentNode && currentView.nodes.length > 0 && (
            <TreeConnectors
              animKey={animKey}
              nodeCount={currentView.nodes.length}
              parentRef={parentNodeRef}
              childRefs={childNodeRefs}
              containerRef={treeContainerRef}
              accentColor={accentColor}
            />
          )}

          {/* Children nodes */}
          {currentView.nodes.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-4 relative" style={{ zIndex: 1 }}>
              {currentView.nodes.map((node, i) => {
                const size = nodeSizes[node.type] || 44;
                const isLeaf = node.children.length === 0;
                const canZoom = !isLeaf;

                return (
                  <div
                    key={node.id}
                    ref={el => { if (childNodeRefs.current) childNodeRefs.current[i] = el; }}
                    className={`progress-tree-node flex flex-col items-center cursor-pointer ${canZoom ? 'is-clickable' : ''}`}
                    onClick={() => zoomIn(i)}
                    style={{ minWidth: Math.max(size + 12, 48) }}
                  >
                    {/* Node circle */}
                    <div className="relative group">
                      <ProgressRing
                        size={size}
                        progress={node.progress}
                        accentColor={accentColor}
                        checked={node.checked}
                        type={node.type}
                      />
                      {node.type !== 'sco' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className={`font-bold text-theme-title ${size > 46 ? 'text-xs' : 'text-[10px]'}`}>
                            {node.shortLabel}
                          </span>
                        </div>
                      )}
                      {/* Glow on hover for clickable nodes */}
                      {canZoom && (
                        <div
                          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                          style={{ boxShadow: `0 0 16px ${accentColor}40, 0 0 6px ${accentColor}25` }}
                        />
                      )}
                      {/* Completed glow */}
                      {node.progress === 100 && node.type !== 'sco' && (
                        <div
                          className="absolute inset-0 rounded-full pointer-events-none"
                          style={{ boxShadow: `0 0 10px ${accentColor}30` }}
                        />
                      )}
                    </div>

                    {/* Label */}
                    <div className="text-center mt-1.5 leading-tight" style={{ maxWidth: Math.max(size + 20, 64) }}>
                      <div
                        className="font-medium text-theme-label truncate"
                        style={{ fontSize: node.type === 'sco' ? '9px' : '10px' }}
                        title={node.label}
                      >
                        {node.type === 'elo'
                          ? node.shortLabel
                          : node.label.length > 14
                            ? (node.shortLabel.length > 10 ? node.shortLabel.substring(0, 8) + '..' : node.shortLabel)
                            : node.label
                        }
                      </div>
                      {node.type !== 'sco' && (
                        <div className="text-[9px] text-theme-hint mt-0.5">
                          {node.progress}%
                          <span className="opacity-60"> ({node.completed}/{node.total})</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-theme-hint text-sm">No items at this level</div>
            </div>
          )}

          {/* ELO/SCO detail label (when viewing ELOs or SCOs) */}
          {childType === 'elo' && currentView.nodes.length > 0 && (
            <div className="mt-6 space-y-2 px-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-theme-hint mb-2">
                ELO Details
              </div>
              {currentView.nodes.map((node, i) => (
                <div
                  key={node.id}
                  className="p-2.5 rounded-lg border border-theme bg-theme-surface cursor-pointer hover:border-opacity-80 transition-all text-[11px] leading-relaxed text-theme-label"
                  onClick={() => node.children.length > 0 && zoomIn(i)}
                  style={node.progress === 100 ? { borderColor: `${accentColor}40` } : {}}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-[10px]" style={{ color: accentColor }}>
                      {node.shortLabel}
                    </span>
                    <span className="text-[9px] text-theme-hint">
                      {node.completed}/{node.total} SCOs
                    </span>
                  </div>
                  <div className="line-clamp-2">{node.label}</div>
                </div>
              ))}
            </div>
          )}

          {childType === 'sco' && currentView.nodes.length > 0 && (
            <div className="mt-6 space-y-1.5 px-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-theme-hint mb-2">
                Specific Outcomes
              </div>
              {currentView.nodes.map(node => (
                <div
                  key={node.id}
                  className="flex items-start gap-2 p-2 rounded-lg text-[11px] leading-relaxed"
                  style={node.checked
                    ? { backgroundColor: `${accentColor}10`, color: 'var(--text-hint)', textDecoration: 'line-through' }
                    : { color: 'var(--text-label)' }
                  }
                >
                  <div
                    className="w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center"
                    style={node.checked
                      ? { backgroundColor: accentColor, borderColor: accentColor }
                      : { borderColor: 'var(--border-strong)' }
                    }
                  >
                    {node.checked && (
                      <svg width="8" height="8" viewBox="0 0 8 8">
                        <path d="M1.5 4 L3 5.5 L6.5 2" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span>{node.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurriculumSkillTree;
