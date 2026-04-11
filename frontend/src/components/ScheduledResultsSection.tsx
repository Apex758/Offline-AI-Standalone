import React, { useCallback, useEffect, useState } from 'react';

/**
 * Feature 3E: Scheduled Results section, embedded inside NotificationPanel.
 *
 * Polls /api/scheduled/results?teacher_id=<id>&status=pending_review on mount
 * and renders one compact card per result (ELO breakdown, attendance summary,
 * progress report). Each card has:
 *   - Accept (-> PATCH status='accepted')
 *   - Dismiss (-> PATCH status='rejected')
 *   - Expand/collapse to see the full details
 *
 * ELO breakdown cards additionally show the day-by-day period assignments.
 * Accept on an ELO breakdown calls an optional onAcceptElo callback so the
 * parent can queue individual lesson-plan generations for each day.
 */

const API_BASE = 'http://127.0.0.1:8000';

type ResultStatus = 'pending_review' | 'accepted' | 'rejected';
type TaskType = 'elo_breakdown' | 'attendance_summary' | 'progress_report';

interface ScheduledResult {
  id: string;
  teacher_id: string;
  task_type: TaskType;
  status: ResultStatus;
  result: any;
  week_of?: string;
  created_at: string;
}

interface Props {
  teacherId: string;
  onOpen?: boolean; // when true, refetch
  onAcceptElo?: (result: ScheduledResult) => void;
}

const LABELS: Record<TaskType, string> = {
  elo_breakdown: 'Weekly ELO Breakdown',
  attendance_summary: 'Attendance Summary',
  progress_report: 'Progress Report',
};

const ScheduledResultsSection: React.FC<Props> = ({ teacherId, onOpen, onAcceptElo }) => {
  const [results, setResults] = useState<ScheduledResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = useCallback(async () => {
    if (!teacherId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE}/api/scheduled/results?teacher_id=${encodeURIComponent(teacherId)}&status=pending_review&limit=20`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResults(data?.results || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => { fetchResults(); }, [fetchResults]);
  useEffect(() => { if (onOpen) fetchResults(); }, [onOpen, fetchResults]);

  const setStatus = useCallback(async (id: string, status: ResultStatus) => {
    try {
      const res = await fetch(`${API_BASE}/api/scheduled/results/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setResults(prev => prev.filter(r => r.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
  }, []);

  const handleAccept = useCallback(async (result: ScheduledResult) => {
    if (result.task_type === 'elo_breakdown' && onAcceptElo) {
      onAcceptElo(result);
    }
    await setStatus(result.id, 'accepted');
  }, [onAcceptElo, setStatus]);

  if (!teacherId) return null;
  if (!loading && results.length === 0 && !error) return null;

  return (
    <div style={{
      borderBottom: '1px solid rgba(120, 120, 120, 0.2)',
      padding: '12px 16px 10px',
      background: 'rgba(139, 92, 246, 0.04)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '8px',
      }}>
        <span style={{ fontSize: '11.5px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#8b5cf6' }}>
          Scheduled Results{results.length > 0 ? ` (${results.length})` : ''}
        </span>
        <button
          onClick={fetchResults}
          disabled={loading}
          style={{
            fontSize: '11px',
            color: '#8b5cf6',
            background: 'none',
            border: 'none',
            cursor: loading ? 'default' : 'pointer',
            opacity: loading ? 0.5 : 1,
            padding: '2px 4px',
          }}
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <p style={{ fontSize: '11px', color: '#dc2626', margin: '4px 0' }}>Error: {error}</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {results.map(r => (
          <ScheduledResultCard
            key={r.id}
            result={r}
            expanded={expandedId === r.id}
            onToggle={() => setExpandedId(prev => prev === r.id ? null : r.id)}
            onAccept={() => handleAccept(r)}
            onDismiss={() => setStatus(r.id, 'rejected')}
          />
        ))}
      </div>
    </div>
  );
};

// ── Card ───────────────────────────────────────────────────────────────

const ScheduledResultCard: React.FC<{
  result: ScheduledResult;
  expanded: boolean;
  onToggle: () => void;
  onAccept: () => void;
  onDismiss: () => void;
}> = ({ result, expanded, onToggle, onAccept, onDismiss }) => {
  const label = LABELS[result.task_type] || result.task_type;
  const weekLabel = result.week_of ? `Week of ${result.week_of}` : '';
  const body = result.result || {};
  const isFailed = !!body._failed;
  const isFallback = !!body._fallback;
  const isStub = !!body._stub;

  return (
    <div style={{
      border: '1px solid rgba(139, 92, 246, 0.25)',
      borderRadius: '8px',
      background: 'rgba(255, 255, 255, 0.6)',
      overflow: 'hidden',
    }} className="dark:bg-gray-900/30">
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          textAlign: 'left',
          padding: '8px 10px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}
      >
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary, #111)' }}>
          {label}
          {isFailed && <span style={{ marginLeft: 6, fontSize: '10px', color: '#dc2626' }}>Failed</span>}
          {isFallback && <span style={{ marginLeft: 6, fontSize: '10px', color: '#d97706' }}>Partial</span>}
          {isStub && <span style={{ marginLeft: 6, fontSize: '10px', color: '#6b7280' }}>Placeholder</span>}
        </span>
        {weekLabel && <span style={{ fontSize: '10.5px', color: '#6b7280' }}>{weekLabel}</span>}
        {!expanded && (
          <span style={{ fontSize: '11px', color: '#4b5563', marginTop: 2 }}>
            {summarizeResult(result)}
          </span>
        )}
      </button>

      {expanded && (
        <div style={{ padding: '8px 10px 10px', borderTop: '1px dashed rgba(139, 92, 246, 0.2)' }}>
          {renderBody(result)}
        </div>
      )}

      <div style={{
        display: 'flex',
        gap: '6px',
        padding: '6px 10px 8px',
        borderTop: '1px solid rgba(139, 92, 246, 0.15)',
      }}>
        <button
          onClick={onAccept}
          style={{
            flex: 1,
            fontSize: '11.5px',
            fontWeight: 500,
            padding: '5px 10px',
            background: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          {result.task_type === 'elo_breakdown' ? 'Accept & Queue Plans' : 'Accept'}
        </button>
        <button
          onClick={onDismiss}
          style={{
            fontSize: '11.5px',
            padding: '5px 10px',
            background: 'transparent',
            color: '#6b7280',
            border: '1px solid rgba(120, 120, 120, 0.3)',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

// ── Rendering helpers ──────────────────────────────────────────────────

function summarizeResult(r: ScheduledResult): string {
  const body = r.result || {};
  if (r.task_type === 'elo_breakdown') {
    const dayCount = (body.days || []).length;
    const periodCount = (body.days || []).reduce((sum: number, d: any) => sum + (d.periods?.length || 0), 0);
    if (dayCount === 0) return body.notes || 'No days scheduled';
    return `${dayCount} day(s), ${periodCount} period(s) planned`;
  }
  if (r.task_type === 'attendance_summary') {
    const s = body.stats;
    if (!s) return body.summary || 'No data';
    return `${s.avg_attendance_pct ?? 0}% attendance, ${s.absent ?? 0} absent, ${(body.flagged || []).length} flagged`;
  }
  if (r.task_type === 'progress_report') {
    const subjCount = Object.keys(body.by_subject || {}).length;
    return `${subjCount} subject(s), ${(body.highlights || []).length} highlights, ${(body.concerns || []).length} concerns`;
  }
  return '';
}

function renderBody(r: ScheduledResult) {
  const body = r.result || {};
  if (r.task_type === 'elo_breakdown') {
    const days = body.days || [];
    if (days.length === 0) {
      return <p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>{body.notes || 'No schedule generated.'}</p>;
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '220px', overflowY: 'auto' }}>
        {days.map((day: any, i: number) => (
          <div key={i}>
            <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#111', marginBottom: '2px' }}>
              {day.day} {day.date ? `(${day.date})` : ''}
            </div>
            {(day.periods || []).map((p: any, j: number) => (
              <div key={j} style={{ fontSize: '11px', color: '#4b5563', paddingLeft: '8px', marginTop: '1px' }}>
                <span style={{ color: '#6b7280' }}>{p.time}</span>
                {' — '}
                <span>Gr{p.grade} {p.subject}: </span>
                {p.elo ? (
                  <span style={{ color: '#8b5cf6' }}>{p.elo.topic_title}</span>
                ) : (
                  <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>(open — no ELO assigned)</span>
                )}
              </div>
            ))}
          </div>
        ))}
        {body.notes && (
          <p style={{ fontSize: '10.5px', color: '#6b7280', marginTop: '6px', fontStyle: 'italic' }}>{body.notes}</p>
        )}
      </div>
    );
  }

  if (r.task_type === 'attendance_summary') {
    const s = body.stats || {};
    const flagged = body.flagged || [];
    return (
      <div style={{ fontSize: '11px', color: '#374151', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {body.summary && <p style={{ margin: 0, lineHeight: 1.4 }}>{body.summary}</p>}
        <div style={{ display: 'flex', gap: '10px', fontSize: '10.5px', color: '#6b7280' }}>
          <span>Present: {s.present ?? 0}</span>
          <span>Absent: {s.absent ?? 0}</span>
          <span>Late: {s.late ?? 0}</span>
          <span>Avg: {s.avg_attendance_pct ?? 0}%</span>
        </div>
        {flagged.length > 0 && (
          <div>
            <div style={{ fontSize: '10.5px', fontWeight: 600, color: '#dc2626', marginBottom: '2px' }}>Flagged students:</div>
            {flagged.slice(0, 5).map((f: any, i: number) => (
              <div key={i} style={{ fontSize: '10.5px', color: '#4b5563' }}>
                • {f.name} ({f.absent} absent, {f.late} late)
              </div>
            ))}
            {flagged.length > 5 && <div style={{ fontSize: '10.5px', color: '#9ca3af' }}>...and {flagged.length - 5} more</div>}
          </div>
        )}
      </div>
    );
  }

  if (r.task_type === 'progress_report') {
    const bySubject = body.by_subject || {};
    const highlights = body.highlights || [];
    const concerns = body.concerns || [];
    return (
      <div style={{ fontSize: '11px', color: '#374151', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {body.summary && <p style={{ margin: 0, lineHeight: 1.4 }}>{body.summary}</p>}
        {Object.keys(bySubject).length > 0 && (
          <div>
            <div style={{ fontSize: '10.5px', fontWeight: 600, color: '#111', marginBottom: '2px' }}>Averages:</div>
            {Object.entries(bySubject).map(([subj, data]: any) => (
              <div key={subj} style={{ fontSize: '10.5px', color: '#4b5563' }}>
                • {subj}: {data.average}% ({data.count})
              </div>
            ))}
          </div>
        )}
        {highlights.length > 0 && (
          <div>
            <div style={{ fontSize: '10.5px', fontWeight: 600, color: '#059669', marginBottom: '2px' }}>Top:</div>
            {highlights.slice(0, 3).map((s: any, i: number) => (
              <div key={i} style={{ fontSize: '10.5px', color: '#4b5563' }}>• {s.name}: {s.average}%</div>
            ))}
          </div>
        )}
        {concerns.length > 0 && (
          <div>
            <div style={{ fontSize: '10.5px', fontWeight: 600, color: '#dc2626', marginBottom: '2px' }}>Support needed:</div>
            {concerns.slice(0, 3).map((s: any, i: number) => (
              <div key={i} style={{ fontSize: '10.5px', color: '#4b5563' }}>• {s.name}: {s.average}%</div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return <p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>No preview available.</p>;
}

export default ScheduledResultsSection;
