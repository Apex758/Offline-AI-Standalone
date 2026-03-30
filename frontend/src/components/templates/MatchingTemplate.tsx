import React from 'react';
import { Skeleton } from '../ui/skeleton';
import { deriveWorksheetPalette } from '../../utils/worksheetColorUtils';

interface MatchingTemplateProps {
  subject?: string;
  gradeLevel?: string;
  topic?: string;
  questionCount?: number;
  questionType?: string;
  worksheetTitle?: string;
  includeImages?: boolean;
  generatedImage?: string | null;
  columnA?: string[];
  columnB?: string[];
  shuffledColumnB?: string[];
  showAnswers?: boolean;
  loading?: boolean;
  accentColor?: string;
  studentName?: string;
  studentId?: string;
  className?: string;
  isAnswerKey?: boolean;
  matchingAnswerMap?: Record<number, string>;
}

const MatchingTemplate: React.FC<MatchingTemplateProps> = ({
  subject = 'Subject',
  gradeLevel = 'Grade',
  topic = 'Topic',
  questionCount = 10,
  worksheetTitle,
  includeImages = false,
  generatedImage = null,
  columnA,
  columnB,
  shuffledColumnB: externalShuffledB,
  showAnswers = false,
  loading = false,
  accentColor,
  studentName,
  studentId,
  className,
  isAnswerKey = false,
  matchingAnswerMap,
}) => {
  const displayColumnA = columnA || Array.from({ length: questionCount }, (_, i) => `Term or item ${i + 1}`);
  const displayColumnB = columnB || Array.from({ length: questionCount }, (_, i) => `Definition or description ${i + 1}`);

  // Use externally shuffled column B if provided (for per-student randomization), otherwise shuffle locally
  const shuffledB = React.useMemo(() => {
    if (externalShuffledB) return externalShuffledB;
    if (!columnB) return displayColumnB;
    const arr = [...displayColumnB];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [columnB, externalShuffledB]);

  const ACCENT = accentColor || '#ea580c';
  const palette = deriveWorksheetPalette(ACCENT);
  const effectiveShowAnswers = isAnswerKey || showAnswers;

  return (
    <div style={{ background: '#fff', maxWidth: 800, margin: '0 auto', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>

      {/* Answer Key Banner */}
      {isAnswerKey && (
        <div style={{ background: '#dc2626', padding: '10px 36px', textAlign: 'center' }}>
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 15, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Answer Key — For Teacher Use Only</span>
        </div>
      )}

      {/* Header — diagonal stripe pattern top */}
      <div style={{
        background: palette.accentLighter,
        borderBottom: '2px solid #0f172a',
        padding: '22px 36px 18px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle stripe background */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: `repeating-linear-gradient(45deg, ${ACCENT} 0, ${ACCENT} 2px, transparent 2px, transparent 12px)`,
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: ACCENT, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 6 }}>
              {subject} · {gradeLevel} · Matching
            </div>
            {loading
              ? <Skeleton style={{ height: 28, width: 280, background: palette.accentBorder, borderRadius: 3 }} />
              : <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: '#0f172a', lineHeight: 1.1 }}>{worksheetTitle}</h1>
            }
            {!loading && <p style={{ margin: '5px 0 0', fontSize: 12, color: '#78716c' }}>{topic}</p>}
          </div>
          <div style={{ fontSize: 12, color: '#57534e', lineHeight: 2.2, textAlign: 'right', flexShrink: 0 }}>
            <div>Name: {studentName
              ? <span style={{ fontWeight: 700, color: '#0f172a' }}>{studentName}</span>
              : <span style={{ borderBottom: '1px solid #a8a29e', display: 'inline-block', width: 130, paddingBottom: 1 }}>&nbsp;</span>
            }</div>
            {studentId && (
              <div>ID: <span style={{ fontWeight: 700, color: '#0f172a' }}>{studentId}</span></div>
            )}
            {className && (
              <div>Class: <span style={{ fontWeight: 700, color: '#0f172a' }}>{className}</span></div>
            )}
            <div>Date: <span style={{ borderBottom: '1px solid #a8a29e', display: 'inline-block', width: studentName ? 100 : 130, paddingBottom: 1 }}>&nbsp;</span></div>
          </div>
        </div>
      </div>

      {/* Directions */}
      <div style={{ padding: '10px 36px', background: palette.accentLighter, borderBottom: `1px solid ${palette.accentBorder}`, fontSize: 13, color: palette.accentText }}>
        <strong>Directions:</strong> Draw a line to match each item in Column A with the correct answer in Column B.
      </div>

      {/* Image */}
      {includeImages && (
        <div style={{ padding: '20px 36px 0', textAlign: 'center' }}>
          {loading
            ? <Skeleton style={{ width: 220, height: 130, display: 'inline-block', background: '#e2e8f0', borderRadius: 4 }} />
            : generatedImage
              ? <img loading="lazy" src={generatedImage} alt="" style={{ maxWidth: 220, border: '1.5px solid #e2e8f0', borderRadius: 4 }} />
              : <div style={{ display: 'inline-flex', width: 220, height: 130, background: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: 4, alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 12 }}>image placeholder</div>
          }
        </div>
      )}

      <div style={{ padding: '24px 36px 36px' }}>

        {/* Column headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 32px 1fr', gap: 0, marginBottom: 14 }}>
          <div style={{ background: ACCENT, padding: '8px 14px', borderRadius: '4px 0 0 4px' }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Column A</span>
          </div>
          <div style={{ background: palette.accentLighter, borderTop: `1.5px solid ${ACCENT}`, borderBottom: `1.5px solid ${ACCENT}` }} />
          <div style={{ background: palette.accentDark, padding: '8px 14px', borderRadius: '0 4px 4px 0', textAlign: 'right' }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Column B</span>
          </div>
        </div>

        {/* Rows */}
        {Array.from({ length: Math.max(displayColumnA.length, shuffledB.length) }, (_, i) => (
          <div key={i} style={{
            display: 'grid',
            gridTemplateColumns: '1fr 32px 1fr',
            gap: 0,
            marginBottom: 10,
            pageBreakInside: 'avoid',
            alignItems: 'center',
          }}>
            {/* Column A item */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              border: `1.5px solid ${loading ? palette.accentBorder : '#e7e5e4'}`,
              borderRadius: '6px 0 0 6px',
              padding: '9px 12px',
              background: '#fafaf9',
              minHeight: 42,
            }}>
              <div style={{
                flexShrink: 0, width: 26, height: 26, borderRadius: '50%',
                background: ACCENT, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 900,
              }}>{i + 1}</div>
              {loading
                ? <Skeleton style={{ height: 13, flex: 1, background: palette.accentBorder, borderRadius: 3 }} />
                : <span style={{ fontSize: 13, color: '#1e293b', lineHeight: 1.4, fontWeight: 500 }}>{displayColumnA[i] || ''}</span>
              }
              {/* Dot on right side — for drawing lines */}
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: ACCENT, flexShrink: 0, marginLeft: 'auto' }} />
            </div>

            {/* Center gap (where lines get drawn) */}
            <div style={{ background: '#fff', borderTop: '1.5px solid #e7e5e4', borderBottom: '1.5px solid #e7e5e4', height: '100%' }} />

            {/* Column B item */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              border: `1.5px solid ${loading ? palette.accentBorder : '#e7e5e4'}`,
              borderRadius: '0 6px 6px 0',
              padding: '9px 12px',
              background: palette.accentLighter,
              minHeight: 42,
            }}>
              {/* Dot on left side */}
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: palette.accentDark, flexShrink: 0 }} />
              <div style={{
                flexShrink: 0, width: 26, height: 26, borderRadius: '50%',
                background: palette.accentDark, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 900,
              }}>{String.fromCharCode(65 + i)}</div>
              {loading
                ? <Skeleton style={{ height: 13, flex: 1, background: palette.accentBorder, borderRadius: 3 }} />
                : <span style={{ fontSize: 13, color: '#1e293b', lineHeight: 1.4, fontWeight: 500 }}>{shuffledB[i] || ''}</span>
              }
            </div>
          </div>
        ))}

        {/* Answer Key */}
        {effectiveShowAnswers && columnA && columnB && (
          <div style={{ marginTop: 28, border: `1.5px solid ${palette.accentBorder}`, borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ background: ACCENT, padding: '7px 16px' }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Answer Key</span>
            </div>
            <div style={{ padding: '12px 16px', display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {matchingAnswerMap
                ? Object.entries(matchingAnswerMap).map(([num, letter]) => (
                    <div key={num} style={{ padding: '4px 12px', background: palette.accentLighter, border: `1.5px solid ${ACCENT}`, borderRadius: 4, fontSize: 12, fontWeight: 700, color: ACCENT }}>
                      {num} → {letter}
                    </div>
                  ))
                : columnA.map((_, idx) => (
                    <div key={idx} style={{ padding: '4px 12px', background: palette.accentLighter, border: `1.5px solid ${ACCENT}`, borderRadius: 4, fontSize: 12, fontWeight: 700, color: ACCENT }}>
                      {idx + 1} → {String.fromCharCode(65 + idx)}
                    </div>
                  ))
              }
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {studentName && !isAnswerKey && (
        <div style={{ padding: '0 36px 10px', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b' }}>
          <span>Score: _____ / {displayColumnA.length}</span>
          <span>Teacher: _________________________</span>
        </div>
      )}

      <div style={{ borderTop: '1.5px solid #e7e5e4', margin: '0 36px', padding: '10px 0 18px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: '#94a3b8' }}>Generated for educational purposes</span>
        <div style={{ width: 20, height: 5, background: ACCENT, borderRadius: 3 }} />
      </div>
    </div>
  );
};

export default MatchingTemplate;
