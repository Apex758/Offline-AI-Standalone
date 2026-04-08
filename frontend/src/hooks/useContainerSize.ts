import { useRef, useState, useEffect, useCallback } from 'react';

/**
 * Hook that reliably measures a container's dimensions using ResizeObserver
 * with a fallback for environments where ResponsiveContainer fails (e.g. Electron file://)
 *
 * Uses a callback ref so measurement re-runs whenever the DOM node attaches or
 * changes (e.g. when a parent component switches from an empty-state branch to
 * a chart branch that first introduces the ref'd element).
 */
export function useContainerSize<T extends HTMLElement = HTMLDivElement>() {
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const cleanupRef = useRef<(() => void) | null>(null);

  const setRef = useCallback((el: T | null) => {
    // Clean up previous element's observers/timers
    cleanupRef.current?.();
    cleanupRef.current = null;

    if (!el) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    let rafId = 0;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      let w = Math.round(rect.width);
      let h = Math.round(rect.height);
      // Fallback to offset dimensions if getBoundingClientRect returns 0
      // (can happen in Electron file:// before layout is complete)
      if (w === 0 && el.offsetWidth > 0) w = el.offsetWidth;
      if (h === 0 && el.offsetHeight > 0) h = el.offsetHeight;
      setSize(prev => {
        if (prev.width !== w || prev.height !== h) return { width: w, height: h };
        return prev;
      });
      return w > 0 && h > 0;
    };

    // Initial measurement
    const gotSize = measure();

    // Post-paint measurement via rAF (more reliable than setTimeout in Electron)
    rafId = requestAnimationFrame(() => {
      if (!measure()) {
        rafId = requestAnimationFrame(measure);
      }
    });

    // Retry with escalating delays for Electron file:// timing issues
    const delays = gotSize ? [100] : [100, 300, 600, 1000];
    delays.forEach(d => timers.push(setTimeout(measure, d)));

    const observer = new ResizeObserver(measure);
    observer.observe(el);

    cleanupRef.current = () => {
      cancelAnimationFrame(rafId);
      timers.forEach(clearTimeout);
      observer.disconnect();
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => () => { cleanupRef.current?.(); }, []);

  return { ref: setRef, width: size.width, height: size.height };
}
