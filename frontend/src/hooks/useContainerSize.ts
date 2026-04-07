import { useRef, useState, useEffect, useCallback } from 'react';

/**
 * Hook that reliably measures a container's dimensions using ResizeObserver
 * with a fallback for environments where ResponsiveContainer fails (e.g. Electron file://)
 */
export function useContainerSize<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  const measure = useCallback(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      let w = Math.round(rect.width);
      let h = Math.round(rect.height);
      // Fallback to offset dimensions if getBoundingClientRect returns 0
      // (can happen in Electron file:// before layout is complete)
      if (w === 0 && ref.current.offsetWidth > 0) w = ref.current.offsetWidth;
      if (h === 0 && ref.current.offsetHeight > 0) h = ref.current.offsetHeight;
      setSize(prev => {
        if (prev.width !== w || prev.height !== h) {
          return { width: w, height: h };
        }
        return prev;
      });
      return w > 0 && h > 0;
    }
    return false;
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Initial measurement
    const gotSize = measure();

    // Use rAF for post-paint measurement (more reliable than setTimeout in Electron)
    let rafId = requestAnimationFrame(() => {
      if (!measure()) {
        // Double-rAF: fires after the next paint cycle
        rafId = requestAnimationFrame(measure);
      }
    });

    // Retry with escalating delays for Electron file:// timing issues
    const timers: ReturnType<typeof setTimeout>[] = [];
    if (!gotSize) {
      const delays = [100, 300, 600, 1000];
      for (const delay of delays) {
        timers.push(setTimeout(measure, delay));
      }
    } else {
      timers.push(setTimeout(measure, 100));
    }

    const observer = new ResizeObserver(() => measure());
    observer.observe(el);

    return () => {
      cancelAnimationFrame(rafId);
      timers.forEach(t => clearTimeout(t));
      observer.disconnect();
    };
  }, [measure]);

  return { ref, width: size.width, height: size.height };
}
