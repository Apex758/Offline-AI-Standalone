import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { findMisspelledWords, getSuggestions, addCustomWord, MisspelledWord } from '../utils/spellCheck';
import { applyAutocorrect } from '../utils/autocorrect';
import { useSettings } from '../contexts/SettingsContext';

interface SmartInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  /** Disable all smart features */
  disableSmart?: boolean;
}

interface PopupState {
  word: string;
  start: number;
  end: number;
  suggestions: string[];
  x: number;
  y: number;
}

const SmartInput: React.FC<SmartInputProps> = ({
  value,
  onChange,
  disableSmart = false,
  className = '',
  style,
  disabled,
  type,
  ...rest
}) => {
  const { settings } = useSettings();

  // Only enable for text-like inputs
  const isTextType = !type || type === 'text' || type === 'search';
  const spellCheckEnabled = settings.spellCheckEnabled && !disableSmart && !disabled && isTextType;
  const dictionaryEnabled = settings.dictionaryEnabled && spellCheckEnabled;
  const autocorrectEnabled = settings.autocorrectEnabled && !disableSmart && !disabled && isTextType;

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const [misspelled, setMisspelled] = useState<MisspelledWord[]>([]);
  const [popup, setPopup] = useState<PopupState | null>(null);
  const spellCheckTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Sync scroll between input and backdrop
  const handleScroll = useCallback(() => {
    if (backdropRef.current && inputRef.current) {
      backdropRef.current.scrollLeft = inputRef.current.scrollLeft;
    }
  }, []);

  // Handle text changes with autocorrect
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    let cursorPos = e.target.selectionStart || 0;

    if (autocorrectEnabled && newValue.length > (value?.length || 0)) {
      const lastChar = newValue[cursorPos - 1];
      if (lastChar === ' ') {
        const result = applyAutocorrect(newValue, cursorPos);
        if (result) {
          newValue = result.text;
          cursorPos = result.newCursorPos;
          requestAnimationFrame(() => {
            if (inputRef.current) {
              inputRef.current.selectionStart = cursorPos;
              inputRef.current.selectionEnd = cursorPos;
            }
          });
        }
      }
    }

    setPopup(null);
    onChange(newValue);
  }, [onChange, autocorrectEnabled, value]);

  // Handle click to detect misspelled word
  const handleClick = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
    if (!dictionaryEnabled || misspelled.length === 0) {
      setPopup(null);
      if (rest.onClick) (rest.onClick as any)(e);
      return;
    }

    const input = inputRef.current;
    if (!input) return;

    const cursorPos = input.selectionStart || 0;
    const clickedWord = misspelled.find(m => cursorPos >= m.start && cursorPos <= m.end);

    if (clickedWord) {
      const pos = getInputCaretCoordinates(input, clickedWord.start);
      setPopup({
        word: clickedWord.word,
        start: clickedWord.start,
        end: clickedWord.end,
        suggestions: getSuggestions(clickedWord.word),
        x: pos.left,
        y: pos.top - 8,
      });
    } else {
      setPopup(null);
    }

    if (rest.onClick) (rest.onClick as any)(e);
  }, [dictionaryEnabled, misspelled, rest.onClick]);

  // Replace misspelled word with suggestion
  const replaceWord = useCallback((replacement: string) => {
    if (!popup) return;
    const newValue = (value || '').slice(0, popup.start) + replacement + (value || '').slice(popup.end);
    onChange(newValue);
    setPopup(null);

    requestAnimationFrame(() => {
      if (inputRef.current) {
        const newPos = popup.start + replacement.length;
        inputRef.current.selectionStart = newPos;
        inputRef.current.selectionEnd = newPos;
        inputRef.current.focus();
      }
    });
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

  // Render highlighted backdrop content
  const backdropContent = useMemo(() => {
    const text = value || '';
    if (!spellCheckEnabled || misspelled.length === 0) {
      return <span style={{ color: 'transparent', whiteSpace: 'pre' }}>{text || '\u00A0'}</span>;
    }

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    misspelled.forEach((m, i) => {
      if (m.start > lastIndex) {
        parts.push(
          <span key={`t-${i}`} style={{ color: 'transparent', whiteSpace: 'pre' }}>
            {text.slice(lastIndex, m.start)}
          </span>
        );
      }
      parts.push(
        <span
          key={`m-${i}`}
          style={{
            color: 'transparent',
            whiteSpace: 'pre',
            textDecoration: 'underline wavy',
            textDecorationColor: '#ef4444',
            textUnderlineOffset: '3px',
            textDecorationThickness: '1.5px',
          }}
        >
          {text.slice(m.start, m.end)}
        </span>
      );
      lastIndex = m.end;
    });

    if (lastIndex < text.length) {
      parts.push(
        <span key="tail" style={{ color: 'transparent', whiteSpace: 'pre' }}>
          {text.slice(lastIndex)}
        </span>
      );
    }

    return parts;
  }, [value, misspelled, spellCheckEnabled]);

  // If no smart features enabled, render plain input
  if (!spellCheckEnabled && !autocorrectEnabled) {
    return (
      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={className}
        style={style}
        disabled={disabled}
        {...rest}
      />
    );
  }

  return (
    <div ref={containerRef} className="smart-input-container" style={{ position: 'relative', display: 'contents' }}>
      {/* Backdrop for spell-check highlights */}
      {spellCheckEnabled && (
        <div
          ref={backdropRef}
          aria-hidden="true"
          className={className}
          style={{
            ...style,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 1,
            whiteSpace: 'nowrap',
            background: 'transparent',
            border: '1px solid transparent',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {backdropContent}
        </div>
      )}

      {/* The actual input */}
      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={handleChange}
        onScroll={handleScroll}
        onClick={handleClick}
        className={className}
        style={{
          ...style,
          background: spellCheckEnabled ? 'transparent' : undefined,
          position: 'relative',
          zIndex: 2,
        }}
        disabled={disabled}
        {...{ ...rest, onClick: undefined }}
      />

      {/* Suggestion popup */}
      {popup && (
        <div
          className="smart-input-popup"
          style={{
            position: 'absolute',
            left: `${Math.min(popup.x, (containerRef.current?.clientWidth || 300) - 200)}px`,
            top: `${popup.y}px`,
            zIndex: 50,
            transform: 'translateY(-100%)',
            minWidth: '160px',
            maxWidth: '250px',
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-3 py-1.5 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
              <span className="text-xs font-medium text-red-500">
                &ldquo;{popup.word}&rdquo;
              </span>
            </div>

            {popup.suggestions.length > 0 ? (
              <div className="py-1">
                {popup.suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => replaceWord(suggestion)}
                    className="w-full text-left px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-3 py-2 text-xs text-gray-400">No suggestions</div>
            )}

            <div className="border-t border-gray-200 dark:border-gray-700 px-3 py-1.5">
              <button
                onClick={handleAddToDictionary}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                + Add to dictionary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper: get pixel coordinates of a character position in an input
function getInputCaretCoordinates(input: HTMLInputElement, position: number): { top: number; left: number } {
  const div = document.createElement('div');
  const computed = window.getComputedStyle(input);

  const properties = [
    'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing',
    'textTransform', 'wordSpacing', 'textIndent', 'paddingTop', 'paddingRight',
    'paddingBottom', 'paddingLeft', 'borderTopWidth', 'borderRightWidth',
    'borderBottomWidth', 'borderLeftWidth', 'boxSizing', 'lineHeight',
  ];

  div.style.position = 'absolute';
  div.style.visibility = 'hidden';
  div.style.whiteSpace = 'pre';

  properties.forEach(prop => {
    (div.style as any)[prop] = (computed as any)[prop];
  });

  div.textContent = input.value.substring(0, position);

  const span = document.createElement('span');
  span.textContent = input.value.substring(position) || '.';
  div.appendChild(span);

  document.body.appendChild(div);

  const top = span.offsetTop - (input.scrollLeft || 0);
  const left = span.offsetLeft - (input.scrollLeft || 0);

  document.body.removeChild(div);

  return { top, left };
}

export default SmartInput;
