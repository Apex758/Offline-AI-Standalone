import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { findMisspelledWords, getSuggestions, addCustomWord, MisspelledWord } from '../utils/spellCheck';
import { applyAutocorrect } from '../utils/autocorrect';
import { useSettings } from '../contexts/SettingsContext';
import React from 'react';

export interface PopupState {
  word: string;
  start: number;
  end: number;
  suggestions: string[];
  x: number;
  y: number;
}

interface UseSmartTextOptions {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  disableSmart?: boolean;
  /** Enable auto-finish sentence feature (only for textarea) */
  enableAutoFinish?: boolean;
}

interface UseSmartTextReturn {
  // Feature flags
  spellCheckEnabled: boolean;
  dictionaryEnabled: boolean;
  autocorrectEnabled: boolean;
  autoFinishEnabled: boolean;
  // State
  misspelled: MisspelledWord[];
  popup: PopupState | null;
  setPopup: React.Dispatch<React.SetStateAction<PopupState | null>>;
  ghostText: string;
  // Refs
  containerRef: React.RefObject<HTMLDivElement | null>;
  spellCheckTimerRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
  // Handlers
  handleAutocorrect: (newValue: string, cursorPos: number) => { value: string; cursorPos: number } | null;
  replaceWord: (replacement: string) => void;
  handleAddToDictionary: () => void;
  // Render helpers
  buildBackdropParts: () => React.ReactNode[];
  renderPopup: (maxContainerWidth: number) => React.ReactNode;
}

export function useSmartText({
  value,
  onChange,
  disabled = false,
  disableSmart = false,
  enableAutoFinish = false,
}: UseSmartTextOptions): UseSmartTextReturn {
  const { settings } = useSettings();
  const spellCheckEnabled = settings.spellCheckEnabled && !disableSmart && !disabled;
  const dictionaryEnabled = settings.dictionaryEnabled && spellCheckEnabled;
  const autocorrectEnabled = settings.autocorrectEnabled && !disableSmart && !disabled;
  const autoFinishEnabled = enableAutoFinish && settings.autoFinishEnabled && !disableSmart && !disabled;

  const containerRef = useRef<HTMLDivElement>(null);
  const [misspelled, setMisspelled] = useState<MisspelledWord[]>([]);
  const [popup, setPopup] = useState<PopupState | null>(null);
  const [ghostText, setGhostText] = useState('');
  const spellCheckTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoCompleteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoCompleteAbortRef = useRef<AbortController | null>(null);

  // Spell check with debounce
  useEffect(() => {
    if (!spellCheckEnabled) {
      setMisspelled([]);
      return;
    }

    if (spellCheckTimerRef.current) clearTimeout(spellCheckTimerRef.current);

    spellCheckTimerRef.current = setTimeout(() => {
      const results = findMisspelledWords(value || '');
      setMisspelled(results);
    }, 300);

    return () => {
      if (spellCheckTimerRef.current) clearTimeout(spellCheckTimerRef.current);
    };
  }, [value, spellCheckEnabled]);

  // Auto-complete sentence with debounce
  useEffect(() => {
    if (!autoFinishEnabled) {
      setGhostText('');
      return;
    }

    if (autoCompleteTimerRef.current) clearTimeout(autoCompleteTimerRef.current);
    if (autoCompleteAbortRef.current) autoCompleteAbortRef.current.abort();
    setGhostText('');

    const trimmed = (value || '').trim();
    if (trimmed.length < 10) return;
    if (/[.!?]\s*$/.test(trimmed)) return;

    autoCompleteTimerRef.current = setTimeout(async () => {
      const controller = new AbortController();
      autoCompleteAbortRef.current = controller;

      try {
        const response = await fetch('http://localhost:8000/api/autocomplete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: value, max_tokens: 20 }),
          signal: controller.signal,
        });

        if (response.ok) {
          const data = await response.json();
          if (data.completion && !controller.signal.aborted) {
            setGhostText(data.completion);
          }
        }
      } catch (e) {
        // Aborted or network error - ignore
      } finally {
        if (autoCompleteAbortRef.current === controller) {
          autoCompleteAbortRef.current = null;
        }
      }
    }, 1500);

    return () => {
      if (autoCompleteTimerRef.current) clearTimeout(autoCompleteTimerRef.current);
      if (autoCompleteAbortRef.current) autoCompleteAbortRef.current.abort();
    };
  }, [value, autoFinishEnabled]);

  // Handle autocorrect on a changed value — returns corrected value + cursor or null
  const handleAutocorrect = useCallback((newValue: string, cursorPos: number) => {
    if (!autocorrectEnabled) return null;
    if (newValue.length <= (value?.length || 0)) return null;

    const lastChar = newValue[cursorPos - 1];
    if (lastChar === ' ' || lastChar === '\n') {
      const result = applyAutocorrect(newValue, cursorPos);
      if (result) {
        setGhostText('');
        setPopup(null);
        return { value: result.text, cursorPos: result.newCursorPos };
      }
    }
    return null;
  }, [autocorrectEnabled, value]);

  // Replace misspelled word with suggestion
  const replaceWord = useCallback((replacement: string) => {
    if (!popup) return;
    const newValue = (value || '').slice(0, popup.start) + replacement + (value || '').slice(popup.end);
    onChange(newValue);
    setPopup(null);
  }, [popup, value, onChange]);

  // Add word to custom dictionary
  const handleAddToDictionary = useCallback(() => {
    if (!popup) return;
    addCustomWord(popup.word);
    setPopup(null);
    setMisspelled(prev => prev.filter(m => m.word.toLowerCase() !== popup.word.toLowerCase()));
  }, [popup]);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popup && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setPopup(null);
      }
    };
    if (popup) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [popup]);

  // Build backdrop parts for spell-check underlines (+ optional ghost text)
  const buildBackdropParts = useCallback((): React.ReactNode[] => {
    const text = value || '';
    const parts: React.ReactNode[] = [];

    if (!spellCheckEnabled || misspelled.length === 0) {
      parts.push(
        React.createElement('span', { key: 'all', style: { color: 'transparent' } }, text || ' ')
      );
    } else {
      let lastIndex = 0;
      misspelled.forEach((m, i) => {
        if (m.start > lastIndex) {
          parts.push(
            React.createElement('span', { key: `t-${i}`, style: { color: 'transparent' } }, text.slice(lastIndex, m.start))
          );
        }
        parts.push(
          React.createElement('span', {
            key: `m-${i}`,
            style: {
              color: 'transparent',
              textDecoration: 'underline wavy',
              textDecorationColor: '#ef4444',
              textUnderlineOffset: '3px',
              textDecorationThickness: '1.5px',
              borderRadius: '2px',
              cursor: 'pointer',
            }
          }, text.slice(m.start, m.end))
        );
        lastIndex = m.end;
      });
      if (lastIndex < text.length) {
        parts.push(
          React.createElement('span', { key: 'tail', style: { color: 'transparent' } }, text.slice(lastIndex))
        );
      }
    }

    // Append inline ghost text
    if (ghostText) {
      parts.push(
        React.createElement('span', { key: 'ghost', style: { color: '#9ca3af', opacity: 0.6 } }, ghostText)
      );
    }

    return parts;
  }, [value, misspelled, spellCheckEnabled, ghostText]);

  // Render the suggestion popup
  const renderPopup = useCallback((maxContainerWidth: number): React.ReactNode => {
    if (!popup) return null;

    return React.createElement('div', {
      className: 'smart-text-popup',
      style: {
        position: 'absolute',
        left: `${Math.min(popup.x, maxContainerWidth - 200)}px`,
        top: `${popup.y}px`,
        zIndex: 50,
        transform: 'translateY(-100%)',
        minWidth: '160px',
        maxWidth: '250px',
      },
      onMouseDown: (e: React.MouseEvent) => e.preventDefault(),
    },
      React.createElement('div', {
        className: 'bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden'
      },
        // Header
        React.createElement('div', {
          className: 'px-3 py-1.5 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700'
        },
          React.createElement('span', { className: 'text-xs font-medium text-red-500' }, `\u201C${popup.word}\u201D`)
        ),
        // Suggestions
        popup.suggestions.length > 0
          ? React.createElement('div', { className: 'py-1' },
              popup.suggestions.map((suggestion, i) =>
                React.createElement('button', {
                  key: i,
                  onClick: () => replaceWord(suggestion),
                  className: 'w-full text-left px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300 transition-colors',
                }, suggestion)
              )
            )
          : React.createElement('div', { className: 'px-3 py-2 text-xs text-gray-400' }, 'No suggestions'),
        // Add to dictionary
        React.createElement('div', {
          className: 'border-t border-gray-200 dark:border-gray-700 px-3 py-1.5'
        },
          React.createElement('button', {
            onClick: handleAddToDictionary,
            className: 'text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors',
          }, '+ Add to dictionary')
        )
      )
    );
  }, [popup, replaceWord, handleAddToDictionary]);

  return {
    spellCheckEnabled,
    dictionaryEnabled,
    autocorrectEnabled,
    autoFinishEnabled,
    misspelled,
    popup,
    setPopup,
    ghostText,
    containerRef,
    spellCheckTimerRef,
    handleAutocorrect,
    replaceWord,
    handleAddToDictionary,
    buildBackdropParts,
    renderPopup,
  };
}
