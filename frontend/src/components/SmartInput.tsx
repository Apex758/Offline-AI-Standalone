import React, { useRef, useCallback, useMemo } from 'react';
import { getSuggestions } from '../utils/spellCheck';
import { useSmartText } from '../hooks/useSmartText';

interface SmartInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  /** Disable all smart features */
  disableSmart?: boolean;
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
  // Only enable for text-like inputs
  const isTextType = !type || type === 'text' || type === 'search';

  const {
    spellCheckEnabled,
    dictionaryEnabled,
    autocorrectEnabled,
    misspelled,
    popup,
    setPopup,
    containerRef,
    handleAutocorrect,
    buildBackdropParts,
    renderPopup,
  } = useSmartText({
    value,
    onChange,
    disabled: disabled || !isTextType,
    disableSmart,
    enableAutoFinish: false,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

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

    const correction = handleAutocorrect(newValue, cursorPos);
    if (correction) {
      newValue = correction.value;
      cursorPos = correction.cursorPos;
      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.selectionStart = cursorPos;
          inputRef.current.selectionEnd = cursorPos;
        }
      });
    }

    setPopup(null);
    onChange(newValue);
  }, [onChange, handleAutocorrect, setPopup]);

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
  }, [dictionaryEnabled, misspelled, rest.onClick, setPopup]);

  // Render highlighted backdrop content
  const backdropContent = useMemo(() => {
    const parts = buildBackdropParts();
    // Add whiteSpace: pre to each part for input (single-line)
    return parts.map((part, i) => {
      if (React.isValidElement(part)) {
        return React.cloneElement(part as React.ReactElement<any>, {
          style: { ...(part as React.ReactElement<any>).props.style, whiteSpace: 'pre' },
        });
      }
      return part;
    });
  }, [buildBackdropParts]);

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
    <div ref={containerRef} className="smart-input-container" style={{ position: 'relative', flex: 1, minWidth: 0 }}>
      {/* Backdrop for spell-check highlights */}
      {spellCheckEnabled && (
        <div
          ref={backdropRef}
          aria-hidden="true"
          className={className.replace(/\bvalidation-error\b/g, '').trim()}
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
      {renderPopup(containerRef.current?.clientWidth || 300)}
    </div>
  );
};

// Cached mirror div for input caret coordinate calculation
let _inputCaretMirror: HTMLDivElement | null = null;
let _inputCaretSpan: HTMLSpanElement | null = null;

const INPUT_CARET_STYLE_PROPS = [
  'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing',
  'textTransform', 'wordSpacing', 'textIndent', 'paddingTop', 'paddingRight',
  'paddingBottom', 'paddingLeft', 'borderTopWidth', 'borderRightWidth',
  'borderBottomWidth', 'borderLeftWidth', 'boxSizing', 'lineHeight',
];

function getInputCaretCoordinates(input: HTMLInputElement, position: number): { top: number; left: number } {
  if (!_inputCaretMirror) {
    _inputCaretMirror = document.createElement('div');
    _inputCaretMirror.style.position = 'absolute';
    _inputCaretMirror.style.visibility = 'hidden';
    _inputCaretMirror.style.whiteSpace = 'pre';
    _inputCaretSpan = document.createElement('span');
    document.body.appendChild(_inputCaretMirror);
  }

  const computed = window.getComputedStyle(input);
  INPUT_CARET_STYLE_PROPS.forEach(prop => {
    (_inputCaretMirror!.style as any)[prop] = (computed as any)[prop];
  });

  _inputCaretMirror.textContent = input.value.substring(0, position);
  _inputCaretSpan!.textContent = input.value.substring(position) || '.';
  _inputCaretMirror.appendChild(_inputCaretSpan!);

  const top = _inputCaretSpan!.offsetTop - (input.scrollLeft || 0);
  const left = _inputCaretSpan!.offsetLeft - (input.scrollLeft || 0);

  return { top, left };
}

export default SmartInput;
