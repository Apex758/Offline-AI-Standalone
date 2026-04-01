import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRefetchOnActivation } from '../hooks/useRefetchOnActivation';
import { HugeiconsIcon } from '@hugeicons/react';
import Activity01IconData from '@hugeicons/core-free-icons/Activity01Icon';
import Download01IconData from '@hugeicons/core-free-icons/Download01Icon';
import Delete01IconData from '@hugeicons/core-free-icons/Delete01Icon';
import Refresh01IconData from '@hugeicons/core-free-icons/RefreshIcon';
import ComputerIconData from '@hugeicons/core-free-icons/ComputerIcon';
import ImageIconData from '@hugeicons/core-free-icons/Image01Icon';
import TextIconData from '@hugeicons/core-free-icons/TextIcon';
import Clock01IconData from '@hugeicons/core-free-icons/Clock01Icon';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useContainerSize } from '../hooks/useContainerSize';
import axios from 'axios';

const API = 'http://localhost:8000/api';
const POLL_INTERVAL = 2500;
const MAX_HISTORY = 30;

interface TextSummary {
  model_name: string;
  task_type: string;
  count: number;
  avg_tps: number;
  min_tps: number;
  max_tps: number;
  avg_ttft_ms: number;
  avg_total_ms: number;
  avg_completion_tokens: number;
  avg_ram_mb: number;
}

interface ImageSummary {
  model_name: string;
  backend: string;
  count: number;
  avg_total_ms: number;
  min_total_ms: number;
  max_total_ms: number;
  avg_sps: number;
  avg_ram_mb: number;
}

interface SystemSpecs {
  os: string;
  os_version: string;
  architecture: string;
  processor: string;
  python_version: string;
  cpu_count_logical: number;
  ram_total_gb?: number;
  ram_available_gb?: number;
}

interface MetricsSummary {
  total_text_generations: number;
  total_image_generations: number;
  text_summary: TextSummary[];
  image_summary: ImageSummary[];
  system_specs: SystemSpecs;
}

interface InferenceMetric {
  id: number;
  timestamp: string;
  model_name: string;
  task_type: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  ttft_ms: number;
  total_time_ms: number;
  tokens_per_second: number;
  cpu_percent: number;
  ram_usage_mb: number;
}

interface LiveStats {
  cpu_percent_system: number;
  cpu_percent_per_core: number[];
  ram_total_gb: number;
  ram_used_gb: number;
  ram_available_gb: number;
  ram_percent: number;
  app_cpu_percent: number;
  app_ram_mb: number;
}

interface LiveSnapshot {
  time: string;
  systemCpu: number;
  systemRam: number;
  systemRamGb: number;
  appCpu: number;
  appRamGb: number;
}

interface Props {
  tabId: string;
  savedData?: any;
  onDataChange?: (data: any) => void;
  isActive?: boolean;
}

const Icon: React.FC<{ icon: any; size?: number; className?: string }> = ({ icon, size = 20, className }) => (
  <HugeiconsIcon icon={icon} size={size} className={className} />
);

function formatMs(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatTime(iso: string): string {
  const d = new Date(iso + 'Z');
  return d.toLocaleString();
}

// ── Area Graph Card ──────────────────────────────────────────────────────────

const GRAPH_SERIES: { key: keyof LiveSnapshot; name: string; color: string }[] = [
  { key: 'systemCpu', name: 'System CPU', color: '#3b82f6' },
  { key: 'appCpu',    name: 'App CPU',    color: '#f59e0b' },
];

const RAM_SERIES: { key: keyof LiveSnapshot; name: string; color: string }[] = [
  { key: 'systemRamGb', name: 'System RAM (GB)', color: '#8b5cf6' },
  { key: 'appRamGb',    name: 'App RAM (GB)',    color: '#ec4899' },
];

const LiveAreaChart: React.FC<{
  data: LiveSnapshot[];
  series: { key: keyof LiveSnapshot; name: string; color: string }[];
  title: string;
  yDomain?: [number, number];
  yFormatter?: (v: number) => string;
}> = ({ data, series, title, yDomain = [0, 100], yFormatter }) => {
  const { ref: containerRef, width: chartWidth } = useContainerSize();
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());

  const toggleSeries = (key: string) =>
    setHiddenSeries(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div
        className="rounded-xl p-3"
        style={{
          backgroundColor: 'var(--dash-card-bg, var(--color-bg-surface))',
          border: '1px solid var(--dash-border, var(--color-border))',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          minWidth: 140,
        }}
      >
        <p className="font-semibold mb-2 text-xs text-theme-muted">{label}</p>
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center gap-2 text-xs mb-1">
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color, flexShrink: 0, display: 'inline-block' }} />
            <span className="text-theme-muted">{entry.name}</span>
            <span className="font-semibold ml-auto text-theme-primary">
              {yFormatter ? yFormatter(entry.value) : `${entry.value.toFixed(1)}%`}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="rounded-xl border border-theme-border bg-theme-surface p-5 flex flex-col">
      <h3 className="font-semibold text-theme-primary mb-3">{title}</h3>
      <div ref={containerRef} style={{ width: '100%', height: 200 }}>
        {chartWidth > 0 && (
          <AreaChart width={chartWidth} height={200} data={data} margin={{ top: 8, right: 8, left: 0, bottom: 5 }}>
            <defs>
              {series.map(s => (
                <linearGradient key={s.key} id={`live-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={s.color} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={s.color} stopOpacity={0.04} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--dash-border, rgba(128,128,128,0.15))" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: 'var(--dash-axis-tick, #888)' }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={yDomain}
              tick={{ fontSize: 10, fill: 'var(--dash-axis-tick, #888)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={yFormatter}
            />
            <Tooltip content={<CustomTooltip />} />
            {series.map(s => (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={s.color}
                strokeWidth={2}
                fill={`url(#live-${s.key})`}
                dot={false}
                activeDot={{ r: 4, fill: s.color, strokeWidth: 0 }}
                connectNulls
                hide={hiddenSeries.has(s.key)}
              />
            ))}
          </AreaChart>
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-3">
        {series.map(s => {
          const hidden = hiddenSeries.has(s.key);
          return (
            <button
              key={s.key}
              onClick={() => toggleSeries(s.key)}
              className="flex items-center gap-1.5 transition-opacity"
              style={{ opacity: hidden ? 0.35 : 1, cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
            >
              <span style={{
                width: 10, height: 10, borderRadius: '50%',
                background: hidden ? '#666' : s.color,
                flexShrink: 0, display: 'inline-block',
              }} />
              <span style={{
                fontSize: 12,
                color: hidden ? '#888' : undefined,
                textDecoration: hidden ? 'line-through' : 'none',
              }} className="text-theme-muted">
                {s.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ── Main Component ───────────────────────────────────────────────────────────

const PerformanceMetrics: React.FC<Props> = ({ tabId, isActive = true }) => {
  const [summary, setSummary] = useState<MetricsSummary | null>(null);
  const [history, setHistory] = useState<InferenceMetric[]>([]);
  const [liveStats, setLiveStats] = useState<LiveStats | null>(null);
  const [liveHistory, setLiveHistory] = useState<LiveSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [sumRes, histRes] = await Promise.all([
        axios.get(`${API}/metrics/summary`),
        axios.get(`${API}/metrics/history?type=text&limit=50`),
      ]);
      setSummary(sumRes.data);
      setHistory(histRes.data.metrics || []);
    } catch (err) {
      console.error('Failed to fetch metrics:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLiveStats = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/metrics/live-stats`);
      const stats: LiveStats = res.data;
      setLiveStats(stats);

      const now = new Date();
      const timeLabel = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      const cores = stats.cpu_percent_per_core?.length || 1;

      setLiveHistory(prev => {
        const next = [...prev, {
          time: timeLabel,
          systemCpu: stats.cpu_percent_system,
          systemRam: stats.ram_percent,
          systemRamGb: parseFloat(stats.ram_used_gb.toFixed(2)),
          appCpu: Math.min(100, stats.app_cpu_percent / cores),
          appRamGb: parseFloat((stats.app_ram_mb / 1024).toFixed(2)),
        }];
        return next.length > MAX_HISTORY ? next.slice(-MAX_HISTORY) : next;
      });
    } catch {
      // Silently ignore
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchLiveStats();
  }, [fetchData, fetchLiveStats]);

  useRefetchOnActivation(isActive, fetchData);

  useEffect(() => {
    pollRef.current = setInterval(fetchLiveStats, POLL_INTERVAL);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchLiveStats]);

  const handleExport = async () => {
    try {
      const res = await axios.get(`${API}/metrics/export`);
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `performance-report-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const handleClear = async () => {
    if (!confirm('Clear all metrics data? This cannot be undone.')) return;
    try {
      await axios.delete(`${API}/metrics/clear`);
      fetchData();
    } catch (err) {
      console.error('Clear failed:', err);
    }
  };

  if (loading && !summary) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-theme-muted">Loading metrics...</div>
      </div>
    );
  }

  const specs = summary?.system_specs;
  const maxRamGb = liveStats?.ram_total_gb || 16;

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon icon={Activity01IconData} size={28} className="text-theme-accent" />
          <div>
            <h1 className="text-2xl font-bold text-theme-primary">Performance Metrics</h1>
            <p className="text-sm text-theme-muted">Model benchmarks and system performance</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-theme-surface hover:bg-theme-hover text-theme-secondary text-sm transition-colors"
          >
            <Icon icon={Refresh01IconData} size={16} />
            Refresh
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-theme-surface hover:bg-theme-hover text-theme-secondary text-sm transition-colors"
          >
            <Icon icon={Download01IconData} size={16} />
            Export JSON
          </button>
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm transition-colors"
          >
            <Icon icon={Delete01IconData} size={16} />
            Clear
          </button>
        </div>
      </div>

      {/* System Specs Card */}
      {specs && (
        <div className="rounded-xl border border-theme-border bg-theme-surface p-5">
          <div className="flex items-center gap-2 mb-4">
            <Icon icon={ComputerIconData} size={20} className="text-theme-accent" />
            <h2 className="font-semibold text-theme-primary">System Specs</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-theme-muted">OS</div>
              <div className="text-theme-primary font-medium">{specs.os}</div>
            </div>
            <div>
              <div className="text-theme-muted">Processor</div>
              <div className="text-theme-primary font-medium">{specs.processor || specs.architecture}</div>
            </div>
            <div>
              <div className="text-theme-muted">CPU Cores</div>
              <div className="text-theme-primary font-medium">{specs.cpu_count_logical} logical</div>
            </div>
            <div>
              <div className="text-theme-muted">RAM</div>
              <div className="text-theme-primary font-medium">
                {specs.ram_total_gb ? `${specs.ram_total_gb} GB total` : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Resource Monitor — Area Graphs */}
      {liveHistory.length > 1 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <h2 className="font-semibold text-theme-primary">Live Resource Monitor</h2>
            <span className="text-xs text-theme-muted ml-auto">Updates every {POLL_INTERVAL / 1000}s</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LiveAreaChart
              data={liveHistory}
              series={GRAPH_SERIES}
              title="CPU Usage (%)"
              yDomain={[0, 100]}
            />
            <LiveAreaChart
              data={liveHistory}
              series={RAM_SERIES}
              title="RAM Usage (GB)"
              yDomain={[0, Math.ceil(maxRamGb)]}
              yFormatter={(v) => `${v} GB`}
            />
          </div>
        </div>
      )}

      {/* Current values */}
      {liveStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <LiveStatCard label="System CPU" value={`${liveStats.cpu_percent_system.toFixed(1)}%`} color="#3b82f6" />
          <LiveStatCard label="System RAM" value={`${liveStats.ram_used_gb.toFixed(1)} / ${liveStats.ram_total_gb.toFixed(1)} GB`} color="#8b5cf6" />
          <LiveStatCard label="App CPU" value={`${(liveStats.app_cpu_percent / (specs?.cpu_count_logical || 1)).toFixed(1)}%`} color="#f59e0b" />
          <LiveStatCard label="App RAM" value={`${(liveStats.app_ram_mb / 1024).toFixed(2)} GB`} color="#ec4899" />
        </div>
      )}

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Text Generations" value={summary?.total_text_generations ?? 0} icon={TextIconData} />
        <StatCard label="Image Generations" value={summary?.total_image_generations ?? 0} icon={ImageIconData} />
        <StatCard
          label="Avg Tokens/sec"
          value={
            summary?.text_summary?.length
              ? (summary.text_summary.reduce((a, b) => a + b.avg_tps * b.count, 0) /
                  summary.text_summary.reduce((a, b) => a + b.count, 0)).toFixed(1)
              : '—'
          }
          icon={Activity01IconData}
        />
        <StatCard
          label="Avg TTFT"
          value={
            (() => {
              const withTtft = summary?.text_summary?.filter(s => s.avg_ttft_ms != null && s.avg_ttft_ms > 0) || [];
              if (!withTtft.length) return '—';
              const totalWeighted = withTtft.reduce((a, b) => a + b.avg_ttft_ms * b.count, 0);
              const totalCount = withTtft.reduce((a, b) => a + b.count, 0);
              return formatMs(totalWeighted / totalCount);
            })()
          }
          icon={Clock01IconData}
        />
      </div>

      {/* Tab Toggle */}
      <div className="flex gap-1 bg-theme-surface rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'overview' ? 'bg-theme-accent text-white' : 'text-theme-muted hover:text-theme-primary'
          }`}
        >
          Summary
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'history' ? 'bg-theme-accent text-white' : 'text-theme-muted hover:text-theme-primary'
          }`}
        >
          History
        </button>
      </div>

      {activeTab === 'overview' ? (
        <div className="space-y-6">
          {summary?.text_summary && summary.text_summary.length > 0 && (
            <div className="rounded-xl border border-theme-border bg-theme-surface p-5">
              <div className="flex items-center gap-2 mb-4">
                <Icon icon={TextIconData} size={20} className="text-blue-400" />
                <h2 className="font-semibold text-theme-primary">Text Generation Performance</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-theme-muted border-b border-theme-border">
                      <th className="text-left py-2 pr-4">Model</th>
                      <th className="text-left py-2 pr-4">Task</th>
                      <th className="text-right py-2 pr-4">Count</th>
                      <th className="text-right py-2 pr-4">Avg TPS</th>
                      <th className="text-right py-2 pr-4">Min TPS</th>
                      <th className="text-right py-2 pr-4">Max TPS</th>
                      <th className="text-right py-2 pr-4">Avg TTFT</th>
                      <th className="text-right py-2 pr-4">Avg Time</th>
                      <th className="text-right py-2">Avg RAM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.text_summary.map((row, i) => (
                      <tr key={i} className="border-b border-theme-border/50 text-theme-primary">
                        <td className="py-2 pr-4 font-medium">{row.model_name}</td>
                        <td className="py-2 pr-4">{row.task_type}</td>
                        <td className="py-2 pr-4 text-right">{row.count}</td>
                        <td className="py-2 pr-4 text-right font-mono font-semibold text-green-400">{row.avg_tps}</td>
                        <td className="py-2 pr-4 text-right font-mono text-theme-muted">{row.min_tps}</td>
                        <td className="py-2 pr-4 text-right font-mono text-theme-muted">{row.max_tps}</td>
                        <td className="py-2 pr-4 text-right">{row.avg_ttft_ms ? formatMs(row.avg_ttft_ms) : '—'}</td>
                        <td className="py-2 pr-4 text-right">{formatMs(row.avg_total_ms)}</td>
                        <td className="py-2 text-right">{row.avg_ram_mb ? `${row.avg_ram_mb} MB` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {summary?.image_summary && summary.image_summary.length > 0 && (
            <div className="rounded-xl border border-theme-border bg-theme-surface p-5">
              <div className="flex items-center gap-2 mb-4">
                <Icon icon={ImageIconData} size={20} className="text-purple-400" />
                <h2 className="font-semibold text-theme-primary">Image Generation Performance</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-theme-muted border-b border-theme-border">
                      <th className="text-left py-2 pr-4">Model</th>
                      <th className="text-left py-2 pr-4">Backend</th>
                      <th className="text-right py-2 pr-4">Count</th>
                      <th className="text-right py-2 pr-4">Avg Time</th>
                      <th className="text-right py-2 pr-4">Min Time</th>
                      <th className="text-right py-2 pr-4">Max Time</th>
                      <th className="text-right py-2 pr-4">Avg Steps/s</th>
                      <th className="text-right py-2">Avg RAM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.image_summary.map((row, i) => (
                      <tr key={i} className="border-b border-theme-border/50 text-theme-primary">
                        <td className="py-2 pr-4 font-medium">{row.model_name}</td>
                        <td className="py-2 pr-4">{row.backend}</td>
                        <td className="py-2 pr-4 text-right">{row.count}</td>
                        <td className="py-2 pr-4 text-right font-mono font-semibold text-purple-400">{formatMs(row.avg_total_ms)}</td>
                        <td className="py-2 pr-4 text-right font-mono text-theme-muted">{formatMs(row.min_total_ms)}</td>
                        <td className="py-2 pr-4 text-right font-mono text-theme-muted">{formatMs(row.max_total_ms)}</td>
                        <td className="py-2 pr-4 text-right">{row.avg_sps}</td>
                        <td className="py-2 text-right">{row.avg_ram_mb ? `${row.avg_ram_mb} MB` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {(!summary?.text_summary?.length && !summary?.image_summary?.length) && (
            <div className="rounded-xl border border-theme-border bg-theme-surface p-12 text-center">
              <Icon icon={Activity01IconData} size={48} className="text-theme-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-theme-primary mb-2">No metrics recorded yet</h3>
              <p className="text-theme-muted text-sm">
                Start generating content. Performance data will appear here automatically.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-theme-border bg-theme-surface p-5">
          <h2 className="font-semibold text-theme-primary mb-4">Recent Generations</h2>
          {history.length === 0 ? (
            <p className="text-theme-muted text-sm text-center py-8">No history yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-theme-muted border-b border-theme-border">
                    <th className="text-left py-2 pr-3">Time</th>
                    <th className="text-left py-2 pr-3">Model</th>
                    <th className="text-left py-2 pr-3">Task</th>
                    <th className="text-right py-2 pr-3">Tokens</th>
                    <th className="text-right py-2 pr-3">TPS</th>
                    <th className="text-right py-2 pr-3">TTFT</th>
                    <th className="text-right py-2 pr-3">Total</th>
                    <th className="text-right py-2">RAM</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((row) => (
                    <tr key={row.id} className="border-b border-theme-border/50 text-theme-primary">
                      <td className="py-2 pr-3 text-xs text-theme-muted whitespace-nowrap">{formatTime(row.timestamp)}</td>
                      <td className="py-2 pr-3 font-medium text-xs">{row.model_name}</td>
                      <td className="py-2 pr-3">{row.task_type}</td>
                      <td className="py-2 pr-3 text-right font-mono">{row.completion_tokens}</td>
                      <td className="py-2 pr-3 text-right font-mono font-semibold text-green-400">{row.tokens_per_second}</td>
                      <td className="py-2 pr-3 text-right">{formatMs(row.ttft_ms)}</td>
                      <td className="py-2 pr-3 text-right">{formatMs(row.total_time_ms)}</td>
                      <td className="py-2 text-right">{row.ram_usage_mb ? `${Math.round(row.ram_usage_mb)} MB` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string | number; icon: any }> = ({ label, value, icon }) => (
  <div className="rounded-xl border border-theme-border bg-theme-surface p-4">
    <div className="flex items-center gap-2 mb-2">
      <Icon icon={icon} size={16} className="text-theme-accent" />
      <span className="text-xs text-theme-muted">{label}</span>
    </div>
    <div className="text-2xl font-bold text-theme-primary">{value}</div>
  </div>
);

const LiveStatCard: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div className="rounded-xl border border-theme-border bg-theme-surface p-4">
    <div className="flex items-center gap-2 mb-2">
      <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color, display: 'inline-block' }} />
      <span className="text-xs text-theme-muted">{label}</span>
    </div>
    <div className="text-lg font-bold font-mono text-theme-primary">{value}</div>
  </div>
);

export default PerformanceMetrics;
