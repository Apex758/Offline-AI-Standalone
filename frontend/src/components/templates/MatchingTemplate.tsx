import React from 'react';
import { Skeleton } from '../ui/skeleton';

interface MatchingTemplateProps {
  subject?: string;
  gradeLevel?: string;
  topic?: string;
  questionCount?: number;
  questionType?: string;
  worksheetTitle?: string;
  includeImages?: boolean;
  columnA?: string[];
  columnB?: string[];
  showAnswers?: boolean;
  loading?: boolean;
}

const MatchingTemplate: React.FC<MatchingTemplateProps> = ({
  subject = 'Subject',
  gradeLevel = 'Grade',
  topic = 'Topic',
  questionCount = 10,
  worksheetTitle,
  columnA,
  columnB,
  showAnswers = false,
  loading = false,
}) => {
  const displayColumnA = columnA || Array.from({ length: questionCount }, (_, i) => `Term or item ${i + 1}`);
  const displayColumnB = columnB || Array.from({ length: questionCount }, (_, i) => `Definition or description ${i + 1}`);

  const shuffledB = React.useMemo(() => {
    if (!columnB) return displayColumnB;
    const arr = [...displayColumnB];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [columnB]);

  const ACCENT = '#ea580c';

  return (
    <div style={{ background: '#fff', maxWidth: 800, margin: '0 auto', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>

      {/* Header — diagonal stripe pattern top */}
      <div style={{
        background: '#fff7ed',
        borderBottom: '2px solid #0f172a',
        padding: '22px 36px 18px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle stripe background */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: `repeating-linear-gradient(45deg, #ea580c 0, #ea580c 2px, transparent 2px, transparent 12px)`,
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: ACCENT, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 6 }}>
              {subject} · {gradeLevel} · Matching
            </div>
            {loading
              ? <Skeleton style={{ height: 28, width: 280, background: '#fed7aa', borderRadius: 3 }} />
              : <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: '#0f172a', lineHeight: 1.1 }}>{worksheetTitle}</h1>
            }
            {!loading && <p style={{ margin: '5px 0 0', fontSize: 12, color: '#78716c' }}>{topic}</p>}
          </div>
          <div style={{ fontSize: 12, color: '#57534e', lineHeight: 2.2, textAlign: 'right', flexShrink: 0 }}>
            <div>Name: <span style={{ borderBottom: '1px solid #a8a29e', display: 'inline-block', width: 130, paddingBottom: 1 }}>&nbsp;</span></div>
            <div>Date: <span style={{ borderBottom: '1px solid #a8a29e', display: 'inline-block', width: 130, paddingBottom: 1 }}>&nbsp;</span></div>
          </div>
        </div>
      </div>

      {/* Directions */}
      <div style={{ padding: '10px 36px', background: '#fff7ed', borderBottom: '1px solid #fed7aa', fontSize: 13, color: '#9a3412' }}>
        <strong>Directions:</strong> Draw a line to match each item in Column A with the correct answer in Column B.
      </div>

      <div style={{ padding: '24px 36px 36px' }}>

        {/* Column headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 32px 1fr', gap: 0, marginBottom: 14 }}>
          <div style={{ background: ACCENT, padding: '8px 14px', borderRadius: '4px 0 0 4px' }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Column A</span>
          </div>
          <div style={{ background: '#fff7ed', borderTop: `1.5px solid ${ACCENT}`, borderBottom: `1.5px solid ${ACCENT}` }} />
          <div style={{ background: '#c2410c', padding: '8px 14px', borderRadius: '0 4px 4px 0', textAlign: 'right' }}>
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
              border: `1.5px solid ${loading ? '#fed7aa' : '#e7e5e4'}`,
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
                ? <Skeleton style={{ height: 13, flex: 1, background: '#fed7aa', borderRadius: 3 }} />
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
              border: `1.5px solid ${loading ? '#fed7aa' : '#e7e5e4'}`,
              borderRadius: '0 6px 6px 0',
              padding: '9px 12px',
              background: '#fff7ed',
              minHeight: 42,
            }}>
              {/* Dot on left side */}
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#c2410c', flexShrink: 0 }} />
              <div style={{
                flexShrink: 0, width: 26, height: 26, borderRadius: '50%',
                background: '#c2410c', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 900,
              }}>{String.fromCharCode(65 + i)}</div>
              {loading
                ? <Skeleton style={{ height: 13, flex: 1, background: '#fed7aa', borderRadius: 3 }} />
                : <span style={{ fontSize: 13, color: '#1e293b', lineHeight: 1.4, fontWeight: 500 }}>{shuffledB[i] || ''}</span>
              }
            </div>
          </div>
        ))}

        {/* Answer Key */}
        {showAnswers && columnA && columnB && (
          <div style={{ marginTop: 28, border: '1.5px solid #fed7aa', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ background: ACCENT, padding: '7px 16px' }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Answer Key</span>
            </div>
            <div style={{ padding: '12px 16px', display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {columnA.map((_, idx) => (
                <div key={idx} style={{ padding: '4px 12px', background: '#fff7ed', border: `1.5px solid ${ACCENT}`, borderRadius: 4, fontSize: 12, fontWeight: 700, color: ACCENT }}>
                  {idx + 1} → {String.fromCharCode(65 + idx)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ borderTop: '1.5px solid #e7e5e4', margin: '0 36px', padding: '10px 0 18px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: '#94a3b8' }}>Generated for educational purposes</span>
        <div style={{ width: 20, height: 5, background: ACCENT, borderRadius: 3 }} />
      </div>
    </div>
  );
};

export default MatchingTemplate;
