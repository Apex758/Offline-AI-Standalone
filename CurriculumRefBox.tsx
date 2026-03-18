'use client'

import { useState } from 'react'
import Icon from '@/components/Icon'
import type { CurriculumRef } from '@/types'

export default function CurriculumRefBox({ refs }: { refs: CurriculumRef[] }) {
  const [expanded, setExpanded] = useState<string | null>(null)

  if (!refs || refs.length === 0) return null

  return (
    <div
      className="max-w-[78%] mt-2 rounded-xl overflow-hidden"
      style={{
        background: 'var(--bg-raised)',
        border: '1px solid var(--accent-border)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 py-2"
        style={{
          background: 'var(--accent-muted)',
          borderBottom: '1px solid var(--accent-border)',
        }}
      >
        <Icon name="book" size={14} color="var(--accent)" />
        <span
          className="text-xs font-semibold uppercase"
          style={{ color: 'var(--accent)', letterSpacing: '0.08em' }}
        >
          Curriculum Reference
        </span>
      </div>

      {/* Entries */}
      <div className="px-3 py-2 space-y-2">
        {refs.map((ref) => {
          const isExpanded = expanded === ref.id
          return (
            <div key={ref.id}>
              <button
                onClick={() => setExpanded(isExpanded ? null : ref.id)}
                className="w-full flex items-start gap-2 text-left group"
                style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
              >
                <Icon
                  name={isExpanded ? 'chevron-down' : 'chevron-right'}
                  size={12}
                  color="var(--text-muted)"
                  className="mt-0.5 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="text-xs font-medium px-1.5 py-0.5 rounded"
                      style={{
                        background: 'var(--accent-muted)',
                        color: 'var(--accent)',
                        fontSize: 10,
                      }}
                    >
                      Grade {ref.grade}
                    </span>
                    <span
                      className="text-xs font-medium"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {ref.subject}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {ref.displayName}
                    </span>
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="ml-5 mt-1.5 space-y-1.5">
                  {ref.essentialOutcomes[0] && (
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {typeof ref.essentialOutcomes[0] === 'string'
                        ? ref.essentialOutcomes[0]
                        : (ref.essentialOutcomes[0] as any).text}
                    </p>
                  )}
                  {ref.specificOutcomes.length > 0 && (
                    <div className="space-y-0.5">
                      <p
                        className="text-xs font-medium"
                        style={{ color: 'var(--text-muted)', fontSize: 10, letterSpacing: '0.06em' }}
                      >
                        SPECIFIC OUTCOMES
                      </p>
                      {ref.specificOutcomes.map((o: any, i: number) => (
                        <p
                          key={i}
                          className="text-xs leading-relaxed pl-2"
                          style={{
                            color: 'var(--text-secondary)',
                            borderLeft: '2px solid var(--accent-border)',
                          }}
                        >
                          {typeof o === 'string' ? o : o.text}
                        </p>
                      ))}
                      {ref.totalOutcomes > ref.specificOutcomes.length && (
                        <p
                          className="text-xs italic"
                          style={{ color: 'var(--text-hint)' }}
                        >
                          + {ref.totalOutcomes - ref.specificOutcomes.length} more outcomes
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
