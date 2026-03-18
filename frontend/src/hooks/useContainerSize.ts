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
      const { width, height } = ref.current.getBoundingClientRect();
      setSize(prev => {
        if (prev.width !== Math.round(width) || prev.height !== Math.round(height)) {
          return { width: Math.round(width), height: Math.round(height) };
        }
        return prev;
      });
    }
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Initial measurement + delayed re-measure for file:// timing issues
    measure();
    const timer = setTimeout(measure, 50);

    const observer = new ResizeObserver(() => measure());
    observer.observe(el);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [measure]);

  return { ref, width: size.width, height: size.height };
}
