import React from 'react';
import { WorksheetQuestion } from '../../types/worksheet';
import { Skeleton } from '../ui/skeleton';

interface ComprehensionTemplateProps {
  subject?: string;
  gradeLevel?: string;
  topic?: string;
  questionCount?: number;
  questionType?: string;
  worksheetTitle?: string;
  includeImages?: boolean;
  imagePlacement?: string;
  generatedImage?: string | null;
  passage?: string;
  questions?: WorksheetQuestion[];
  showAnswers?: boolean;
  loading?: boolean;
}

const ComprehensionTemplate: React.FC<ComprehensionTemplateProps> = ({
  subject = 'Subject',
  gradeLevel = 'Grade',
  topic = 'Topic',
  questionCount = 8,
  worksheetTitle,
  includeImages = false,
  imagePlacement = 'large-centered',
  generatedImage = null,
  passage,
  questions,
  showAnswers = false,
  loading = false,
}) => {
  const displayPassage = passage || 'Read the passage carefully before answering the questions below. Pay attention to details, main ideas, and any important words or phrases.';
  const displayQuestions: WorksheetQuestion[] = questions || Array.from({ length: questionCount }, (_, i) => ({
    id: `sample_${i}`,
    question: `Question ${i + 1}: What does the passage tell us about this topic?`,
    correctAnswer: undefined,
    type: 'comprehension',
  }));

  const ACCENT = '#0d9488';

  return (
    <div style={{ background: '#fff', maxWidth: 800, margin: '0 auto', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>

      {/* Header — left thick border style */}
      <div style={{ borderLeft: `8px solid ${ACCENT}`, margin: '0', padding: '20px 32px 18px 28px', borderBottom: '2px solid #0f172a' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: ACCENT, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 6 }}>
              {subject} · {gradeLevel} · Reading Comprehension
            </div>
            {loading
              ? <Skeleton style={{ height: 28, width: 300, background: '#e2e8f0', borderRadius: 3 }} />
              : <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: '#0f172a', lineHeight: 1.1 }}>{worksheetTitle}</h1>
            }
            {!loading && <p style={{ margin: '5px 0 0', fontSize: 12, color: '#64748b' }}>{topic}</p>}
          </div>
          <div style={{ fontSize: 12, color: '#475569', lineHeight: 2.2, textAlign: 'right', flexShrink: 0 }}>
            <div>Name: <span style={{ borderBottom: '1px solid #94a3b8', display: 'inline-block', width: 130, paddingBottom: 1 }}>&nbsp;</span></div>
            <div>Date: <span style={{ borderBottom: '1px solid #94a3b8', display: 'inline-block', width: 130, paddingBottom: 1 }}>&nbsp;</span></div>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px 36px' }}>

        {/* ── Passage block ── */}
        <div style={{ marginBottom: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 24, height: 24, background: ACCENT, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>A</span>
            </div>
            <h2 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#0f172a', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Read the Passage</h2>
          </div>

          <div style={{
            border: `2px solid ${ACCENT}`,
            borderRadius: 6,
            overflow: 'hidden',
          }}>
            {/* Passage header bar */}
            <div style={{ background: ACCENT, padding: '7px 18px' }}>
              <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>Passage</span>
            </div>

            <div style={{ padding: '18px 22px', background: '#f8fffe' }}>
              {/* Image placement inside passage */}
              {includeImages && imagePlacement === 'large-centered' && (
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  {loading
                    ? <Skeleton style={{ width: 220, height: 120, display: 'inline-block', background: '#b2f5ea', borderRadius: 4 }} />
                    : generatedImage
                      ? <img src={generatedImage} alt="" style={{ maxWidth: 220, borderRadius: 4, border: `1.5px solid ${ACCENT}` }} />
                      : <div style={{ display: 'inline-flex', width: 220, height: 120, background: '#ccfbf1', border: `1.5px dashed ${ACCENT}`, borderRadius: 4, alignItems: 'center', justifyContent: 'center', color: ACCENT, fontSize: 12 }}>image placeholder</div>
                  }
                </div>
              )}

              {includeImages && imagePlacement === 'small-corner' && (
                <div style={{ float: 'right', marginLeft: 16, marginBottom: 8 }}>
                  {loading
                    ? <Skeleton style={{ width: 110, height: 75, background: '#b2f5ea', borderRadius: 4 }} />
                    : generatedImage
                      ? <img src={generatedImage} alt="" style={{ width: 110, height: 75, objectFit: 'cover', borderRadius: 4, border: `1.5px solid ${ACCENT}` }} />
                      : <div style={{ width: 110, height: 75, background: '#ccfbf1', border: `1.5px dashed ${ACCENT}`, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ACCENT, fontSize: 11 }}>image</div>
                  }
                </div>
              )}

              {loading
                ? <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[100, 97, 93, 100, 88, 95, 82].map((w, i) => (
                      <Skeleton key={i} style={{ height: 14, width: `${w}%`, background: '#b2f5ea', borderRadius: 3 }} />
                    ))}
                  </div>
                : <p style={{ margin: 0, fontSize: 14, color: '#1e293b', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>{displayPassage}</p>
              }
            </div>
          </div>
        </div>

        {/* ── Questions ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 24, height: 24, background: ACCENT, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>B</span>
            </div>
            <h2 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#0f172a', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Answer the Questions</h2>
          </div>

          {displayQuestions.map((q, idx) => (
            <div key={q.id} style={{ marginBottom: 22, pageBreakInside: 'avoid' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                {/* Number */}
                <div style={{
                  flexShrink: 0, width: 28, height: 28,
                  border: `2px solid ${ACCENT}`, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 900, color: ACCENT, marginTop: 1,
                }}>{idx + 1}</div>

                <div style={{ flex: 1 }}>
                  {loading
                    ? <Skeleton style={{ height: 14, width: '72%', background: '#e2e8f0', borderRadius: 3, marginBottom: 10, display: 'block' }} />
                    : <p style={{ margin: '2px 0 10px', fontSize: 14, color: '#1e293b', fontWeight: 600, lineHeight: 1.5 }}>{q.question}</p>
                  }
                  {showAnswers && q.correctAnswer
                    ? <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: 5, padding: '7px 12px', fontSize: 13, color: '#15803d', fontWeight: 600 }}>
                        Answer: {String(q.correctAnswer)}
                      </div>
                    : <div>
                        <div style={{ borderBottom: '1.5px solid #94a3b8', marginBottom: 22 }} />
                        <div style={{ borderBottom: '1.5px solid #94a3b8', marginBottom: 22 }} />
                        <div style={{ borderBottom: '1.5px solid #cbd5e1' }} />
                      </div>
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '2px solid #0f172a', margin: '0 36px', paddingTop: 10, paddingBottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: '#94a3b8' }}>Worksheet generated for educational purposes</span>
        <div style={{ width: 24, height: 6, background: ACCENT, borderRadius: 3 }} />
      </div>
    </div>
  );
};

export default ComprehensionTemplate;
