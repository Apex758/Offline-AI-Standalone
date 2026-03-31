import React, { useMemo } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import LockIconData from '@hugeicons/core-free-icons/LockIcon';
import Tick01IconData from '@hugeicons/core-free-icons/Tick01Icon';
import GiftIconData from '@hugeicons/core-free-icons/GiftIcon';
import Trophy01IconData from '@hugeicons/core-free-icons/Award01Icon';
import StarIconData from '@hugeicons/core-free-icons/StarIcon';
import QuestionIconData from '@hugeicons/core-free-icons/HelpCircleIcon';
import type { TeacherRank } from '../types/achievement';

// Mirror of backend RANKS for step calculation
const RANKS = [
  { level: 1, title: 'Newcomer', required: 0 },
  { level: 2, title: 'Apprentice Teacher', required: 5 },
  { level: 3, title: 'Developing Educator', required: 12 },
  { level: 4, title: 'Proficient Instructor', required: 20 },
  { level: 5, title: 'Experienced Educator', required: 30 },
  { level: 6, title: 'Master Teacher', required: 40 },
  { level: 7, title: 'OECS Champion', required: 50 },
];

interface LevelJourneyPathProps {
  rank: TeacherRank | null;
  earnedCount: number;
  tabColor: string;
}

export default function LevelJourneyPath({ rank, earnedCount, tabColor }: LevelJourneyPathProps) {
  const currentLevel = rank?.level ?? 1;

  const { totalSteps, completedSteps, nextTitle, nextRequired, prevRequired } = useMemo(() => {
    const currentRankIdx = RANKS.findIndex(r => r.level === currentLevel);
    const prev = RANKS[currentRankIdx]?.required ?? 0;

    // If max level, show full bar
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

  // Build step data — zigzag pattern: 3 columns, alternating left-to-right / right-to-left
  const COLS = 3;
  const steps = useMemo(() => {
    const result: { row: number; col: number; index: number; completed: boolean; isCurrent: boolean; isMilestone: boolean }[] = [];
    for (let i = 0; i < totalSteps; i++) {
      const row = Math.floor(i / COLS);
      const isEvenRow = row % 2 === 0;
      const posInRow = i % COLS;
      const col = isEvenRow ? posInRow : (COLS - 1 - posInRow);
      const completed = i < completedSteps;
      const isCurrent = i === completedSteps;
      // Milestones at ~33% and ~66% of the way
      const isMilestone = totalSteps >= 6
        ? (i === Math.floor(totalSteps / 3) || i === Math.floor((totalSteps * 2) / 3))
        : (totalSteps >= 3 && i === Math.floor(totalSteps / 2));

      result.push({ row, col, index: i, completed, isCurrent, isMilestone });
    }
    return result;
  }, [totalSteps, completedSteps]);

  const totalRows = Math.ceil(totalSteps / COLS);

  // Tile sizing
  const TILE = 44;
  const GAP_X = 12;
  const GAP_Y = 16;
  const PADDING_X = 16;
  const PADDING_TOP = 72;
  const PADDING_BOTTOM = 56;

  const gridWidth = COLS * TILE + (COLS - 1) * GAP_X;
  const svgWidth = gridWidth + PADDING_X * 2;
  const svgHeight = totalRows * TILE + (totalRows - 1) * GAP_Y + PADDING_TOP + PADDING_BOTTOM;

  // Coordinate helper — bottom-to-top (row 0 at bottom)
  const tileCenter = (row: number, col: number) => ({
    x: PADDING_X + col * (TILE + GAP_X) + TILE / 2,
    y: svgHeight - PADDING_BOTTOM - row * (TILE + GAP_Y) - TILE / 2,
  });

  // Build connector path between sequential steps
  const connectorPath = useMemo(() => {
    if (steps.length < 2) return '';
    const parts: string[] = [];
    for (let i = 0; i < steps.length - 1; i++) {
      const from = tileCenter(steps[i].row, steps[i].col);
      const to = tileCenter(steps[i + 1].row, steps[i + 1].col);
      if (i === 0) parts.push(`M ${from.x} ${from.y}`);
      // Smooth curve for row transitions, straight for same-row
      if (steps[i].row !== steps[i + 1].row) {
        const midY = (from.y + to.y) / 2;
        parts.push(`C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`);
      } else {
        parts.push(`L ${to.x} ${to.y}`);
      }
    }
    return parts.join(' ');
  }, [steps, svgHeight]);

  // How far along the connector is completed (0–1)
  const completionRatio = totalSteps > 1 ? completedSteps / (totalSteps - 1) : 1;

  const dark = document.documentElement.classList.contains('dark');

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: dark
          ? 'linear-gradient(180deg, rgba(20,20,20,0.9) 0%, rgba(30,30,30,0.95) 100%)'
          : 'linear-gradient(180deg, rgba(245,245,245,0.95) 0%, rgba(235,235,235,0.98) 100%)',
        border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
        boxShadow: dark
          ? '0 8px 32px rgba(0,0,0,0.4)'
          : '0 8px 32px rgba(0,0,0,0.08)',
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 text-center"
        style={{
          background: `linear-gradient(135deg, ${tabColor}22, ${tabColor}11)`,
          borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
        }}
      >
        <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: tabColor }}>
          Level {currentLevel} Journey
        </div>
        <div className="text-[10px] mt-0.5" style={{ color: dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)' }}>
          {completedSteps}/{totalSteps} steps to <span className="font-semibold">{nextTitle}</span>
        </div>
      </div>

      {/* SVG Journey */}
      <div className="flex justify-center px-2 py-3">
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ display: 'block' }}
        >
          <defs>
            {/* Glow filter for current step */}
            <filter id="currentGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Pulse animation */}
            <radialGradient id="pulseGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={tabColor} stopOpacity="0.5">
                <animate attributeName="stopOpacity" values="0.5;0.15;0.5" dur="2s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor={tabColor} stopOpacity="0">
                <animate attributeName="stopOpacity" values="0;0;0" dur="2s" repeatCount="indefinite" />
              </stop>
            </radialGradient>
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

          {/* Connector line — background (grey) */}
          {connectorPath && (
            <path
              d={connectorPath}
              fill="none"
              stroke={dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}
              strokeWidth={3}
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
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray="6 4"
              strokeOpacity={0.6}
              pathLength={1}
              strokeDashoffset={1 - completionRatio}
              style={{
                // Override dasharray to use pathLength-based progress
                strokeDasharray: `${completionRatio} ${1 - completionRatio}`,
              }}
            />
          )}

          {/* Step tiles */}
          {steps.map((step) => {
            const { x, y } = tileCenter(step.row, step.col);
            const halfTile = TILE / 2;

            if (step.isCurrent) {
              // Current position — animated pulse + marker
              return (
                <g key={step.index}>
                  {/* Pulse ring */}
                  <circle cx={x} cy={y} r={TILE / 2 + 8} fill="url(#pulseGrad)">
                    <animate attributeName="r" values={`${TILE / 2 + 4};${TILE / 2 + 12};${TILE / 2 + 4}`} dur="2s" repeatCount="indefinite" />
                  </circle>
                  {/* Tile */}
                  <rect
                    x={x - halfTile}
                    y={y - halfTile}
                    width={TILE}
                    height={TILE}
                    rx={12}
                    fill={tabColor}
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth={2}
                    filter="url(#currentGlow)"
                  />
                  {/* Arrow / you-are-here icon */}
                  <foreignObject x={x - 10} y={y - 10} width={20} height={20}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20 }}>
                      <HugeiconsIcon icon={StarIconData} size={14} style={{ color: '#fff' }} />
                    </div>
                  </foreignObject>
                  {/* "You" label */}
                  <text
                    x={x}
                    y={y + halfTile + 14}
                    textAnchor="middle"
                    fontSize={9}
                    fontWeight={700}
                    fill={tabColor}
                  >
                    YOU
                  </text>
                </g>
              );
            }

            if (step.completed) {
              // Completed step
              return (
                <g key={step.index}>
                  <rect
                    x={x - halfTile}
                    y={y - halfTile}
                    width={TILE}
                    height={TILE}
                    rx={12}
                    fill={`${tabColor}cc`}
                    stroke={`${tabColor}40`}
                    strokeWidth={1}
                  />
                  {step.isMilestone ? (
                    <foreignObject x={x - 10} y={y - 10} width={20} height={20}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20 }}>
                        <HugeiconsIcon icon={GiftIconData} size={14} style={{ color: '#fff' }} />
                      </div>
                    </foreignObject>
                  ) : (
                    <foreignObject x={x - 9} y={y - 9} width={18} height={18}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18 }}>
                        <HugeiconsIcon icon={Tick01IconData} size={13} style={{ color: '#fff' }} />
                      </div>
                    </foreignObject>
                  )}
                  {/* Step number */}
                  <text
                    x={x}
                    y={y + halfTile + 12}
                    textAnchor="middle"
                    fontSize={8}
                    fill={dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)'}
                  >
                    {step.index + 1}
                  </text>
                </g>
              );
            }

            // Locked step
            return (
              <g key={step.index}>
                <rect
                  x={x - halfTile}
                  y={y - halfTile}
                  width={TILE}
                  height={TILE}
                  rx={12}
                  fill={dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
                  stroke={dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}
                  strokeWidth={1}
                />
                {step.isMilestone ? (
                  <foreignObject x={x - 10} y={y - 10} width={20} height={20}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20 }}>
                      <HugeiconsIcon icon={QuestionIconData} size={14} style={{ color: dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }} />
                    </div>
                  </foreignObject>
                ) : (
                  <foreignObject x={x - 9} y={y - 9} width={18} height={18}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18 }}>
                      <HugeiconsIcon icon={LockIconData} size={12} style={{ color: dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)' }} />
                    </div>
                  </foreignObject>
                )}
                {/* Step number */}
                <text
                  x={x}
                  y={y + halfTile + 12}
                  textAnchor="middle"
                  fontSize={8}
                  fill={dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'}
                >
                  {step.index + 1}
                </text>
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

          {/* Top finish flag connector */}
          {steps.length > 0 && (() => {
            const lastStep = steps[steps.length - 1];
            const { x, y } = tileCenter(lastStep.row, lastStep.col);
            const bannerY = 36;
            return (
              <line
                x1={x}
                y1={y - TILE / 2}
                x2={svgWidth / 2}
                y2={bannerY}
                stroke={dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
                strokeWidth={1}
                strokeDasharray="4 3"
              />
            );
          })()}
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
