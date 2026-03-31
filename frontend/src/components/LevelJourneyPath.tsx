import React, { useMemo, useState, useEffect, useRef } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import LockIconData from '@hugeicons/core-free-icons/LockIcon';
import Tick01IconData from '@hugeicons/core-free-icons/Tick01Icon';
import Trophy01IconData from '@hugeicons/core-free-icons/Award01Icon';
import ArrowDownIconData from '@hugeicons/core-free-icons/ArrowDown01Icon';
import type { TeacherRank } from '../types/achievement';

// Mirror of backend RANKS for step calculation
const RANKS = [
  { level: 1, title: 'Newcomer', required: 0 },
  { level: 2, title: 'Apprentice Teacher', required: 5 },
  { level: 3, title: 'Developing Educator', required: 12 },
  { level: 4, title: 'Proficient Instructor', required: 22 },
  { level: 5, title: 'Experienced Educator', required: 33 },
  { level: 6, title: 'Master Teacher', required: 45 },
  { level: 7, title: 'OECS Champion', required: 55 },
];

// ── Geometry helpers ──

function calcHalfWidths(n: number): number[] {
  if (n <= 0) return [];
  if (n === 1) return [40];
  const maxHW = 50;
  const minHW = Math.max(18, maxHW - (n - 1) * 2.5);
  return Array.from({ length: n }, (_, i) => maxHW - i * (maxHW - minHW) / (n - 1));
}

function calcStepPositions(hws: number[]): { cx: number; cy: number }[] {
  const n = hws.length;
  if (n === 0) return [];
  if (n === 1) return [{ cx: 0, cy: 0 }];

  const leg1Count = Math.ceil(n / 3);
  const leg2Count = Math.ceil((n - leg1Count) / 2);

  // Determine direction per step: leg1 = +1, leg2 = -1, leg3 = +1
  const directions: number[] = [];
  for (let i = 0; i < n; i++) {
    if (i < leg1Count) directions.push(1);
    else if (i < leg1Count + leg2Count) directions.push(-1);
    else directions.push(1);
  }

  const positions: { cx: number; cy: number }[] = [{ cx: 0, cy: 0 }];
  for (let i = 1; i < n; i++) {
    const prev = positions[i - 1];
    const dx = (hws[i - 1] + hws[i]) * directions[i];
    const dy = -(hws[i - 1] / 2 + hws[i] / 2);
    positions.push({ cx: prev.cx + dx, cy: prev.cy + dy });
  }

  // Center horizontally
  let minX = Infinity, maxX = -Infinity;
  for (let i = 0; i < n; i++) {
    minX = Math.min(minX, positions[i].cx - hws[i]);
    maxX = Math.max(maxX, positions[i].cx + hws[i]);
  }
  const offsetX = -(minX + maxX) / 2;
  for (const p of positions) p.cx += offsetX;

  return positions;
}

function isoTopFace(cx: number, cy: number, hw: number): string {
  const hh = hw / 2;
  return `${cx - hw},${cy} ${cx},${cy - hh} ${cx + hw},${cy} ${cx},${cy + hh}`;
}

function isoLeftFace(cx: number, cy: number, hw: number, depth: number): string {
  const hh = hw / 2;
  return `${cx - hw},${cy} ${cx},${cy + hh} ${cx},${cy + hh + depth} ${cx - hw},${cy + depth}`;
}

function isoRightFace(cx: number, cy: number, hw: number, depth: number): string {
  const hh = hw / 2;
  return `${cx + hw},${cy} ${cx},${cy + hh} ${cx},${cy + hh + depth} ${cx + hw},${cy + depth}`;
}

function adjustColor(hex: string, amount: number): string {
  // amount > 0 = lighten, amount < 0 = darken
  const h = hex.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(h.substring(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(h.substring(2, 4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(h.substring(4, 6), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// ── Component ──

interface LevelJourneyPathProps {
  rank: TeacherRank | null;
  earnedCount: number;
  tabColor: string;
}

export default function LevelJourneyPath({ rank, earnedCount, tabColor }: LevelJourneyPathProps) {
  const currentLevel = rank?.level ?? 1;
  const [levelsOpen, setLevelsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelHeight, setPanelHeight] = useState(0);

  // Measure panel content height for smooth animation
  useEffect(() => {
    if (panelRef.current) {
      setPanelHeight(panelRef.current.scrollHeight);
    }
  }, [levelsOpen]);

  // Load profile image from localStorage (same pattern as Dashboard/Settings)
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    const img = localStorage.getItem('user-profile-image');
    if (img) setProfileImage(img);

    try {
      const settings = JSON.parse(localStorage.getItem('app-settings-main') || '{}');
      setDisplayName(settings?.profile?.displayName || '');
    } catch { /* ignore */ }

    const onStorage = () => {
      const updated = localStorage.getItem('user-profile-image');
      setProfileImage(updated);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const { totalSteps, completedSteps, nextTitle, nextRequired, prevRequired } = useMemo(() => {
    const currentRankIdx = RANKS.findIndex(r => r.level === currentLevel);
    const prev = RANKS[currentRankIdx]?.required ?? 0;

    if (currentRankIdx >= RANKS.length - 1) {
      return {
        totalSteps: 1,
        completedSteps: 1,
        nextTitle: 'Max Level!',
        nextRequired: prev,
        prevRequired: prev,
      };
    }

    const next = RANKS[currentRankIdx + 1];
    const stepsInSegment = next.required - prev;
    const completed = Math.min(earnedCount - prev, stepsInSegment);

    return {
      totalSteps: stepsInSegment,
      completedSteps: Math.max(0, completed),
      nextTitle: next.title,
      nextRequired: next.required,
      prevRequired: prev,
    };
  }, [currentLevel, earnedCount]);

  // Build isometric step data
  const hws = useMemo(() => calcHalfWidths(totalSteps), [totalSteps]);
  const positions = useMemo(() => calcStepPositions(hws), [hws]);

  const steps = useMemo(() => {
    // Leg boundaries (same logic as calcStepPositions)
    const leg1End = Math.ceil(totalSteps / 3) - 1;
    const leg2End = Math.ceil(totalSteps / 3) + Math.ceil((totalSteps - Math.ceil(totalSteps / 3)) / 2) - 1;
    const leg3End = totalSteps - 1;
    const legEndIndices = new Set([leg1End, leg2End, leg3End].filter(i => i >= 0 && i < totalSteps));

    // Token goes on the current step, or the last completed step if all done
    const allDone = completedSteps >= totalSteps;
    const tokenIdx = allDone ? totalSteps - 1 : completedSteps;

    return positions.map((pos, i) => ({
      ...pos,
      hw: hws[i],
      depth: hws[i] * 0.56,
      index: i,
      completed: i < completedSteps,
      isCurrent: i === completedSteps && i < totalSteps,
      showToken: i === tokenIdx,
      isLegEnd: legEndIndices.has(i),
    }));
  }, [positions, hws, totalSteps, completedSteps]);

  // Compute SVG bounding box
  const { svgWidth, svgHeight, offsetX, offsetY } = useMemo(() => {
    if (steps.length === 0) return { svgWidth: 200, svgHeight: 200, offsetX: 100, offsetY: 100 };

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const s of steps) {
      const tokenR = Math.max(14, s.hw * 0.42);
      const tw = s.hw * 1.3;
      const treeH = s.isLegEnd && s.completed ? tw * 1.1 : 0;
      minX = Math.min(minX, s.cx - s.hw);
      maxX = Math.max(maxX, s.cx + s.hw);
      // Account for profile token and trees floating above steps
      minY = Math.min(minY, s.cy - s.hw / 2 - Math.max(tokenR * 2 + 8, treeH));
      maxY = Math.max(maxY, s.cy + s.hw / 2 + s.depth);
    }

    const padX = 30;
    const padTop = 56; // room for destination banner
    const padBottom = 44; // room for start label
    const w = maxX - minX + padX * 2;
    const h = maxY - minY + padTop + padBottom;

    return {
      svgWidth: w,
      svgHeight: h,
      offsetX: -minX + padX,
      offsetY: -minY + padTop,
    };
  }, [steps]);

  // Build connector path
  const connectorPath = useMemo(() => {
    if (steps.length < 2) return '';
    const parts: string[] = [];
    for (let i = 0; i < steps.length; i++) {
      const x = steps[i].cx + offsetX;
      const y = steps[i].cy + offsetY;
      if (i === 0) {
        parts.push(`M ${x} ${y}`);
      } else {
        parts.push(`L ${x} ${y}`);
      }
    }
    return parts.join(' ');
  }, [steps, offsetX, offsetY]);

  const completionRatio = totalSteps > 1 ? completedSteps / (totalSteps - 1) : 1;
  const dark = document.documentElement.classList.contains('dark');

  // Derive colors from tabColor
  const colorTop1 = adjustColor(tabColor, 40);
  const colorTop2 = tabColor;
  const colorLeft1 = adjustColor(tabColor, -60);
  const colorLeft2 = adjustColor(tabColor, -100);
  const colorRight1 = adjustColor(tabColor, -10);
  const colorRight2 = adjustColor(tabColor, -60);

  // Count locked steps for opacity calculation
  const lockedStartIdx = completedSteps + (completedSteps < totalSteps ? 1 : 0); // skip current
  const totalLocked = Math.max(1, totalSteps - lockedStartIdx);

  return (
    <div
      className="rounded-3xl overflow-hidden relative"
      style={{
        background: dark
          ? 'rgba(255,255,255,0.04)'
          : 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)'}`,
        boxShadow: dark
          ? `0 0 0 1px rgba(255,255,255,0.04) inset, 0 30px 70px rgba(0,0,0,0.55), 0 0 40px ${tabColor}10`
          : `0 0 0 1px rgba(255,255,255,0.3) inset, 0 20px 50px rgba(0,0,0,0.08), 0 0 30px ${tabColor}08`,
      }}
    >
      {/* Shine overlay */}
      <div
        style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '30%',
          background: dark
            ? 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)'
            : 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 100%)',
          borderRadius: '24px 24px 0 0',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      {/* Header — clickable to toggle levels panel */}
      <div
        className="px-4 py-3 text-center cursor-pointer select-none transition-colors duration-150"
        onClick={() => setLevelsOpen(o => !o)}
        style={{
          background: `linear-gradient(135deg, ${tabColor}22, ${tabColor}11)`,
          borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
        }}
      >
        <div className="flex items-center justify-center gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: dark ? tabColor : 'var(--dash-text, #1a1a2e)', textShadow: dark ? 'none' : `0 0 12px ${tabColor}60` }}>
            Level {currentLevel} Journey
          </span>
          <HugeiconsIcon
            icon={ArrowDownIconData}
            size={12}
            style={{
              color: dark ? tabColor : 'var(--dash-text, #1a1a2e)',
              transform: levelsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
            }}
          />
        </div>
        <div className="text-[10px] mt-0.5 font-medium" style={{ color: dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.6)' }}>
          {completedSteps}/{totalSteps} steps to <span className="font-semibold">{nextTitle}</span>
        </div>
      </div>

      {/* All Levels dropdown panel */}
      <div
        style={{
          maxHeight: levelsOpen ? panelHeight + 32 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div
          ref={panelRef}
          className="px-4 py-3 space-y-1"
          style={{
            borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
            background: dark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
          }}
        >
          {RANKS.map((r, i) => {
            const isCurrentLevel = r.level === currentLevel;
            const isCompleted = r.level < currentLevel;
            const isLocked = r.level > currentLevel;
            const nextRank = RANKS[i + 1];
            const stepsInSegment = nextRank ? nextRank.required - r.required : 0;
            const stepsCompleted = isCurrentLevel
              ? Math.min(earnedCount - r.required, stepsInSegment)
              : isCompleted ? stepsInSegment : 0;
            const progressPct = stepsInSegment > 0 ? Math.round((stepsCompleted / stepsInSegment) * 100) : (isCompleted ? 100 : 0);

            return (
              <div
                key={r.level}
                className="relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200"
                style={{
                  background: isCurrentLevel
                    ? `linear-gradient(135deg, ${tabColor}18, ${tabColor}08)`
                    : 'transparent',
                  border: isCurrentLevel
                    ? `1px solid ${tabColor}35`
                    : '1px solid transparent',
                  opacity: isLocked ? 0.45 : 1,
                }}
              >
                {/* Level indicator circle */}
                <div
                  className="flex items-center justify-center rounded-full shrink-0"
                  style={{
                    width: 28,
                    height: 28,
                    background: isCompleted
                      ? tabColor
                      : isCurrentLevel
                        ? `${tabColor}30`
                        : dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                    border: isCurrentLevel ? `2px solid ${tabColor}` : 'none',
                  }}
                >
                  {isCompleted ? (
                    <HugeiconsIcon icon={Tick01IconData} size={13} style={{ color: '#fff' }} />
                  ) : isLocked ? (
                    <HugeiconsIcon icon={LockIconData} size={12} style={{ color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)' }} />
                  ) : (
                    <span className="text-[10px] font-bold" style={{ color: tabColor }}>{r.level}</span>
                  )}
                </div>

                {/* Level info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="text-[11px] font-bold truncate"
                      style={{
                        color: isCurrentLevel
                          ? tabColor
                          : isCompleted
                            ? (dark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)')
                            : (dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)'),
                      }}
                    >
                      {r.title}
                    </span>
                    {isCurrentLevel && (
                      <span
                        className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full shrink-0"
                        style={{
                          background: `${tabColor}25`,
                          color: tabColor,
                          letterSpacing: '0.08em',
                        }}
                      >
                        You are here
                      </span>
                    )}
                  </div>

                  {/* Progress bar for current and completed levels */}
                  {(isCurrentLevel || isCompleted) && stepsInSegment > 0 && (
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className="flex-1 h-1 rounded-full overflow-hidden"
                        style={{ background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${progressPct}%`,
                            background: isCompleted ? tabColor : `linear-gradient(90deg, ${tabColor}, ${tabColor}aa)`,
                          }}
                        />
                      </div>
                      <span
                        className="text-[9px] font-semibold shrink-0"
                        style={{ color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.3)' }}
                      >
                        {isCompleted ? stepsInSegment : stepsCompleted}/{stepsInSegment}
                      </span>
                    </div>
                  )}

                  {/* Requirement info for locked levels */}
                  {isLocked && (
                    <div className="text-[9px] mt-0.5" style={{ color: dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)' }}>
                      {r.required} achievements needed
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SVG Journey */}
      <div className="flex justify-center px-2 py-3">
        <svg
          width="100%"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block', maxHeight: 500 }}
        >
          <defs>
            {/* Completed gradients */}
            <linearGradient id="isoCompTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colorTop1} />
              <stop offset="100%" stopColor={colorTop2} />
            </linearGradient>
            <linearGradient id="isoCompLeft" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colorLeft1} />
              <stop offset="100%" stopColor={colorLeft2} />
            </linearGradient>
            <linearGradient id="isoCompRight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colorRight1} />
              <stop offset="100%" stopColor={colorRight2} />
            </linearGradient>

            {/* Locked gradients */}
            <linearGradient id="isoLockTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={dark ? '#4A4A48' : '#D0CEC5'} />
              <stop offset="100%" stopColor={dark ? '#3A3A38' : '#B8B6AE'} />
            </linearGradient>
            <linearGradient id="isoLockLeft" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={dark ? '#2A2A28' : '#7A7870'} />
              <stop offset="100%" stopColor={dark ? '#1A1A18' : '#5A5850'} />
            </linearGradient>
            <linearGradient id="isoLockRight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={dark ? '#3A3A38' : '#9A9890'} />
              <stop offset="100%" stopColor={dark ? '#2A2A28' : '#7A7870'} />
            </linearGradient>

            {/* Glow filter for current step */}
            <filter id="isoGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Pulse gradient for current step */}
            <radialGradient id="isoPulseGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={tabColor} stopOpacity="0.5">
                <animate attributeName="stop-opacity" values="0.5;0.15;0.5" dur="2s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor={tabColor} stopOpacity="0">
                <animate attributeName="stop-opacity" values="0;0;0" dur="2s" repeatCount="indefinite" />
              </stop>
            </radialGradient>

            {/* Clip path for profile token circle */}
            <clipPath id="profileClip">
              <circle cx="0" cy="0" r="1" />
            </clipPath>

            <style>{`
              @keyframes iso-pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.08); }
              }
              @keyframes token-bob {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-3px); }
              }
            `}</style>
          </defs>

          {/* Destination banner at top */}
          <g>
            <rect
              x={svgWidth / 2 - 60}
              y={8}
              width={120}
              height={28}
              rx={14}
              fill={`${tabColor}20`}
              stroke={`${tabColor}50`}
              strokeWidth={1}
            />
            <text
              x={svgWidth / 2}
              y={26}
              textAnchor="middle"
              fontSize={10}
              fontWeight={700}
              fill={tabColor}
            >
              {nextTitle}
            </text>
          </g>

          {/* Connector line — background (gray) */}
          {connectorPath && (
            <path
              d={connectorPath}
              fill="none"
              stroke={dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}
              strokeWidth={2}
              strokeLinecap="round"
              strokeDasharray="6 4"
            />
          )}

          {/* Connector line — progress (colored) */}
          {connectorPath && (
            <path
              d={connectorPath}
              fill="none"
              stroke={tabColor}
              strokeWidth={2}
              strokeLinecap="round"
              strokeOpacity={0.6}
              pathLength={1}
              style={{
                strokeDasharray: `${completionRatio} ${1 - completionRatio}`,
              }}
            />
          )}

          {/* Dashed line from last step to banner */}
          {steps.length > 0 && (() => {
            const lastStep = steps[steps.length - 1];
            const lx = lastStep.cx + offsetX;
            const ly = lastStep.cy + offsetY - lastStep.hw / 2;
            return (
              <line
                x1={lx}
                y1={ly}
                x2={svgWidth / 2}
                y2={36}
                stroke={dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
                strokeWidth={1}
                strokeDasharray="4 3"
              />
            );
          })()}

          {/* Isometric step tiles */}
          {steps.map((step) => {
            const cx = step.cx + offsetX;
            const cy = step.cy + offsetY;
            const { hw, depth } = step;
            const iconSize = Math.max(10, hw * 0.4);

            // Profile token — rendered on whichever step has showToken
            const tokenRadius = Math.max(14, hw * 0.42);
            const tokenCx = cx;
            const tokenCy = cy - hw / 2 - tokenRadius - 2;
            const initials = displayName ? displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?';

            const renderToken = () => (
              <g style={{ animation: 'token-bob 2.5s ease-in-out infinite' }}>
                {/* Shadow under token */}
                <ellipse
                  cx={tokenCx}
                  cy={tokenCy + tokenRadius + 2}
                  rx={tokenRadius * 0.6}
                  ry={tokenRadius * 0.15}
                  fill="rgba(0,0,0,0.2)"
                />
                {/* Outer ring (tabColor glow) */}
                <circle
                  cx={tokenCx}
                  cy={tokenCy}
                  r={tokenRadius + 3}
                  fill="none"
                  stroke={tabColor}
                  strokeWidth={2.5}
                  opacity={0.8}
                />
                {/* White border ring */}
                <circle
                  cx={tokenCx}
                  cy={tokenCy}
                  r={tokenRadius + 0.5}
                  fill="#fff"
                  stroke="#fff"
                  strokeWidth={2}
                />
                {/* Profile image or initials fallback */}
                {profileImage ? (
                  <>
                    <clipPath id={`tokenClip-${step.index}`}>
                      <circle cx={tokenCx} cy={tokenCy} r={tokenRadius} />
                    </clipPath>
                    <image
                      href={profileImage}
                      x={tokenCx - tokenRadius}
                      y={tokenCy - tokenRadius}
                      width={tokenRadius * 2}
                      height={tokenRadius * 2}
                      clipPath={`url(#tokenClip-${step.index})`}
                      preserveAspectRatio="xMidYMid slice"
                    />
                  </>
                ) : (
                  <>
                    <circle cx={tokenCx} cy={tokenCy} r={tokenRadius} fill={tabColor} />
                    <text
                      x={tokenCx}
                      y={tokenCy + tokenRadius * 0.35}
                      textAnchor="middle"
                      fontSize={tokenRadius * 0.8}
                      fontWeight={700}
                      fill="#fff"
                    >
                      {initials}
                    </text>
                  </>
                )}
              </g>
            );

            // Tree on completed leg-end steps — planted on the diamond top face
            const treeW = hw * 1.3;
            const treeH = treeW * 1.1;
            const showTree = step.isLegEnd && step.completed;
            // Place so the bottom of the tree box = the diamond center (top face)
            const renderTree = () => (
              <image
                href="./ach_tree.svg"
                x={cx - treeW / 2}
                y={cy - treeH + hw * 0.05}
                width={treeW}
                height={treeH}
                preserveAspectRatio="xMidYMax meet"
              />
            );

            if (step.isCurrent) {
              return (
                <g key={step.index}>
                  {/* Pulse ellipse behind diamond */}
                  <ellipse cx={cx} cy={cy} rx={hw + 10} ry={hw / 2 + 8} fill="url(#isoPulseGrad)">
                    <animate attributeName="rx" values={`${hw + 6};${hw + 16};${hw + 6}`} dur="2s" repeatCount="indefinite" />
                    <animate attributeName="ry" values={`${hw / 2 + 4};${hw / 2 + 12};${hw / 2 + 4}`} dur="2s" repeatCount="indefinite" />
                  </ellipse>
                  {/* 3D diamond with glow */}
                  <g filter="url(#isoGlow)" style={{ animation: 'iso-pulse 2s ease-in-out infinite', transformOrigin: `${cx}px ${cy}px` }}>
                    <polygon points={isoTopFace(cx, cy, hw)} fill="url(#isoCompTop)" />
                    <polygon points={isoLeftFace(cx, cy, hw, depth)} fill="url(#isoCompLeft)" />
                    <polygon points={isoRightFace(cx, cy, hw, depth)} fill="url(#isoCompRight)" />
                  </g>
                  {/* Profile token */}
                  {renderToken()}
                </g>
              );
            }

            if (step.completed) {
              return (
                <g key={step.index}>
                  <polygon points={isoTopFace(cx, cy, hw)} fill="url(#isoCompTop)" />
                  <polygon points={isoLeftFace(cx, cy, hw, depth)} fill="url(#isoCompLeft)" />
                  <polygon points={isoRightFace(cx, cy, hw, depth)} fill="url(#isoCompRight)" />
                  {/* Tree on leg-end steps (rendered after block so it appears on top) */}
                  {showTree && renderTree()}
                  {/* Checkmark icon (skip if token or tree is here) */}
                  {!step.showToken && !showTree && (
                    <foreignObject x={cx - iconSize / 2} y={cy - iconSize / 2} width={iconSize} height={iconSize}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: iconSize, height: iconSize }}>
                        <HugeiconsIcon icon={Tick01IconData} size={iconSize * 0.8} style={{ color: '#fff' }} />
                      </div>
                    </foreignObject>
                  )}
                  {/* Profile token on completed step when all done */}
                  {step.showToken && renderToken()}
                </g>
              );
            }

            // Locked step — progressive opacity fade
            const lockedIdx = step.index - lockedStartIdx;
            const opacity = Math.max(0.15, 0.75 - (lockedIdx / totalLocked) * 0.6);

            return (
              <g key={step.index} opacity={opacity}>
                <polygon points={isoTopFace(cx, cy, hw)} fill="url(#isoLockTop)" />
                <polygon points={isoLeftFace(cx, cy, hw, depth)} fill="url(#isoLockLeft)" />
                <polygon points={isoRightFace(cx, cy, hw, depth)} fill="url(#isoLockRight)" />
                {/* Lock icon */}
                <foreignObject x={cx - iconSize / 2} y={cy - iconSize / 2} width={iconSize} height={iconSize}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: iconSize, height: iconSize }}>
                    <HugeiconsIcon icon={LockIconData} size={iconSize * 0.7} style={{ color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)' }} />
                  </div>
                </foreignObject>
              </g>
            );
          })}

          {/* Start label at bottom */}
          <g>
            <rect
              x={svgWidth / 2 - 40}
              y={svgHeight - 30}
              width={80}
              height={22}
              rx={11}
              fill={dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}
            />
            <text
              x={svgWidth / 2}
              y={svgHeight - 15}
              textAnchor="middle"
              fontSize={9}
              fontWeight={600}
              fill={dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)'}
            >
              Level {currentLevel}
            </text>
          </g>
        </svg>
      </div>

      {/* Footer stats */}
      <div
        className="px-4 py-3 text-center"
        style={{
          borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
          background: `linear-gradient(135deg, ${tabColor}08, transparent)`,
        }}
      >
        <div className="flex items-center justify-center gap-1.5">
          <HugeiconsIcon icon={Trophy01IconData} size={13} style={{ color: tabColor }} />
          <span className="text-[11px] font-semibold" style={{ color: tabColor }}>
            {totalSteps - completedSteps} achievements to go
          </span>
        </div>
      </div>
    </div>
  );
}
