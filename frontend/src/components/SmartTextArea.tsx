import React, { useRef, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getSuggestions } from '../utils/spellCheck';
import { useSmartText } from '../hooks/useSmartText';

interface SmartTextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  /** Disable all smart features (for read-only / streaming content) */
  disableSmart?: boolean;
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
  const { t } = useTranslation();
  const {
    spellCheckEnabled,
    dictionaryEnabled,
    autocorrectEnabled,
    autoFinishEnabled,
    misspelled,
    popup,
    setPopup,
    ghostText,
    containerRef,
    handleAutocorrect,
    buildBackdropParts,
    renderPopup,
  } = useSmartText({ value, onChange, disabled, disableSmart, enableAutoFinish: true });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

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

    const correction = handleAutocorrect(newValue, cursorPos);
    if (correction) {
      newValue = correction.value;
      cursorPos = correction.cursorPos;
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = cursorPos;
          textareaRef.current.selectionEnd = cursorPos;
        }
      });
    }

    setPopup(null);
    onChange(newValue);
  }, [onChange, handleAutocorrect, setPopup]);

  // Handle Tab to accept ghost text
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (rest.onKeyDown) {
      (rest.onKeyDown as any)(e);
    }
    if (rest.onKeyPress && !e.defaultPrevented) {
      (rest.onKeyPress as any)(e);
    }

    if (e.defaultPrevented) return;

    if (e.key === 'Tab' && ghostText) {
      e.preventDefault();
      onChange(value + ghostText);
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          const newLen = value.length + ghostText.length;
          textareaRef.current.selectionStart = newLen;
          textareaRef.current.selectionEnd = newLen;
        }
      });
      return;
    }

    if (e.key === 'Escape' && popup) {
      setPopup(null);
    }
  }, [ghostText, popup, onChange, value, rest.onKeyDown, rest.onKeyPress, setPopup]);

  // Handle click on textarea to detect misspelled word clicks
  const handleTextareaClick = useCallback((e: React.MouseEvent<HTMLTextAreaElement>) => {
    if (!dictionaryEnabled || misspelled.length === 0) {
      setPopup(null);
      return;
    }

    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart;
    const clickedWord = misspelled.find(m => cursorPos >= m.start && cursorPos <= m.end);

    if (clickedWord) {
      const pos = getCaretCoordinates(textarea, clickedWord.start);
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

    if (rest.onClick) {
      (rest.onClick as any)(e);
    }
  }, [dictionaryEnabled, misspelled, rest.onClick, setPopup]);

  // Render backdrop content
  const backdropContent = useMemo(() => buildBackdropParts(), [buildBackdropParts]);

  // Compute textarea styles
  const needsBackdrop = spellCheckEnabled || !!ghostText;
  const textareaStyles: React.CSSProperties = {
    ...style,
    width: '100%',
    background: needsBackdrop ? 'transparent' : undefined,
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
      {/* Backdrop for spell-check highlights and inline ghost text */}
      {needsBackdrop && (
        <div
          ref={backdropRef}
          className={className.replace(/\bvalidation-error\b/g, '').trim()}
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
        {...{ ...rest, onKeyPress: undefined, onKeyDown: undefined, onClick: undefined }}
        onChange={handleChange}
        onScroll={handleScroll}
        onClick={handleTextareaClick}
        onKeyDown={handleKeyDown}
        className={className}
        style={textareaStyles}
        disabled={disabled}
      />

      {/* Tab hint for ghost text */}
      {autoFinishEnabled && ghostText && (
        <div
          className="smart-textarea-ghost-hint"
          style={{
            position: 'absolute',
            bottom: '4px',
            right: '8px',
            pointerEvents: 'none',
            zIndex: 3,
          }}
        >
          <span style={{
            fontSize: '10px',
            padding: '1px 6px',
            border: '1px solid #d1d5db',
            borderRadius: '3px',
            color: '#9ca3af',
            background: 'rgba(255,255,255,0.8)',
          }}>{t('stickyNotes.tabToAccept')}</span>
        </div>
      )}

      {/* Suggestion popup */}
      {renderPopup(containerRef.current?.clientWidth || 300)}
    </div>
  );
};

// Cached mirror div for caret coordinate calculation — avoids DOM thrashing
let _caretMirror: HTMLDivElement | null = null;
let _caretSpan: HTMLSpanElement | null = null;

const CARET_STYLE_PROPS = [
  'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing',
  'textTransform', 'wordSpacing', 'textIndent', 'paddingTop', 'paddingRight',
  'paddingBottom', 'paddingLeft', 'borderTopWidth', 'borderRightWidth',
  'borderBottomWidth', 'borderLeftWidth', 'boxSizing', 'lineHeight',
  'whiteSpace', 'wordWrap', 'overflowWrap',
];

function getCaretCoordinates(textarea: HTMLTextAreaElement, position: number): { top: number; left: number } {
  if (!_caretMirror) {
    _caretMirror = document.createElement('div');
    _caretMirror.style.position = 'absolute';
    _caretMirror.style.visibility = 'hidden';
    _caretMirror.style.overflow = 'hidden';
    _caretMirror.style.whiteSpace = 'pre-wrap';
    _caretMirror.style.wordWrap = 'break-word';
    _caretSpan = document.createElement('span');
    document.body.appendChild(_caretMirror);
  }

  const computed = window.getComputedStyle(textarea);
  _caretMirror.style.width = computed.width;
  CARET_STYLE_PROPS.forEach(prop => {
    (_caretMirror!.style as any)[prop] = (computed as any)[prop];
  });

  _caretMirror.textContent = textarea.value.substring(0, position);
  _caretSpan!.textContent = textarea.value.substring(position) || '.';
  _caretMirror.appendChild(_caretSpan!);

  const top = _caretSpan!.offsetTop - textarea.scrollTop;
  const left = _caretSpan!.offsetLeft - textarea.scrollLeft;

  return { top, left };
}

export default SmartTextArea;
