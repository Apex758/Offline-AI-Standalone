/**
 * StorybookV2LiveView
 *
 * Live reader used during Pass 2 (writing_pages) and afterwards. The main
 * canvas renders ports of the old v1 streaming page previews so text
 * streams in live with the same caret + shimmer + accent-border pulse the
 * teacher saw before the v2 refactor.
 *
 * Layout:
 *   ┌ title · "Writing Page N of M" · progress bar ┐
 *   ├ sidebar (thumbs) │  main canvas (page card) ─┤
 */
import React, { useEffect, useMemo, useState } from 'react';
import type {
  StorybookBible,
  IntroductionPageV2,
  StoryPageV2,
  ComprehensionQuestionV2,
  TextSegmentV2,
} from '../../types/storybook';
import type { PageImageEntry } from '../../hooks/useStorybookV2';
import { useSmoothReveal } from '../shared/InlineEditPrimitives';

interface Props {
  bible: StorybookBible | Partial<StorybookBible> | null;
  introductionPage: IntroductionPageV2 | null;
  pages: StoryPageV2[];
  comprehensionQuestions: ComprehensionQuestionV2[];
  pageImages: Record<number, PageImageEntry>;
  status: string;
  isDark?: boolean;
  pageCountGoal: number;
  accentColor?: string;
  /** JSON path of the string currently being typed (from partial JSON parser). */
  liveTypingPath?: (string | number)[] | null;
  /** Partial value at that path. */
  liveTypingValue?: string | null;
}

type CardKind = 'cover' | 'intro' | 'page' | 'comp';

interface Card {
  kind: CardKind;
  key: string;
  label: string;
  short: string;
  pageNumber?: number;
  textSegments: TextSegmentV2[];
  image?: PageImageEntry;
  isPending: boolean;
}

function characterNameLookup(bible: StorybookBible | Partial<StorybookBible> | null) {
  const out: Record<string, string> = {};
  for (const c of (bible?.characters || [])) {
    if (c?.id) out[c.id] = c.name || c.id;
  }
  return out;
}

/** Figure out which card the model is typing into right now and which
 *  segment field (`text`) of that card is the live one. Returns null if the
 *  parser isn't currently inside a text field. */
function inferLiveTarget(
  path: (string | number)[] | null | undefined,
  value: string | null | undefined,
): { target: 'intro' | number; segmentIndex: number; speaker?: string } | null {
  if (!path || value == null) return null;
  // Shapes:
  //   ["introduction_page", "text_segments", N, "text"]
  //   ["introduction_page", "text_segments", N, "speaker"]
  //   ["pages", P, "text_segments", N, "text"]
  if (path[0] === 'introduction_page' && path[1] === 'text_segments' && typeof path[2] === 'number' && path[3] === 'text') {
    return { target: 'intro', segmentIndex: path[2] as number };
  }
  if (path[0] === 'pages' && typeof path[1] === 'number' && path[2] === 'text_segments' && typeof path[3] === 'number' && path[4] === 'text') {
    return { target: path[1] as number, segmentIndex: path[3] as number };
  }
  return null;
}

// ─── Page preview components (ported from v1) ─────────────────────────────

const TypingDots: React.FC = () => (
  <div style={{ display: 'flex', gap: 6, alignItems: 'center', paddingTop: 4 }}>
    {[0, 0.2, 0.4].map((d, i) => (
      <span key={i} style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--sbv2-dot, #9ca3af)', animation: `sbv2-pulse 1.1s ease-in-out infinite`, animationDelay: `${d}s` }} />
    ))}
  </div>
);

const WritingBadge: React.FC<{ accent: string }> = ({ accent }) => (
  <div
    style={{
      position: 'absolute', bottom: 10, right: 10,
      background: 'rgba(0,0,0,0.55)', color: 'white',
      fontSize: 11, padding: '3px 10px', borderRadius: 999,
      display: 'flex', alignItems: 'center', gap: 6,
    }}
  >
    <span style={{ width: 6, height: 6, borderRadius: 3, background: '#4ade80', animation: 'sbv2-pulse 1.2s ease-in-out infinite' }} />
    Writing
  </div>
);

interface SegmentProps { seg: TextSegmentV2; nameFor: (id: string) => string; isDark: boolean; }
const CommittedSegment: React.FC<SegmentProps> = ({ seg, nameFor, isDark }) => {
  const isNarrator = !seg.speaker || seg.speaker === 'narrator';
  const common = {
    margin: 0,
    fontFamily: "Georgia, 'Times New Roman', serif",
    color: isDark ? '#e5e7eb' : '#1f2937',
    lineHeight: 1.6,
  } as React.CSSProperties;
  if (isNarrator) {
    return <p style={{ ...common, fontStyle: 'italic', fontSize: 16 }}>{seg.text}</p>;
  }
  return (
    <p style={{ ...common, fontSize: 16 }}>
      <span style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#a855f7', fontFamily: 'inherit' }}>{nameFor(seg.speaker)}:</span>
      <span style={{ fontWeight: 600 }}>“{seg.text}”</span>
    </p>
  );
};

/** Currently-being-typed segment with shimmer background + caret. */
const LiveSegment: React.FC<{
  text: string;
  speaker?: string;
  accent: string;
  nameFor: (id: string) => string;
  isDark: boolean;
}> = ({ text, speaker, accent, nameFor, isDark }) => {
  const revealed = useSmoothReveal(text, true);
  const isNarrator = !speaker || speaker === 'narrator';
  const baseTextColor = isDark ? '#e5e7eb' : '#1f2937';
  return (
    <p style={{
      margin: 0,
      fontFamily: "Georgia, 'Times New Roman', serif",
      color: baseTextColor,
      lineHeight: 1.6,
      fontSize: 16,
      fontStyle: isNarrator ? 'italic' : 'normal',
      fontWeight: isNarrator ? 400 : 600,
    }}>
      {!isNarrator && (
        <span style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#a855f7', fontFamily: 'inherit', fontStyle: 'normal' }}>
          {nameFor(speaker!)}:
        </span>
      )}
      <span
        className="sbv2-active-segment"
        style={{
          display: 'inline-block', padding: '0 0.35rem', borderRadius: 4,
          background: `linear-gradient(90deg, ${accent}11 0%, ${accent}33 50%, ${accent}11 100%)`,
          backgroundSize: '200% 100%',
          animation: 'sbv2-shimmer 1.4s linear infinite',
          boxShadow: `0 0 0 1px ${accent}55`,
        }}
      >
        {!isNarrator && '“'}
        {revealed}
        <span
          aria-hidden
          style={{
            display: 'inline-block', width: 2, height: '0.9em', marginLeft: 2,
            background: accent, verticalAlign: 'middle',
            animation: 'sbv2-caret 1s steps(2,start) infinite',
          }}
        />
      </span>
    </p>
  );
};

interface PageCardProps {
  label: string;
  segments: TextSegmentV2[];
  image?: PageImageEntry;
  showImage: boolean;
  showImageSpinner: boolean;
  isWriting: boolean;
  liveSegmentText?: string | null;
  liveSegmentSpeaker?: string;
  accent: string;
  isDark: boolean;
  nameFor: (id: string) => string;
}

const PageCard: React.FC<PageCardProps> = ({
  label, segments, image, showImage, showImageSpinner, isWriting,
  liveSegmentText, liveSegmentSpeaker, accent, isDark, nameFor,
}) => {
  const cardBg = isDark ? 'rgba(28,22,44,0.92)' : '#ffffff';
  const borderCol = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)';
  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 14,
        background: cardBg,
        border: `1px solid ${isWriting ? accent : borderCol}`,
        padding: 24,
        boxShadow: isWriting
          ? `0 0 0 2px ${accent}33, 0 0 24px ${accent}22`
          : '0 4px 14px rgba(0,0,0,0.1)',
        animation: isWriting ? 'sbv2-border-pulse 1.8s ease-in-out infinite' : undefined,
        ['--sbv2-accent' as any]: accent,
      }}
    >
      <div
        style={{
          position: 'absolute', top: -10, left: 16,
          background: accent, color: 'white',
          fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase',
          padding: '3px 10px', borderRadius: 5,
        }}
      >
        {label}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {showImage && (
          <div style={{
            width: '100%',
            aspectRatio: '16/9',
            borderRadius: 10,
            overflow: 'hidden',
            background: 'linear-gradient(135deg, rgba(168,85,247,0.10), rgba(168,85,247,0.03))',
            border: `1px solid ${borderCol}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: isDark ? 'rgba(200,191,216,0.5)' : 'rgba(80,80,80,0.5)',
            fontSize: 13,
          }}>
            {image?.imageDataBase64
              ? <img src={`data:image/png;base64,${image.imageDataBase64}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : image?.placeholder
                ? 'Image failed'
                : showImageSpinner
                  ? <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span className="sbv2-spinner" />Rendering image…</span>
                  : null}
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {segments.map((seg, i) => (
            <CommittedSegment key={i} seg={seg} nameFor={nameFor} isDark={isDark} />
          ))}
          {isWriting && liveSegmentText != null && (
            <LiveSegment
              text={liveSegmentText}
              speaker={liveSegmentSpeaker}
              accent={accent}
              nameFor={nameFor}
              isDark={isDark}
            />
          )}
          {isWriting && segments.length === 0 && liveSegmentText == null && <TypingDots />}
        </div>
      </div>

      {isWriting && <WritingBadge accent={accent} />}
    </div>
  );
};

// ─── Main component ──────────────────────────────────────────────────────

export const StorybookV2LiveView: React.FC<Props> = ({
  bible, introductionPage, pages, comprehensionQuestions, pageImages, status, isDark,
  pageCountGoal, accentColor = '#a855f7', liveTypingPath, liveTypingValue,
}) => {
  const nameMap = useMemo(() => characterNameLookup(bible), [bible]);
  const nameFor = (id: string) => nameMap[id] || id;

  const cards: Card[] = useMemo(() => {
    const list: Card[] = [];

    // Cover
    list.push({
      kind: 'cover', key: 'cover', label: 'Cover Page', short: 'Cover',
      textSegments: bible?.title ? [{ speaker: 'narrator', text: bible.title }] : [],
      isPending: !bible?.title,
    });

    // Intro (separate from story pages)
    list.push({
      kind: 'intro', key: 'intro', label: 'Introduction', short: 'Intro',
      textSegments: (introductionPage?.text_segments || []).filter(s => s?.text),
      isPending: !(introductionPage?.text_segments?.some(s => s?.text)),
    });

    // Story pages 1..N
    const haveRealPages = pages && pages.length > 0;
    if (haveRealPages) {
      for (const p of pages) {
        list.push({
          kind: 'page', key: `p${p.page}`,
          label: `Page ${p.page}`, short: `P${p.page}`,
          pageNumber: p.page,
          textSegments: (p.text_segments || []).filter(s => s?.text),
          image: pageImages[p.page],
          isPending: !p.text_segments?.some(s => s?.text),
        });
      }
    } else if (bible?.outline && bible.outline.length > 0) {
      for (const beat of bible.outline) {
        const page = beat.page ?? list.length - 1;
        list.push({
          kind: 'page', key: `slot-${page}`,
          label: `Page ${page}`, short: `P${page}`,
          pageNumber: page,
          textSegments: [],
          image: pageImages[page],
          isPending: true,
        });
      }
    } else {
      for (let i = 1; i <= pageCountGoal; i++) {
        list.push({
          kind: 'page', key: `slot-${i}`,
          label: `Page ${i}`, short: `P${i}`,
          pageNumber: i,
          textSegments: [],
          image: pageImages[i],
          isPending: true,
        });
      }
    }

    if (comprehensionQuestions && comprehensionQuestions.length > 0) {
      list.push({
        kind: 'comp', key: 'comp', label: 'Teacher notes', short: 'Notes',
        textSegments: [],
        isPending: false,
      });
    }

    return list;
  }, [bible, introductionPage, pages, comprehensionQuestions, pageImages, pageCountGoal]);

  // Which card is "currently being written" — derived from the live JSON
  // path when the parser is inside a text field, else first non-committed
  // non-cover, non-comp card.
  const liveTarget = inferLiveTarget(liveTypingPath, liveTypingValue);
  const writingIdx = useMemo(() => {
    if (liveTarget) {
      if (liveTarget.target === 'intro') {
        return cards.findIndex(c => c.kind === 'intro');
      }
      const pageIdx = liveTarget.target;
      const actualPage = pages?.[pageIdx]?.page ?? (pageIdx + 1);
      return cards.findIndex(c => c.kind === 'page' && c.pageNumber === actualPage);
    }
    for (let i = 0; i < cards.length; i++) {
      if (cards[i].kind !== 'cover' && cards[i].kind !== 'comp' && cards[i].isPending) return i;
    }
    return -1;
  }, [cards, liveTarget, pages]);

  // Speaker of the live segment, if any — find the segment speaker the parser
  // has already emitted. If the segment's `speaker` was committed before the
  // `text` field, pagesParsed will contain it.
  const liveSpeaker: string | undefined = useMemo(() => {
    if (!liveTarget) return undefined;
    if (liveTarget.target === 'intro') {
      const seg = introductionPage?.text_segments?.[liveTarget.segmentIndex];
      return seg?.speaker || 'narrator';
    }
    const page = pages?.[liveTarget.target];
    const seg = page?.text_segments?.[liveTarget.segmentIndex];
    return seg?.speaker || 'narrator';
  }, [liveTarget, introductionPage, pages]);

  // Sidebar / main selection — auto-follow writing card unless overridden.
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [userOverrodeSelection, setUserOverrodeSelection] = useState(false);
  useEffect(() => {
    if (userOverrodeSelection) return;
    if (writingIdx >= 0) setSelectedKey(cards[writingIdx].key);
    else if (selectedKey === null && cards.length > 0) setSelectedKey(cards[0].key);
  }, [writingIdx, cards, selectedKey, userOverrodeSelection]);
  useEffect(() => {
    setUserOverrodeSelection(false);
    setSelectedKey(null);
  }, [bible?.title]);

  const selected = cards.find(c => c.key === selectedKey) ?? cards[0];
  const selectedIdx = cards.findIndex(c => c.key === selected?.key);
  const selectedIsWriting = selectedIdx === writingIdx;

  const committedCount = cards.filter(c => c.kind === 'page' && !c.isPending).length;
  const pct = Math.min(100, Math.round((committedCount / Math.max(1, pageCountGoal)) * 100));

  const theme = isDark
    ? {
        bg: '#0f0b1a',
        sidebarBg: 'rgba(18,12,30,0.85)',
        thumbBg: 'rgba(255,255,255,0.04)',
        thumbBorder: 'rgba(255,255,255,0.08)',
        thumbActive: 'rgba(168,85,247,0.18)',
        textHeading: '#ece8f5',
        textBody: '#c8bfd8',
        muted: 'rgba(200,191,216,0.55)',
        barTrack: 'rgba(255,255,255,0.1)',
        cardBorder: 'rgba(255,255,255,0.08)',
      }
    : {
        bg: 'var(--theme-bg-color, #fafafa)',
        sidebarBg: 'rgba(0,0,0,0.03)',
        thumbBg: 'rgba(255,255,255,0.9)',
        thumbBorder: 'rgba(0,0,0,0.1)',
        thumbActive: 'rgba(168,85,247,0.12)',
        textHeading: '#222',
        textBody: '#444',
        muted: 'rgba(80,80,80,0.6)',
        barTrack: 'rgba(0,0,0,0.08)',
        cardBorder: 'rgba(0,0,0,0.1)',
      };

  const statusLabel =
    status === 'writing_pages' ? (writingIdx >= 0 ? `Writing ${cards[writingIdx].label}…` : 'Writing pages…') :
    status === 'rendering_images' ? 'Rendering page images…' :
    status === 'packaging' ? 'Packaging…' :
    status === 'done' ? 'Done' :
    'Generating…';

  // Image slot is only relevant during rendering_images / done phases.
  const imagesPhaseActive = status === 'rendering_images' || status === 'packaging' || status === 'done';
  // Spinner only for the first page without an image once rendering starts.
  const nextUnrenderedPageNumber = (() => {
    if (!imagesPhaseActive) return null;
    for (const c of cards) {
      if (c.kind !== 'page' || c.pageNumber == null) continue;
      if (!c.image?.imageDataBase64) return c.pageNumber;
    }
    return null;
  })();

  const thumbTextPreview = (c: Card): string => {
    if (c.kind === 'cover') return bible?.title ?? '';
    if (c.kind === 'comp') return `${comprehensionQuestions.length} questions`;
    const first = c.textSegments[0];
    if (!first) return '';
    const raw = first.text || '';
    return raw.length > 80 ? raw.slice(0, 80).trim() + '…' : raw;
  };

  return (
    <div
      className="sbv2-live"
      style={{
        ['--sbv2-accent' as any]: accentColor,
        height: '100%', width: '100%',
        display: 'flex', flexDirection: 'column',
        background: theme.bg,
        color: theme.textBody,
        overflow: 'hidden',
        fontFamily: 'inherit',
      }}
    >
      {/* Header */}
      <div style={{
        flexShrink: 0, padding: '10px 16px',
        borderBottom: `1px solid ${theme.cardBorder}`,
        display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontWeight: 700, color: theme.textHeading, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {bible?.title || 'Generating…'}
            </div>
            <div style={{ fontSize: 11, color: theme.muted, marginTop: 2 }}>
              <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#22c55e', marginRight: 6, verticalAlign: 'middle', animation: 'sbv2-pulse 1.1s ease-in-out infinite' }} />
              {statusLabel} · {committedCount} / {pageCountGoal} pages
            </div>
          </div>
        </div>
        <div style={{ width: '100%', height: 4, background: theme.barTrack, borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: accentColor, borderRadius: 4, transition: 'width 400ms' }} />
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Sidebar */}
        <div style={{
          width: 200, flexShrink: 0,
          background: theme.sidebarBg,
          borderRight: `1px solid ${theme.cardBorder}`,
          overflowY: 'auto',
          padding: '12px 10px 20px',
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          {cards.map((c, i) => {
            const isActive = selected?.key === c.key;
            const isWriting = i === writingIdx;
            const preview = thumbTextPreview(c);
            return (
              <button
                key={c.key}
                onClick={() => { setUserOverrodeSelection(true); setSelectedKey(c.key); }}
                style={{
                  display: 'flex', flexDirection: 'column', gap: 6,
                  padding: 8, borderRadius: 10,
                  background: isActive ? theme.thumbActive : theme.thumbBg,
                  border: `1px solid ${isActive ? accentColor : theme.thumbBorder}`,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 200ms',
                  position: 'relative',
                }}
              >
                {c.kind !== 'comp' && (
                  <div style={{
                    aspectRatio: '16/10',
                    width: '100%',
                    borderRadius: 6,
                    overflow: 'hidden',
                    background: 'rgba(168,85,247,0.08)',
                    border: `1px dashed ${theme.cardBorder}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, color: theme.muted,
                  }}>
                    {c.image?.imageDataBase64
                      ? <img src={`data:image/png;base64,${c.image.imageDataBase64}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : c.kind === 'cover'
                        ? <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, padding: 4, textAlign: 'center', lineHeight: 1.15 }}>{bible?.title ? bible.title.slice(0, 40) : 'Cover'}</div>
                        : imagesPhaseActive && c.kind === 'page' && c.pageNumber === nextUnrenderedPageNumber
                          ? <span className="sbv2-spinner" />
                          : ''}
                  </div>
                )}
                <div style={{ fontSize: 11, color: theme.textHeading, fontWeight: 600 }}>{c.short}</div>
                {preview && (
                  <div style={{
                    fontSize: 10, color: theme.muted, lineHeight: 1.3,
                    display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
                    overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {preview}
                  </div>
                )}
                {isWriting && (
                  <span style={{
                    position: 'absolute', top: 4, right: 4,
                    background: '#16a34a', color: 'white',
                    fontSize: 8, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase',
                    padding: '2px 5px', borderRadius: 3,
                  }}>live</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Main canvas */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '22px 24px 60px', minWidth: 0 }}>
          {selected && (
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
              {selected.kind === 'cover' ? (
                <div style={{
                  position: 'relative',
                  borderRadius: 14,
                  border: `1px solid ${theme.cardBorder}`,
                  background: isDark ? 'rgba(28,22,44,0.92)' : '#ffffff',
                  padding: 24,
                  boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                }}>
                  <div style={{
                    position: 'absolute', top: -10, left: 16,
                    background: accentColor, color: 'white',
                    fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase',
                    padding: '3px 10px', borderRadius: 5,
                  }}>Cover Page</div>
                  <div style={{
                    aspectRatio: '16/9',
                    borderRadius: 10,
                    background: `linear-gradient(135deg, ${accentColor}, ${accentColor}AA)`,
                    color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: 20, textAlign: 'center',
                    fontSize: 28, fontWeight: 800, lineHeight: 1.15,
                  }}>
                    {bible?.title || 'Generating title…'}
                  </div>
                  {bible?.characters && bible.characters.length > 0 && (
                    <div style={{ marginTop: 14, fontSize: 13, color: theme.muted }}>
                      Featuring: {bible.characters.map(c => c.name).filter(Boolean).join(', ')}
                    </div>
                  )}
                  {bible?.learning_objective && (
                    <div style={{ marginTop: 6, fontSize: 13, color: theme.textBody, fontStyle: 'italic', opacity: 0.85 }}>
                      {bible.learning_objective}
                    </div>
                  )}
                </div>
              ) : selected.kind === 'comp' ? (
                <div style={{
                  position: 'relative',
                  borderRadius: 14,
                  border: `1px solid ${theme.cardBorder}`,
                  background: isDark ? 'rgba(28,22,44,0.92)' : '#ffffff',
                  padding: 24,
                  boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                }}>
                  <div style={{
                    position: 'absolute', top: -10, left: 16,
                    background: accentColor, color: 'white',
                    fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase',
                    padding: '3px 10px', borderRadius: 5,
                  }}>Teacher notes</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {comprehensionQuestions.map((q, i) => (
                      <div key={i}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: theme.textHeading }}>Q{i + 1}. {q.question}</div>
                        <div style={{ fontSize: 13, color: theme.textBody, opacity: 0.85, marginTop: 4 }}>{q.answer}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <PageCard
                  label={selected.label}
                  segments={selected.textSegments}
                  image={selected.image}
                  showImage={selected.kind === 'page'}
                  showImageSpinner={
                    imagesPhaseActive &&
                    selected.kind === 'page' &&
                    !selected.image?.imageDataBase64 &&
                    !selected.image?.placeholder &&
                    selected.pageNumber === nextUnrenderedPageNumber
                  }
                  isWriting={selectedIsWriting}
                  liveSegmentText={selectedIsWriting && liveTarget ? (liveTypingValue ?? '') : null}
                  liveSegmentSpeaker={selectedIsWriting ? liveSpeaker : undefined}
                  accent={accentColor}
                  isDark={!!isDark}
                  nameFor={nameFor}
                />
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes sbv2-pulse { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes sbv2-spin { to { transform: rotate(360deg); } }
        @keyframes sbv2-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes sbv2-caret { to { visibility: hidden; } }
        @keyframes sbv2-border-pulse {
          0%, 100% { box-shadow: 0 0 0 2px ${accentColor}33, 0 0 24px ${accentColor}22; }
          50%      { box-shadow: 0 0 0 2px ${accentColor}66, 0 0 32px ${accentColor}44; }
        }
        .sbv2-spinner {
          width: 16px; height: 16px; border-radius: 50%;
          border: 2px solid rgba(168,85,247,0.25); border-top-color: rgba(168,85,247,0.95);
          animation: sbv2-spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default StorybookV2LiveView;
