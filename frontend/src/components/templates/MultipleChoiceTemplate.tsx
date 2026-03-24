import React from 'react';
import { Skeleton } from '../ui/skeleton';

interface MultipleChoiceTemplateProps {
  subject?: string;
  gradeLevel?: string;
  topic?: string;
  questionCount?: number;
  questionType?: string;
  worksheetTitle?: string;
  includeImages?: boolean;
  generatedImage?: string | null;
  questions?: Array<{
    question: string;
    options?: string[];
    correctAnswer?: number;
    id: string;
  }>;
  showAnswers?: boolean;
  loading?: boolean;
}

const MultipleChoiceTemplate: React.FC<MultipleChoiceTemplateProps> = ({
  subject = 'Subject',
  gradeLevel = 'Grade',
  topic = 'Topic',
  questionCount = 10,
  worksheetTitle,
  includeImages = false,
  generatedImage = null,
  questions,
  showAnswers = false,
  loading = false,
}) => {
  const displayQuestions = questions || Array.from({ length: questionCount }, (_, i) => ({
    id: `sample_${i}`,
    question: `Sample question ${i + 1}: Which of the following is correct?`,
    options: ['First option here', 'Second option here', 'Third option here', 'Fourth option here'],
  }));

  const ACCENT = '#2563eb';

  return (
    <div style={{ background: '#fff', maxWidth: 800, margin: '0 auto', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>

      {/* Thick top bar */}
      <div style={{ height: 7, background: ACCENT }} />

      {/* Header */}
      <div style={{ padding: '22px 36px 18px', borderBottom: '2px solid #0f172a', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: ACCENT, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 6 }}>
            {subject} · {gradeLevel} · {topic}
          </div>
          {loading
            ? <Skeleton style={{ height: 28, width: 300, background: '#e2e8f0', borderRadius: 3 }} />
            : <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: '#0f172a', lineHeight: 1.1, letterSpacing: '-0.01em' }}>{worksheetTitle}</h1>
          }
        </div>
        <div style={{ fontSize: 12, color: '#475569', lineHeight: 2.2, textAlign: 'right', flexShrink: 0 }}>
          <div>Name: <span style={{ borderBottom: '1px solid #94a3b8', paddingBottom: 1, display: 'inline-block', width: 130 }}>&nbsp;</span></div>
          <div>Date: <span style={{ borderBottom: '1px solid #94a3b8', paddingBottom: 1, display: 'inline-block', width: 130 }}>&nbsp;</span></div>
          <div>Score: <span style={{ borderBottom: '1px solid #94a3b8', paddingBottom: 1, display: 'inline-block', width: 55 }}>&nbsp;</span> / {questionCount}</div>
        </div>
      </div>

      {/* Directions */}
      <div style={{ background: '#eff6ff', padding: '9px 36px', borderBottom: '1px solid #bfdbfe', fontSize: 13, color: '#1e40af' }}>
        <strong>Directions:</strong> Read each question. Circle the letter of the best answer.
      </div>

      {/* Image */}
      {includeImages && (
        <div style={{ padding: '20px 36px 0', textAlign: 'center' }}>
          {loading
            ? <Skeleton style={{ width: 220, height: 130, display: 'inline-block', background: '#e2e8f0', borderRadius: 4 }} />
            : generatedImage
              ? <img src={generatedImage} alt="" style={{ maxWidth: 220, border: '1.5px solid #e2e8f0', borderRadius: 4 }} />
              : <div style={{ display: 'inline-flex', width: 220, height: 130, background: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: 4, alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 12 }}>image placeholder</div>
          }
        </div>
      )}

      {/* Questions */}
      <div style={{ padding: '22px 36px 36px' }}>
        {displayQuestions.map((q, i) => (
          <div key={q.id} style={{ display: 'flex', gap: 14, marginBottom: 24, pageBreakInside: 'avoid' }}>

            {/* Number bubble */}
            <div style={{
              flexShrink: 0, width: 34, height: 34, borderRadius: '50%',
              background: ACCENT, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: 13, marginTop: 2,
            }}>{i + 1}</div>

            <div style={{ flex: 1 }}>
              {loading
                ? <Skeleton style={{ height: 15, width: '78%', background: '#e2e8f0', borderRadius: 3, marginBottom: 12, display: 'block' }} />
                : <p style={{ margin: '4px 0 14px', fontSize: 14, color: '#1e293b', lineHeight: 1.55, fontWeight: 600 }}>{q.question}</p>
              }

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px 18px' }}>
                {(q.options || ['', '', '', '']).map((opt, oi) => {
                  const isCorrect = typeof q.correctAnswer === 'number' && q.correctAnswer === oi;
                  const LETTERS = ['A', 'B', 'C', 'D'];
                  return (
                    <div key={oi} style={{
                      display: 'flex', alignItems: 'center', gap: 9,
                      padding: '7px 11px',
                      border: `1.5px solid ${isCorrect && showAnswers ? '#16a34a' : '#e2e8f0'}`,
                      borderRadius: 7,
                      background: isCorrect && showAnswers ? '#f0fdf4' : '#fafafa',
                    }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                        border: `2px solid ${isCorrect && showAnswers ? '#16a34a' : '#475569'}`,
                        background: isCorrect && showAnswers ? '#16a34a' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, fontWeight: 900,
                        color: isCorrect && showAnswers ? '#fff' : '#475569',
                      }}>{LETTERS[oi]}</div>
                      {loading
                        ? <Skeleton style={{ height: 12, flex: 1, background: '#e2e8f0', borderRadius: 3 }} />
                        : <span style={{ fontSize: 13, color: '#334155' }}>{opt}</span>
                      }
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ height: 6, background: ACCENT }} />
    </div>
  );
};

export default MultipleChoiceTemplate;
