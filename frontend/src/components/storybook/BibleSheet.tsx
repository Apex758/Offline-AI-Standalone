/**
 * BibleSheet
 *
 * Fixed-size paper-sheet card shown during Pass 1 of the v2 storybook
 * generator. Consumes the partially-parsed StorybookBible produced by
 * `useStreamingJson` and paginates content across logical sections (in the
 * order the backend generates them: plan → outline → characters → world).
 * Fields only appear when their JSON value commits, so streaming feels
 * chunked rather than character-by-character.
 */
import React, { useEffect, useMemo, useState } from 'react';
import type { StorybookBible } from '../../types/storybook';

type SectionId = 'plan' | 'outline' | 'characters' | 'world';

interface BibleSheetProps {
  bible: Partial<StorybookBible> | null;
  isDark?: boolean;
}

// Order matches backend generation order so the tabs step through
// plan → outline → characters → world as the bible streams in.
const SECTION_ORDER: SectionId[] = ['plan', 'outline', 'characters', 'world'];
const SECTION_LABEL: Record<SectionId, string> = {
  plan: 'Plan',
  outline: 'Outline',
  characters: 'Characters',
  world: 'World',
};

/** Return the LATEST populated section (furthest along in generation order). */
function sectionForParsed(bible: Partial<StorybookBible> | null): SectionId {
  if (!bible) return 'plan';
  if (bible.world && (
    bible.world.setting || bible.world.mood || bible.world.time_period ||
    bible.world.color_palette ||
    (bible.world.recurring_locations && bible.world.recurring_locations.length > 0)
  )) return 'world';
  if (bible.characters && bible.characters.length > 0) return 'characters';
  if (bible.outline && bible.outline.length > 0) return 'outline';
  return 'plan';
}

interface Palette {
  bg: string;
  text: string;
  textStrong: string;
  muted: string;
  accent: string;
  accentStrong: string;
  border: string;
  dashed: string;
  shadow: string;
  tagBg: string;
  tagText: string;
  buttonBg: string;
  buttonDisabledText: string;
  dotInactive: string;
}

function palette(isDark: boolean): Palette {
  if (isDark) {
    return {
      bg: 'linear-gradient(155deg, rgba(44,32,66,0.97) 0%, rgba(30,22,46,0.97) 100%)',
      text: '#d8d0e8',
      textStrong: '#f2ecfb',
      muted: 'rgba(216,208,232,0.55)',
      accent: '#b887ea',
      accentStrong: '#c99cf2',
      border: 'rgba(184,135,234,0.25)',
      dashed: 'rgba(184,135,234,0.35)',
      shadow: '0 22px 48px rgba(0,0,0,0.55), 0 4px 12px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)',
      tagBg: '#8e52d0',
      tagText: '#fffbee',
      buttonBg: 'rgba(184,135,234,0.12)',
      buttonDisabledText: 'rgba(216,208,232,0.35)',
      dotInactive: 'rgba(184,135,234,0.35)',
    };
  }
  return {
    bg: 'linear-gradient(155deg, #fffbee 0%, #faeccc 100%)',
    text: '#3d2f19',
    textStrong: '#2a1d0d',
    muted: 'rgba(61,47,25,0.55)',
    accent: '#c78c3c',
    accentStrong: '#8a6d3b',
    border: '#d4bc7a',
    dashed: '#d4bc7a',
    shadow: '0 22px 48px rgba(60,40,10,0.35), 0 4px 12px rgba(60,40,10,0.18), inset 0 1px 0 rgba(255,255,255,0.7)',
    tagBg: '#c78c3c',
    tagText: '#fffbee',
    buttonBg: '#fffbee',
    buttonDisabledText: '#b09a6a',
    dotInactive: '#d4bc7a',
  };
}

const SectionHeader: React.FC<{ label: string; pal: Palette }> = ({ label, pal }) => (
  <div
    style={{
      fontFamily: "'Baloo 2','Nunito',cursive,sans-serif",
      fontWeight: 800,
      fontSize: 12,
      letterSpacing: 1.5,
      color: pal.accentStrong,
      textTransform: 'uppercase',
      marginBottom: 6,
      paddingBottom: 4,
      borderBottom: `2px dashed ${pal.dashed}`,
    }}
  >
    {label}
  </div>
);

const Bullet: React.FC<{ label?: string; children?: React.ReactNode; pal: Palette }> = ({ label, children, pal }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, lineHeight: 1.4, marginBottom: 6, fontSize: 13 }}>
    <span style={{ color: pal.accent, flex: '0 0 auto', fontWeight: 700 }}>•</span>
    <div style={{ flex: 1 }}>
      {label && <span style={{ fontWeight: 700, color: pal.accentStrong }}>{label}: </span>}
      <span style={{ color: pal.text }}>{children}</span>
    </div>
  </div>
);

export const BibleSheet: React.FC<BibleSheetProps> = ({ bible, isDark }) => {
  const pal = palette(!!isDark);
  const autoSection = useMemo(() => sectionForParsed(bible), [bible]);
  const [userPage, setUserPage] = useState<SectionId | null>(null);

  // Reset user override when a fresh bible starts (title re-parses).
  useEffect(() => { setUserPage(null); }, [bible?.title]);
  // Auto-advance to the latest populated section unless user took control.
  useEffect(() => {
    if (userPage === null) return; // already auto-tracking
  }, [autoSection, userPage]);

  const active = userPage ?? autoSection;
  const activeIdx = SECTION_ORDER.indexOf(active);
  const prev = () => setUserPage(SECTION_ORDER[Math.max(0, activeIdx - 1)]);
  const next = () => setUserPage(SECTION_ORDER[Math.min(SECTION_ORDER.length - 1, activeIdx + 1)]);

  const waiting = (label: string) => (
    <div style={{ opacity: 0.4, fontSize: 13, color: pal.muted }}>{label}</div>
  );

  const renderPlan = () => (
    <>
      <SectionHeader label="Title" pal={pal} />
      <div style={{ fontSize: 18, fontWeight: 700, color: pal.textStrong, marginBottom: 14, minHeight: 24 }}>
        {bible?.title || <span style={{ opacity: 0.4, color: pal.muted }}>…</span>}
      </div>
      <SectionHeader label="Plan" pal={pal} />
      <Bullet pal={pal} label="Learning">{bible?.learning_objective || <span style={{ opacity: 0.4, color: pal.muted }}>…</span>}</Bullet>
      <Bullet pal={pal} label="Age">{bible?.target_age || <span style={{ opacity: 0.4, color: pal.muted }}>…</span>}</Bullet>
      <Bullet pal={pal} label="Style">{bible?.style_anchor || <span style={{ opacity: 0.4, color: pal.muted }}>…</span>}</Bullet>
    </>
  );

  const renderOutline = () => (
    <>
      <SectionHeader label={`Outline${bible?.outline ? ` (${bible.outline.length} pages)` : ''}`} pal={pal} />
      {bible?.outline && bible.outline.length > 0
        ? bible.outline.map((beat, i) => (
            <Bullet pal={pal} key={beat.page ?? i} label={`Page ${beat.page ?? i + 1}`}>
              {beat.beat || ''}{beat.purpose ? ` — ${beat.purpose}` : ''}
            </Bullet>
          ))
        : waiting('Waiting for outline…')}
    </>
  );

  const renderCharacters = () => (
    <>
      <SectionHeader label={`Characters${bible?.characters ? ` (${bible.characters.length})` : ''}`} pal={pal} />
      {bible?.characters && bible.characters.length > 0
        ? bible.characters.map((c, i) => (
            <Bullet pal={pal} key={c.id || i} label={c.name || c.id || `Character ${i + 1}`}>
              {[c.species_or_type, c.visual_description, c.personality].filter(Boolean).join(' — ')}
            </Bullet>
          ))
        : waiting('Waiting for characters…')}
    </>
  );

  const renderWorld = () => (
    <>
      <SectionHeader label="World" pal={pal} />
      {bible?.world
        ? <>
            {bible.world.setting && <Bullet pal={pal} label="Setting">{bible.world.setting}</Bullet>}
            {bible.world.mood && <Bullet pal={pal} label="Mood">{bible.world.mood}</Bullet>}
            {bible.world.time_period && <Bullet pal={pal} label="Time">{bible.world.time_period}</Bullet>}
            {bible.world.color_palette && <Bullet pal={pal} label="Palette">{bible.world.color_palette}</Bullet>}
            {bible.world.recurring_locations && bible.world.recurring_locations.length > 0 && (
              <Bullet pal={pal} label="Locations">{bible.world.recurring_locations.join(' · ')}</Bullet>
            )}
          </>
        : waiting('Waiting for world…')}
    </>
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 680,
        height: 500,
        maxWidth: '90vw',
        maxHeight: '82vh',
        zIndex: 20,
        background: pal.bg,
        color: pal.text,
        border: `1px solid ${pal.border}`,
        borderRadius: 14,
        boxShadow: pal.shadow,
        padding: '26px 28px 20px',
        fontFamily: "'Baloo 2','Nunito','Comic Sans MS',cursive,sans-serif",
        display: 'flex', flexDirection: 'column',
      }}
    >
      <div
        style={{
          position: 'absolute', top: -14, left: 24,
          background: pal.tagBg, color: pal.tagText,
          fontSize: 11, fontWeight: 800, letterSpacing: 1.2,
          textTransform: 'uppercase',
          padding: '4px 12px', borderRadius: 6,
          boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
        }}
      >
        Pass 1 · Story Bible
      </div>

      <div style={{ flex: 1, overflow: 'auto', paddingRight: 4 }}>
        {active === 'plan' && renderPlan()}
        {active === 'outline' && renderOutline()}
        {active === 'characters' && renderCharacters()}
        {active === 'world' && renderWorld()}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: `1px solid ${pal.dashed}` }}>
        <button
          onClick={prev}
          disabled={activeIdx === 0}
          style={{
            fontFamily: "'Baloo 2','Nunito',cursive,sans-serif",
            fontSize: 12, fontWeight: 700,
            padding: '5px 12px', borderRadius: 6,
            border: `1px solid ${pal.border}`,
            background: activeIdx === 0 ? 'transparent' : pal.buttonBg,
            color: activeIdx === 0 ? pal.buttonDisabledText : pal.accentStrong,
            cursor: activeIdx === 0 ? 'not-allowed' : 'pointer',
            opacity: activeIdx === 0 ? 0.5 : 1,
          }}
        >
          ◄ {activeIdx > 0 ? SECTION_LABEL[SECTION_ORDER[activeIdx - 1]] : 'Back'}
        </button>

        <div style={{ display: 'flex', gap: 6 }}>
          {SECTION_ORDER.map(s => (
            <button
              key={s}
              onClick={() => setUserPage(s)}
              title={SECTION_LABEL[s]}
              style={{
                width: 9, height: 9, borderRadius: '50%',
                border: 'none', padding: 0, cursor: 'pointer',
                background: s === active ? pal.accent : pal.dotInactive,
                opacity: s === active ? 1 : 0.45,
                transition: 'all 200ms',
              }}
            />
          ))}
        </div>

        <button
          onClick={next}
          disabled={activeIdx === SECTION_ORDER.length - 1}
          style={{
            fontFamily: "'Baloo 2','Nunito',cursive,sans-serif",
            fontSize: 12, fontWeight: 700,
            padding: '5px 12px', borderRadius: 6,
            border: `1px solid ${pal.border}`,
            background: activeIdx === SECTION_ORDER.length - 1 ? 'transparent' : pal.buttonBg,
            color: activeIdx === SECTION_ORDER.length - 1 ? pal.buttonDisabledText : pal.accentStrong,
            cursor: activeIdx === SECTION_ORDER.length - 1 ? 'not-allowed' : 'pointer',
            opacity: activeIdx === SECTION_ORDER.length - 1 ? 0.5 : 1,
          }}
        >
          {activeIdx < SECTION_ORDER.length - 1 ? SECTION_LABEL[SECTION_ORDER[activeIdx + 1]] : 'Next'} ►
        </button>
      </div>
    </div>
  );
};

export default BibleSheet;
