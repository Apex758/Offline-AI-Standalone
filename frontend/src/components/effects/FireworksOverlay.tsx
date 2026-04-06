import { useEffect, useRef } from 'react';
import { Fireworks } from 'fireworks-js';
import type { AchievementRarity } from '../../types/achievement';

const RARITY_COLORS: Record<AchievementRarity, string[]> = {
  common:    ['#9ca3af', '#d1d5db', '#e5e7eb', '#6b7280'],
  uncommon:  ['#22c55e', '#4ade80', '#86efac', '#15803d', '#bbf7d0'],
  rare:      ['#3b82f6', '#60a5fa', '#93c5fd', '#1d4ed8', '#dbeafe'],
  epic:      ['#a855f7', '#c084fc', '#d8b4fe', '#7c3aed', '#f3e8ff'],
  legendary: ['#f59e0b', '#fbbf24', '#fde68a', '#d97706', '#fff7ed', '#fb923c'],
};

interface FireworksOverlayProps {
  rarity: AchievementRarity;
}

export default function FireworksOverlay({ rarity }: FireworksOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fwRef = useRef<Fireworks | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const isLegendary = rarity === 'legendary';

    fwRef.current = new Fireworks(el, {
      autoresize: true,
      opacity: 0.55,
      acceleration: 1.03,
      friction: 0.97,
      gravity: 1.3,
      particles: isLegendary ? 160 : 110,
      traceLength: 5,
      traceSpeed: 9,
      explosion: isLegendary ? 10 : 7,
      intensity: isLegendary ? 32 : 20,
      flickering: 55,
      lineStyle: 'round',
      hue: { min: 0, max: 360 },
      delay: { min: 20, max: 35 },
      rocketsPoint: { min: 15, max: 85 },
      lineWidth: {
        explosion: { min: 2, max: isLegendary ? 5 : 3.5 },
        trace: { min: 0.5, max: 1.2 },
      },
      brightness: { min: 55, max: 82 },
      // Long decay = dramatic trails that linger
      decay: { min: 0.010, max: 0.018 },
      mouse: { click: false, move: false, max: 1 },
      colors: RARITY_COLORS[rarity],
    });

    fwRef.current.start();

    // Fire hard for 5s then let in-flight particles decay naturally
    const stopTimer = setTimeout(() => {
      fwRef.current?.stop();
    }, 5000);

    return () => {
      clearTimeout(stopTimer);
      fwRef.current?.stop();
      fwRef.current?.destroy();
      fwRef.current = null;
    };
  }, [rarity]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9997,
        pointerEvents: 'none',
      }}
    />
  );
}
