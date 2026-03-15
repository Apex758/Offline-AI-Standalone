import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { findMisspelledWords, getSuggestions, addCustomWord, MisspelledWord } from '../utils/spellCheck';
import { applyAutocorrect } from '../utils/autocorrect';
import { useSettings } from '../contexts/SettingsContext';

interface SmartTextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  /** Disable all smart features (for read-only / streaming content) */
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

const SmartTextArea: React.FC<SmartTextAreaProps> = ({
  value,
  onChange,
  disableSmart = false,
  className = '',
  style,
  disabled,
  ...rest
}) => {
  const { settings } = useSettings();
  const spellCheckEnabled = settings.spellCheckEnabled && !disableSmart && !disabled;
  const dictionaryEnabled = settings.dictionaryEnabled && spellCheckEnabled;
  const autocorrectEnabled = settings.autocorrectEnabled && !disableSmart && !disabled;
  const autoFinishEnabled = settings.autoFinishEnabled && !disableSmart && !disabled;

  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const [misspelled, setMisspelled] = useState<MisspelledWord[]>([]);
  const [popup, setPopup] = useState<PopupState | null>(null);
  const [ghostText, setGhostText] = useState('');
  const spellCheckTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoCompleteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoCompleteAbortRef = useRef<AbortController | null>(null);
  const lastAutocorrectRef = useRef<string>('');

  // Spell check with debounce
  useEffect(() => {
    if (!spellCheckEnabled) {
      setMisspelled([]);
      return;
    }

    if (spellCheckTimerRef.current) clearTimeout(spellCheckTimerRef.current);

    spellCheckTimerRef.current = setTimeout(() => {
      const results = findMisspelledWords(value);
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

    // Cancel any pending request
    if (autoCompleteTimerRef.current) clearTimeout(autoCompleteTimerRef.current);
    if (autoCompleteAbortRef.current) autoCompleteAbortRef.current.abort();
    setGhostText('');

    // Only trigger after meaningful text
    const trimmed = value.trim();
    if (trimmed.length < 10) return;

    // Don't trigger if text ends with a completed sentence
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
      }
    }, 1500);

    return () => {
      if (autoCompleteTimerRef.current) clearTimeout(autoCompleteTimerRef.current);
      if (autoCompleteAbortRef.current) autoCompleteAbortRef.current.abort();
    };
  }, [value, autoFinishEnabled]);

  // Sync scroll between textarea and backdrop
  const handleScroll = useCallback(() => {
    if (backdropRef.current && textareaRef.current) {
      backdropRef.current.scrollTop = textareaRef.current.scrollTop;
      backdropRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  // Handle text changes with autocorrect
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let newValue = e.target.value;
    let cursorPos = e.target.selectionStart;

    // Apply autocorrect when space is typed
    if (autocorrectEnabled && newValue.length > (value?.length || 0)) {
      const lastChar = newValue[cursorPos - 1];
      if (lastChar === ' ' || lastChar === '\n') {
        const result = applyAutocorrect(newValue, cursorPos);
        if (result) {
          newValue = result.text;
          cursorPos = result.newCursorPos;
          lastAutocorrectRef.current = newValue;
          // Set cursor position after React re-render
          requestAnimationFrame(() => {
            if (textareaRef.current) {
              textareaRef.current.selectionStart = cursorPos;
              textareaRef.current.selectionEnd = cursorPos;
            }
          });
        }
      }
    }

    setGhostText('');
    setPopup(null);
    onChange(newValue);
  }, [onChange, autocorrectEnabled, value]);

  // Handle Tab to accept ghost text
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab' && ghostText) {
      e.preventDefault();
      onChange(value + ghostText);
      setGhostText('');
      // Move cursor to end
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          const newLen = value.length + ghostText.length;
          textareaRef.current.selectionStart = newLen;
          textareaRef.current.selectionEnd = newLen;
        }
      });
      return;
    }

    // Close popup on Escape
    if (e.key === 'Escape' && popup) {
      setPopup(null);
    }

    // Call original onKeyDown/onKeyPress if provided
    if (rest.onKeyDown) {
      (rest.onKeyDown as any)(e);
    }
    if (rest.onKeyPress && !e.defaultPrevented) {
      (rest.onKeyPress as any)(e);
    }
  }, [ghostText, popup, onChange, value, rest.onKeyDown, rest.onKeyPress]);

  // Handle click on textarea to detect misspelled word clicks
  const handleTextareaClick = useCallback((e: React.MouseEvent<HTMLTextAreaElement>) => {
    if (!dictionaryEnabled || misspelled.length === 0) {
      setPopup(null);
      return;
    }

    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart;

    // Find if cursor is inside a misspelled word
    const clickedWord = misspelled.find(m => cursorPos >= m.start && cursorPos <= m.end);

    if (clickedWord) {
      // Calculate popup position
      const pos = getCaretCoordinates(textarea, clickedWord.start);
      setPopup({
        word: clickedWord.word,
        start: clickedWord.start,
        end: clickedWord.end,
        suggestions: getSuggestions(clickedWord.word),
        x: pos.left,
        y: pos.top - 8, // Above the word
      });
    } else {
      setPopup(null);
    }

    if (rest.onClick) {
      (rest.onClick as any)(e);
    }
  }, [dictionaryEnabled, misspelled, rest.onClick]);

  // Replace misspelled word with suggestion
  const replaceWord = useCallback((replacement: string) => {
    if (!popup) return;
    const newValue = value.slice(0, popup.start) + replacement + value.slice(popup.end);
    onChange(newValue);
    setPopup(null);

    // Move cursor to end of replacement
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        const newPos = popup.start + replacement.length;
        textareaRef.current.selectionStart = newPos;
        textareaRef.current.selectionEnd = newPos;
        textareaRef.current.focus();
      }
    });
  }, [popup, value, onChange]);

  // Add word to custom dictionary
  const handleAddToDictionary = useCallback(() => {
    if (!popup) return;
    addCustomWord(popup.word);
    setPopup(null);
    // Re-run spell check
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

  // Render the highlighted backdrop content
  const backdropContent = useMemo(() => {
    if (!spellCheckEnabled || misspelled.length === 0) {
      return <span style={{ color: 'transparent' }}>{value || ' '}</span>;
    }

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    misspelled.forEach((m, i) => {
      // Text before misspelled word
      if (m.start > lastIndex) {
        parts.push(
          <span key={`t-${i}`} style={{ color: 'transparent' }}>
            {value.slice(lastIndex, m.start)}
          </span>
        );
      }
      // Misspelled word with underline
      parts.push(
        <span
          key={`m-${i}`}
          style={{
            color: 'transparent',
            textDecoration: 'underline wavy',
            textDecorationColor: '#ef4444',
            textUnderlineOffset: '3px',
            textDecorationThickness: '1.5px',
            borderRadius: '2px',
            cursor: 'pointer',
          }}
        >
          {value.slice(m.start, m.end)}
        </span>
      );
      lastIndex = m.end;
    });

    // Remaining text
    if (lastIndex < value.length) {
      parts.push(
        <span key="tail" style={{ color: 'transparent' }}>
          {value.slice(lastIndex)}
        </span>
      );
    }

    return parts;
  }, [value, misspelled, spellCheckEnabled]);

  // Compute textarea styles - we need the backdrop to match exactly
  const textareaStyles: React.CSSProperties = {
    ...style,
    width: '100%',
    background: spellCheckEnabled ? 'transparent' : undefined,
    position: 'relative' as const,
    zIndex: 2,
    caretColor: 'auto',
  };

  // If no smart features are enabled, render a plain textarea
  if (!spellCheckEnabled && !autocorrectEnabled && !autoFinishEnabled) {
    return (
      <textarea
        ref={textareaRef}
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
    <div ref={containerRef} className="smart-textarea-container" style={{ position: 'relative', flex: 1, minWidth: 0 }}>
      {/* Backdrop for spell-check highlights */}
      {spellCheckEnabled && (
        <div
          ref={backdropRef}
          className={className}
          aria-hidden="true"
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
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            background: 'transparent',
            border: '1px solid transparent',
          }}
        >
          {backdropContent}
        </div>
      )}

      {/* The actual textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onScroll={handleScroll}
        onClick={handleTextareaClick}
        onKeyDown={handleKeyDown}
        className={className}
        style={textareaStyles}
        disabled={disabled}
        // Remove onKeyPress from rest to avoid double-firing
        {...{ ...rest, onKeyPress: undefined, onKeyDown: undefined, onClick: undefined }}
      />

      {/* Ghost text for auto-complete */}
      {autoFinishEnabled && ghostText && (
        <div
          className="smart-textarea-ghost"
          style={{
            position: 'absolute',
            bottom: '-22px',
            left: '4px',
            right: '4px',
            fontSize: '12px',
            color: '#9ca3af',
            pointerEvents: 'none',
            zIndex: 3,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          <span style={{ opacity: 0.6 }}>{ghostText}</span>
          <span style={{
            marginLeft: '8px',
            fontSize: '10px',
            padding: '1px 6px',
            border: '1px solid #d1d5db',
            borderRadius: '3px',
            color: '#9ca3af',
          }}>Tab</span>
        </div>
      )}

      {/* Suggestion popup */}
      {popup && (
        <div
          className="smart-textarea-popup"
          style={{
            position: 'absolute',
            left: `${Math.min(popup.x, (containerRef.current?.clientWidth || 300) - 200)}px`,
            top: `${popup.y}px`,
            zIndex: 50,
            transform: 'translateY(-100%)',
            minWidth: '160px',
            maxWidth: '250px',
          }}
          onMouseDown={(e) => e.preventDefault()} // Prevent blur
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="px-3 py-1.5 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
              <span className="text-xs font-medium text-red-500">
                &ldquo;{popup.word}&rdquo;
              </span>
            </div>

            {/* Suggestions */}
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

            {/* Actions */}
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

// Helper: get pixel coordinates of a character position in a textarea
function getCaretCoordinates(textarea: HTMLTextAreaElement, position: number): { top: number; left: number } {
  const div = document.createElement('div');
  const computed = window.getComputedStyle(textarea);

  // Copy textarea styles to the mirror div
  const properties = [
    'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing',
    'textTransform', 'wordSpacing', 'textIndent', 'paddingTop', 'paddingRight',
    'paddingBottom', 'paddingLeft', 'borderTopWidth', 'borderRightWidth',
    'borderBottomWidth', 'borderLeftWidth', 'boxSizing', 'lineHeight',
    'whiteSpace', 'wordWrap', 'overflowWrap',
  ];

  div.style.position = 'absolute';
  div.style.visibility = 'hidden';
  div.style.overflow = 'hidden';
  div.style.whiteSpace = 'pre-wrap';
  div.style.wordWrap = 'break-word';
  div.style.width = computed.width;

  properties.forEach(prop => {
    (div.style as any)[prop] = (computed as any)[prop];
  });

  // Set text content up to the caret position
  div.textContent = textarea.value.substring(0, position);

  // Add a span to mark the caret position
  const span = document.createElement('span');
  span.textContent = textarea.value.substring(position) || '.';
  div.appendChild(span);

  document.body.appendChild(div);

  const top = span.offsetTop - textarea.scrollTop;
  const left = span.offsetLeft - textarea.scrollLeft;

  document.body.removeChild(div);

  return { top, left };
}

export default SmartTextArea;
