/**
 * Single source of truth for lesson plan export dimensions.
 *
 * Both the HTML renderer (PDF pipeline via WeasyPrint) and the DOCX exporter
 * read from this spec so the preview, PDF and Word output all share the same
 * column ratios, font sizes and padding. Change a number here -> all three
 * pipelines move together.
 *
 * Phase 1 of the WYSIWYG lock-in plan: PDF only. The DOCX builder will read
 * from this same spec in Phase 2.
 */

export const LESSON_EXPORT_SPEC = {
  // A4 page geometry. `marginMm` is consumed by the HTML renderer (via an
  // @page CSS rule) so WeasyPrint produces narrow PDF margins instead of its
  // default ~2cm. Will also drive python-docx section margins in Phase 2.
  page: {
    widthMm: 210,
    heightMm: 297,
    marginMm: 10,
  },

  // Typography (px for HTML/PDF, pt for DOCX)
  font: {
    family: "Georgia, 'Times New Roman', serif",
    bodyPx: 13,
    bodyPt: 11,
    smallPx: 11,
    smallPt: 9,
    microPx: 10,
    microPt: 8,
    h1Px: 22,
    h1Pt: 18,
    h2Px: 16,
    h2Pt: 14,
  },

  // Cell metrics
  cell: {
    paddingV: 10, // px
    paddingH: 12, // px
    borderPx: 1,
    lineHeight: 1.5,
  },

  // Locked column ratios per table.
  // Table 1 (header/outcomes): 6 columns -> label/value pairs.
  // Table 2 (components):      2 columns -> 28% label / 72% lesson plan.
  // Table 3 (reflections):     2 columns -> 38% prompt / 62% response.
  tables: {
    header: {
      // 6 columns. Labels narrow, values wide.
      columnsPct: [14, 22, 16, 22, 14, 12],
    },
    components: {
      columnsPct: [28, 72],
    },
    reflections: {
      columnsPct: [38, 62],
    },
  },
} as const;

/**
 * Helper: build a <colgroup> string with explicit percentage widths.
 * Used by the HTML renderer so WeasyPrint (and browsers) honour the
 * locked ratios instead of auto-distributing columns.
 */
export function buildColgroup(columnsPct: readonly number[]): string {
  return `<colgroup>${columnsPct
    .map((pct) => `<col style="width:${pct}%;" />`)
    .join("")}</colgroup>`;
}
