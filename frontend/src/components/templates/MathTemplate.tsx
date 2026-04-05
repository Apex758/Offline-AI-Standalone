import React from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '../ui/skeleton';
import { deriveWorksheetPalette } from '../../utils/worksheetColorUtils';

export interface MathProblem {
  id: string;
  num1: number | string;
  num2: number | string;
  operator: '+' | '-' | 'x' | '÷' | '*' | '/';
  answer?: number | string;
}

interface MathTemplateProps {
  subject?: string;
  gradeLevel?: string;
  topic?: string;
  strand?: string;
  worksheetTitle?: string;
  instructions?: string;
  mathProblems?: MathProblem[];
  questions?: Array<{ id: string; question: string; correctAnswer?: string | number }>;
  columnCount?: number;
  showAnswers?: boolean;
  questionCount?: number;
  loading?: boolean;
  accentColor?: string;
  studentName?: string;
  studentId?: string;
  className?: string;
  isAnswerKey?: boolean;
}

const MathTemplate: React.FC<MathTemplateProps> = ({
  subject = 'Mathematics',
  gradeLevel = 'Grade',
  topic = 'Mathematics',
  strand,
  worksheetTitle,
  instructions = 'Solve the following problems. Show your work.',
  mathProblems,
  questions,
  columnCount = 4,
  showAnswers = false,
  questionCount = 10,
  loading = false,
  accentColor,
  studentName,
  studentId,
  className,
  isAnswerKey = false,
}) => {

  const isComputationalStrand = () => {
    const keywords = ['operation', 'addition', 'subtraction', 'multiplication', 'division', 'arithmetic', 'calculation', 'add', 'subtract', 'multiply', 'divide', 'times', 'plus', 'minus'];
    const tl = (topic || '').toLowerCase();
    const sl = (strand || '').toLowerCase();
    if (sl.includes('measurement') || tl.includes('meter') || tl.includes('convert')) return false;
    return keywords.some(k => tl.includes(k) || sl.includes(k));
  };

  const useVerticalLayout = isComputationalStrand();

  const parseQuestion = (q: { id: string; question: string; correctAnswer?: string | number }): MathProblem => {
    const m = q.question.match(/(\d+)\s*([+\-xX*÷/])\s*(\d+)/);
    if (m) return { id: q.id, num1: parseInt(m[1]), operator: m[2] as any, num2: parseInt(m[3]), answer: q.correctAnswer };
    return { id: q.id, num1: q.question, num2: '', operator: '+' as any, answer: q.correctAnswer };
  };

  let displayProblems: MathProblem[] = [];
  let displayQuestions: Array<{ id: string; question: string; correctAnswer?: string | number }> = [];

  if (useVerticalLayout) {
    displayProblems = mathProblems?.length
      ? mathProblems
      : questions?.length
        ? questions.map(parseQuestion)
        : Array.from({ length: questionCount }, (_, i) => {
            const n1 = Math.floor(Math.random() * 50) + 10;
            const n2 = Math.floor(Math.random() * 50) + 10;
            return { id: `s_${i}`, num1: n1, num2: n2, operator: i % 2 === 0 ? '+' : '-' as any, answer: i % 2 === 0 ? n1 + n2 : n1 - n2 };
          });
  } else {
    displayQuestions = questions?.length
      ? questions
      : Array.from({ length: questionCount }, (_, i) => ({ id: `s_${i}`, question: `Sample ${topic} question ${i + 1}?`, correctAnswer: 'Answer' }));
  }

  const displayOp = (op: string) => op === '*' ? '×' : op === '/' ? '÷' : op;

  const { t } = useTranslation();
  const ACCENT = accentColor || '#0891b2';
  const palette = deriveWorksheetPalette(ACCENT);
  const effectiveShowAnswers = isAnswerKey || showAnswers;
  const cols = Math.min(columnCount, 4);

  return (
    <div style={{ background: '#fff', maxWidth: 800, margin: '0 auto', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>

      {/* Answer Key Banner */}
      {isAnswerKey && (
        <div style={{ background: '#dc2626', padding: '10px 36px', textAlign: 'center' }}>
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 15, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{t('templates.answerKey')}</span>
        </div>
      )}

      {/* Header — graph-paper feel */}
      <div style={{
        background: '#fff',
        borderBottom: '2px solid #0f172a',
        padding: '0',
        overflow: 'hidden',
      }}>
        {/* Grid texture strip */}
        <div style={{
          height: 10,
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 9px, ${palette.accentLight} 9px, ${palette.accentLight} 10px), repeating-linear-gradient(90deg, transparent, transparent 9px, ${palette.accentLight} 9px, ${palette.accentLight} 10px)`,
          background: `${ACCENT}`,
        }} />
        <div style={{ padding: '18px 36px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: ACCENT, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 6 }}>
              {subject} · {gradeLevel} · {topic}
            </div>
            {loading
              ? <Skeleton style={{ height: 28, width: 280, background: '#e2e8f0', borderRadius: 3 }} />
              : <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: '#0f172a', lineHeight: 1.1 }}>{worksheetTitle || 'Math Practice'}</h1>
            }
          </div>
          <div style={{ fontSize: 12, color: '#475569', lineHeight: 2.2, textAlign: 'right', flexShrink: 0 }}>
            <div>{t('templates.name')} {studentName
              ? <span style={{ fontWeight: 700, color: '#0f172a' }}>{studentName}</span>
              : <span style={{ borderBottom: '1px solid #94a3b8', display: 'inline-block', width: 130, paddingBottom: 1 }}>&nbsp;</span>
            }</div>
            {studentId && (
              <div>ID: <span style={{ fontWeight: 700, color: '#0f172a' }}>{studentId}</span></div>
            )}
            <div>Date: <span style={{ borderBottom: '1px solid #94a3b8', display: 'inline-block', width: studentName ? 100 : 130, paddingBottom: 1 }}>&nbsp;</span></div>
            <div>{t('templates.score')} <span style={{ borderBottom: '1px solid #94a3b8', display: 'inline-block', width: 55, paddingBottom: 1 }}>&nbsp;</span> / {useVerticalLayout ? displayProblems.length : displayQuestions.length}</div>
          </div>
        </div>
      </div>

      {/* Directions */}
      <div style={{ padding: '9px 36px', background: palette.accentLighter, borderBottom: `1px solid ${palette.accentBorder}`, fontSize: 13, color: palette.accentText }}>
        <strong>Directions:</strong> {instructions}
      </div>

      <div style={{ padding: '24px 36px 36px' }}>

        {loading ? (
          useVerticalLayout
            ? (
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16 }}>
                {Array.from({ length: questionCount }, (_, i) => (
                  <div key={i} style={{ border: '2px solid #e2e8f0', borderRadius: 6, padding: '16px 12px', background: '#f8fafc' }}>
                    <Skeleton style={{ width: 16, height: 16, borderRadius: '50%', background: palette.accentBorder, marginBottom: 12 }} />
                    <div style={{ textAlign: 'right' }}>
                      <Skeleton style={{ height: 22, width: 64, background: palette.accentLight, borderRadius: 3, marginBottom: 6, marginLeft: 'auto' }} />
                      <div style={{ borderBottom: '2px solid #94a3b8', marginBottom: 8 }} />
                      <Skeleton style={{ height: 22, width: 64, background: palette.accentLight, borderRadius: 3, marginLeft: 'auto' }} />
                    </div>
                  </div>
                ))}
              </div>
            )
            : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {Array.from({ length: questionCount }, (_, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <Skeleton style={{ width: 28, height: 28, borderRadius: 4, background: palette.accentLight, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <Skeleton style={{ height: 14, width: '72%', background: '#e2e8f0', borderRadius: 3, marginBottom: 10 }} />
                      <div style={{ borderBottom: '1.5px solid #e2e8f0', marginBottom: 24 }} />
                    </div>
                  </div>
                ))}
              </div>
            )
        ) : useVerticalLayout ? (

          /* ── Vertical arithmetic grid ── */
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16 }}>
            {displayProblems.map((prob, i) => (
              <div key={prob.id} style={{
                border: '2px solid #e2e8f0',
                borderRadius: 6,
                padding: '14px 12px 10px',
                background: '#f8fafc',
                pageBreakInside: 'avoid',
              }}>
                {/* Number badge */}
                <div style={{ fontSize: 10, fontWeight: 700, color: ACCENT, marginBottom: 10 }}>#{i + 1}</div>

                {/* Vertical problem */}
                <div style={{ fontFamily: "'Courier New', 'Courier', monospace", fontSize: 24, fontWeight: 700, color: '#1e293b', textAlign: 'right', paddingRight: 8 }}>
                  <div style={{ marginBottom: 4 }}>{prob.num1}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6, borderBottom: '2.5px solid #334155', paddingBottom: 6, marginBottom: 6 }}>
                    <span style={{ fontSize: 20, color: '#475569', fontFamily: 'inherit' }}>{displayOp(String(prob.operator))}</span>
                    <span>{prob.num2}</span>
                  </div>
                  {/* Answer box */}
                  <div style={{
                    height: 36,
                    border: effectiveShowAnswers && prob.answer !== undefined ? `2px solid #16a34a` : '1.5px dashed #94a3b8',
                    borderRadius: 4,
                    background: effectiveShowAnswers && prob.answer !== undefined ? '#f0fdf4' : '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                    paddingRight: 8,
                    color: '#16a34a',
                    fontSize: 20,
                  }}>
                    {effectiveShowAnswers && prob.answer !== undefined ? prob.answer : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>

        ) : (

          /* ── Conceptual Q&A ── */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {displayQuestions.map((q, i) => (
              <div key={q.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', pageBreakInside: 'avoid' }}>
                <div style={{
                  flexShrink: 0, width: 28, height: 28,
                  background: ACCENT, borderRadius: 4,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 900, color: '#fff',
                }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '2px 0 10px', fontSize: 14, color: '#1e293b', fontWeight: 600, lineHeight: 1.5 }}>{q.question}</p>
                  {effectiveShowAnswers && q.correctAnswer
                    ? <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: 5, padding: '7px 12px', fontSize: 13, color: '#15803d', fontWeight: 600 }}>
                        Answer: {q.correctAnswer}
                      </div>
                    : <div>
                        <div style={{ borderBottom: '1.5px solid #94a3b8', marginBottom: 26 }} />
                        <div style={{ borderBottom: '1.5px solid #cbd5e1' }} />
                      </div>
                  }
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {studentName && !isAnswerKey && (
        <div style={{ padding: '0 36px 10px', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b' }}>
          <span>{t('templates.score')} _____ / {useVerticalLayout ? displayProblems.length : displayQuestions.length}</span>
          <span>Teacher: _________________________</span>
        </div>
      )}

      <div style={{ height: 6, background: ACCENT }} />
    </div>
  );
};

export default MathTemplate;
