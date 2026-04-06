import React from 'react';
import { useTranslation } from 'react-i18next';
import { WorksheetQuestion } from '../../types/worksheet';
import { Skeleton } from '../ui/skeleton';
import { ShimmerBar } from '../ui/ShimmerBar';
import { deriveWorksheetPalette } from '../../utils/worksheetColorUtils';

interface ListBasedTemplateProps {
  subject: string;
  gradeLevel: string;
  topic: string;
  questionCount: number;
  questionType: string;
  worksheetTitle: string;
  includeImages: boolean;
  imagePlacement?: string;
  generatedImage?: string | null;
  questions?: WorksheetQuestion[];
  wordBank?: string[];
  showAnswers?: boolean;
  loading?: boolean;
  accentColor?: string;
  studentName?: string;
  studentId?: string;
  className?: string;
  isAnswerKey?: boolean;
}

const ListBasedTemplate: React.FC<ListBasedTemplateProps> = ({
  subject,
  gradeLevel,
  topic,
  questionCount,
  questionType,
  worksheetTitle,
  includeImages,
  generatedImage,
  questions,
  wordBank,
  showAnswers = false,
  loading = false,
  accentColor,
  studentName,
  studentId,
  className,
  isAnswerKey = false,
}) => {
  const isPreviewMode = !questions || questions.length === 0;

  const { t } = useTranslation();
  const ACCENT = accentColor || '#7c3aed';
  const palette = deriveWorksheetPalette(ACCENT);
  const effectiveShowAnswers = isAnswerKey || showAnswers;

  const DIRECTIONS: Record<string, string> = {
    'Word Bank': 'Use the words in the Word Bank to fill in each blank. Cross off each word as you use it.',
    'True / False': 'Read each statement. Write TRUE or FALSE on the line provided.',
    'Fill in the Blank': 'Fill in each blank with the correct word or phrase to complete the sentence.',
    'Short Answer': 'Answer each question in 2–4 complete sentences.',
  };

  const renderQuestion = (question: WorksheetQuestion, index: number) => {
    const base = (
      <div key={question.id || `q_${index}`} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 20, pageBreakInside: 'avoid' }}>
        <div style={{
          flexShrink: 0, minWidth: 28, height: 28,
          background: ACCENT, borderRadius: 4,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 900, color: '#fff',
        }}>{index + 1}</div>

        <div style={{ flex: 1, paddingTop: 3 }}>
          <p style={{ margin: '0 0 10px', fontSize: 14, color: '#1e293b', lineHeight: 1.55, fontWeight: 600 }}>
            {question.question}
          </p>

          {(questionType === 'True / False' || question.type === 'true-false') && (
            <div style={{ display: 'flex', gap: 20, paddingLeft: 2 }}>
              {['True', 'False'].map(val => (
                <div key={val} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div style={{
                    width: 18, height: 18,
                    border: `2px solid ${val === 'True' ? '#16a34a' : '#dc2626'}`,
                    borderRadius: 3,
                  }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: val === 'True' ? '#16a34a' : '#dc2626' }}>{val}</span>
                </div>
              ))}
            </div>
          )}

          {(questionType === 'Short Answer' || question.type === 'short-answer') && (
            <div style={{ marginTop: 4 }}>
              {[1, 2, 3].map(l => (
                <div key={l} style={{ borderBottom: '1.5px solid #cbd5e1', height: 28, marginBottom: 4 }} />
              ))}
            </div>
          )}

          {(questionType === 'Fill in the Blank' || questionType === 'Word Bank') && (
            <div style={{ borderBottom: '1.5px solid #cbd5e1', height: 28 }} />
          )}

          {effectiveShowAnswers && question.correctAnswer !== undefined && question.correctAnswer !== '' && (
            <div style={{ marginTop: 8, background: palette.accentLighter, border: `1.5px solid ${palette.accentMuted}`, borderRadius: 5, padding: '6px 12px', fontSize: 12, color: ACCENT, fontWeight: 700 }}>
              Answer: {String(question.correctAnswer)}
            </div>
          )}
        </div>
      </div>
    );
    return base;
  };

  return (
    <div style={{ background: '#fff', maxWidth: 800, margin: '0 auto', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>

      {/* Answer Key Banner */}
      {isAnswerKey && (
        <div style={{ background: '#dc2626', padding: '10px 36px', textAlign: 'center' }}>
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 15, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{t('templates.answerKey')}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ background: ACCENT, padding: '22px 36px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 6 }}>
              {subject} · {gradeLevel} · {questionType}
            </div>
            {loading
              ? <ShimmerBar variant="paper" accentColor={ACCENT} style={{ height: 28, width: 280 }} />
              : <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: '#fff', lineHeight: 1.1 }}>{worksheetTitle}</h1>
            }
            {!loading && <p style={{ margin: '5px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>{topic}</p>}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', lineHeight: 2.2, textAlign: 'right', flexShrink: 0 }}>
            <div>Name: {studentName
              ? <span style={{ fontWeight: 700, color: '#fff' }}>{studentName}</span>
              : <span style={{ borderBottom: '1px solid rgba(255,255,255,0.5)', display: 'inline-block', width: 130, paddingBottom: 1 }}>&nbsp;</span>
            }</div>
            {studentId && (
              <div>ID: <span style={{ fontWeight: 700, color: '#fff' }}>{studentId}</span></div>
            )}
            {className && (
              <div>Class: <span style={{ fontWeight: 700, color: '#fff' }}>{className}</span></div>
            )}
            <div>Date: <span style={{ borderBottom: '1px solid rgba(255,255,255,0.5)', display: 'inline-block', width: studentName ? 100 : 130, paddingBottom: 1 }}>&nbsp;</span></div>
          </div>
        </div>
      </div>

      <div style={{ padding: '22px 36px 36px' }}>

        {/* Word Bank */}
        {(loading && questionType === 'Word Bank')
          ? (
            <div style={{ marginBottom: 24, border: `2px solid ${ACCENT}`, borderRadius: 6, overflow: 'hidden' }}>
              <div style={{ background: ACCENT, padding: '6px 16px' }}>
                <span style={{ color: '#fff', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('editor.wordBank')}</span>
              </div>
              <div style={{ padding: '14px 16px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {Array.from({ length: 6 }, (_, i) => <ShimmerBar key={i} variant="paper" accentColor={ACCENT} style={{ height: 28, width: 72 }} />)}
              </div>
            </div>
          )
          : wordBank && wordBank.length > 0
            ? (
              <div style={{ marginBottom: 24, border: `2px solid ${ACCENT}`, borderRadius: 6, overflow: 'hidden' }}>
                <div style={{ background: ACCENT, padding: '6px 16px' }}>
                  <span style={{ color: '#fff', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('editor.wordBank')}</span>
                </div>
                <div style={{ padding: '14px 16px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {wordBank.map((word, i) => (
                    <span key={i} style={{ padding: '5px 12px', background: palette.accentLighter, border: `1.5px solid ${palette.accentMuted}`, borderRadius: 4, fontSize: 13, fontWeight: 700, color: ACCENT }}>
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )
            : null
        }

        {/* Directions */}
        <div style={{ background: '#fafafa', border: '1.5px solid #e2e8f0', borderLeft: `4px solid ${ACCENT}`, borderRadius: 4, padding: '10px 16px', marginBottom: 24, fontSize: 13, color: '#334155' }}>
          <strong>{t('templates.directions')}</strong> {DIRECTIONS[questionType] || 'Answer each question below.'}
        </div>

        {/* Shared image */}
        {includeImages && (
          <div style={{ marginBottom: 24, textAlign: 'center' }}>
            {loading
              ? <Skeleton style={{ width: 280, height: 160, display: 'inline-block', background: palette.accentLight, borderRadius: 4 }} />
              : generatedImage
                ? <img loading="lazy" src={generatedImage} alt="" style={{ maxWidth: 280, border: `1.5px solid ${palette.accentMuted}`, borderRadius: 4 }} />
                : <div style={{ display: 'inline-flex', width: 280, height: 160, background: palette.accentLighter, border: `1.5px dashed ${palette.accentMuted}`, borderRadius: 4, alignItems: 'center', justifyContent: 'center', color: palette.accentMuted, fontSize: 12 }}>image placeholder</div>
            }
          </div>
        )}

        {/* Ruled divider line before questions */}
        <div style={{ borderTop: '2px solid #0f172a', marginBottom: 20 }} />

        {/* Questions */}
        {loading
          ? Array.from({ length: questionCount }, (_, i) => (
              <div key={`sk_${i}`} style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
                <Skeleton style={{ width: 28, height: 28, background: palette.accentLight, borderRadius: 4, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <ShimmerBar variant="paper" accentColor={ACCENT} style={{ height: 14, width: '75%', marginBottom: 10 }} />
                  <div style={{ borderBottom: '1.5px solid #e2e8f0', height: 24 }} />
                </div>
              </div>
            ))
          : isPreviewMode
            ? Array.from({ length: questionCount }, (_, i) => renderQuestion({
                id: `preview_${i}`,
                question: questionType === 'True / False'
                  ? `Sample statement about ${topic} that is either true or false.`
                  : questionType === 'Short Answer'
                  ? `Sample question about ${topic}?`
                  : `Sample sentence with _____________ to complete about ${topic}.`,
                type: questionType.toLowerCase().replace(/ /g, '-') as any,
              }, i))
            : questions!.map((q, i) => renderQuestion(q, i))
        }
      </div>

      {/* Footer */}
      {studentName && !isAnswerKey && (
        <div style={{ padding: '0 36px 10px', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b' }}>
          <span>Score: _____ / {questionCount}</span>
          <span>Teacher: _________________________</span>
        </div>
      )}

      <div style={{ borderTop: '1.5px solid #e2e8f0', margin: '0 36px', padding: '10px 0 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: '#94a3b8' }}>{t('templates.generatedForEducation')}</span>
        <div style={{ width: 20, height: 5, background: ACCENT, borderRadius: 3 }} />
      </div>
    </div>
  );
};

export default ListBasedTemplate;
