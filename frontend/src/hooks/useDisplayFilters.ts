import { useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';

/**
 * Applies brightness filter and warm-tone overlay to the page.
 * - Brightness: CSS filter on <html>
 * - Warm tone: fixed overlay div with amber tint via mix-blend-mode: multiply
 *
 * Exposes the current brightness value via a CSS variable (--app-brightness)
 * so the FAB display panel can apply an inverse filter to stay unaffected.
 */
export const useDisplayFilters = () => {
  const { settings } = useSettings();

  // Brightness filter on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (settings.brightness === 100) {
      root.style.filter = '';
    } else {
      root.style.filter = `brightness(${settings.brightness / 100})`;
    }
    root.style.setProperty('--app-brightness', String(settings.brightness / 100));
  }, [settings.brightness]);

  // Warm tone overlay
  useEffect(() => {
    const OVERLAY_ID = 'warm-tone-overlay';
    let overlay = document.getElementById(OVERLAY_ID);

    if (settings.warmToneEnabled && settings.warmTone > 0) {
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = OVERLAY_ID;
        document.body.appendChild(overlay);
      }
      const alpha = (settings.warmTone / 100) * 0.25;
      overlay.style.background = `rgba(255, 166, 0, ${alpha})`;
    } else if (overlay) {
      overlay.style.background = 'rgba(255, 166, 0, 0)';
    }
  }, [settings.warmTone, settings.warmToneEnabled]);

  // Full cleanup on unmount
  useEffect(() => {
    return () => {
      document.documentElement.style.filter = '';
      document.documentElement.style.removeProperty('--app-brightness');
      const overlay = document.getElementById('warm-tone-overlay');
      if (overlay) overlay.remove();
    };
  }, []);
};
