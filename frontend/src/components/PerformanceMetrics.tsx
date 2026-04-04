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
import AlertCircleIconData from '@hugeicons/core-free-icons/AlertCircleIcon';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell } from 'recharts';
import { useContainerSize } from '../hooks/useContainerSize';
import axios from 'axios';

const API = 'http://localhost:8000/api';
const POLL_INTERVAL = 2500;
const MAX_HISTORY = 30;

/* ── Types ─────────────────────────────────────────────────────────────────── */

interface TextSummary {
  model_name: string;
  task_type: string;
  count: number;
  avg_tps: number;
  avg_ttft_ms: number;
  avg_total_ms: number;
  avg_completion_tokens: number;
}

interface ImageSummary {
  model_name: string;
  backend: string;
  count: number;
  avg_total_ms: number;
  avg_sps: number;
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
  has_gpu?: boolean;
  gpu_name?: string;
  gpu_vram_total_mb?: number;
  gpu_driver_version?: string;
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

interface GpuLiveStats {
  gpu_utilization: number;
  vram_used_mb: number;
  vram_total_mb: number;
  vram_percent: number;
  temperature_c: number;
  power_watts?: number | null;
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
  gpu?: GpuLiveStats | null;
}

interface LiveSnapshot {
  time: string;
  systemCpu: number;
  systemRam: number;
  systemRamGb: number;
  appCpu: number;
  appRamGb: number;
  gpuUtil: number | null;
  gpuVramGb: number | null;
  gpuTempC: number | null;
}

interface Props {
  tabId: string;
  savedData?: any;
  onDataChange?: (data: any) => void;
  isActive?: boolean;
}

/* ── Helpers ───────────────────────────────────────────────────────────────── */

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

/* ── Warning thresholds ────────────────────────────────────────────────────── */

interface Warning {
  level: 'warning' | 'critical';
  message: string;
}

function getResourceWarnings(stats: LiveStats | null, specs: SystemSpecs | undefined): Warning[] {
  if (!stats) return [];
  const warnings: Warning[] = [];

  if (stats.ram_percent >= 95) {
    warnings.push({ level: 'critical', message: `RAM critically high at ${stats.ram_percent.toFixed(0)}% — system may become unresponsive` });
  } else if (stats.ram_percent >= 85) {
    warnings.push({ level: 'warning', message: `RAM usage at ${stats.ram_percent.toFixed(0)}% — consider closing other applications` });
  }

  const appCpu = stats.app_cpu_percent / (specs?.cpu_count_logical || 1);
  if (stats.cpu_percent_system >= 95) {
    warnings.push({ level: 'critical', message: `CPU maxed out at ${stats.cpu_percent_system.toFixed(0)}% — generation speed will be reduced` });
  } else if (appCpu >= 80) {
    warnings.push({ level: 'warning', message: `App is using ${appCpu.toFixed(0)}% CPU — inference is CPU-bound` });
  }

  if (stats.gpu) {
    if (stats.gpu.vram_percent >= 95) {
      warnings.push({ level: 'critical', message: `GPU VRAM nearly full at ${stats.gpu.vram_percent.toFixed(0)}% — models may fail to load` });
    } else if (stats.gpu.vram_percent >= 85) {
      warnings.push({ level: 'warning', message: `GPU VRAM at ${stats.gpu.vram_percent.toFixed(0)}% — larger models may not fit` });
    }
    if (stats.gpu.temperature_c >= 90) {
      warnings.push({ level: 'critical', message: `GPU temperature at ${stats.gpu.temperature_c}°C — thermal throttling likely` });
    } else if (stats.gpu.temperature_c >= 80) {
      warnings.push({ level: 'warning', message: `GPU running warm at ${stats.gpu.temperature_c}°C` });
    }
  }

  return warnings;
}

/* ── Chart colors ──────────────────────────────────────────────────────────── */

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#84cc16'];

/* ── Area Graph Card ──────────────────────────────────────────────────────── */

const CPU_SERIES: { key: keyof LiveSnapshot; name: string; color: string }[] = [
  { key: 'systemCpu', name: 'System CPU', color: '#3b82f6' },
  { key: 'appCpu', name: 'App CPU', color: '#f59e0b' },
];

const RAM_SERIES: { key: keyof LiveSnapshot; name: string; color: string }[] = [
  { key: 'systemRamGb', name: 'System RAM (GB)', color: '#8b5cf6' },
  { key: 'appRamGb', name: 'App RAM (GB)', color: '#ec4899' },
];

const GPU_UTIL_SERIES: { key: keyof LiveSnapshot; name: string; color: string }[] = [
  { key: 'gpuUtil', name: 'GPU Utilization', color: '#10b981' },
];

const GPU_VRAM_SERIES: { key: keyof LiveSnapshot; name: string; color: string }[] = [
  { key: 'gpuVramGb', name: 'VRAM Used (GB)', color: '#06b6d4' },
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
      {series.length > 1 && (
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
      )}
    </div>
  );
};

/* ── Model Comparison Bar Chart ────────────────────────────────────────────── */

const ModelComparisonChart: React.FC<{
  textSummary: TextSummary[];
  imageSummary: ImageSummary[];
}> = ({ textSummary, imageSummary }) => {
  const { ref: containerRef, width: chartWidth } = useContainerSize();

  // Build bar data: TPS for text models, steps/s for image models
  const barData: { name: string; value: number; unit: string }[] = [];

  // Group text by model (aggregate across task types)
  const textByModel = new Map<string, { totalTps: number; totalCount: number }>();
  textSummary.forEach(row => {
    const existing = textByModel.get(row.model_name) || { totalTps: 0, totalCount: 0 };
    existing.totalTps += row.avg_tps * row.count;
    existing.totalCount += row.count;
    textByModel.set(row.model_name, existing);
  });
  textByModel.forEach((val, model) => {
    barData.push({
      name: model.length > 20 ? model.slice(0, 18) + '…' : model,
      value: parseFloat((val.totalTps / val.totalCount).toFixed(1)),
      unit: 'tok/s',
    });
  });

  imageSummary.forEach(row => {
    barData.push({
      name: (row.model_name.length > 20 ? row.model_name.slice(0, 18) + '…' : row.model_name),
      value: row.avg_sps,
      unit: 'steps/s',
    });
  });

  if (barData.length === 0) return null;

  const CustomBarTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div
        className="rounded-xl p-3"
        style={{
          backgroundColor: 'var(--dash-card-bg, var(--color-bg-surface))',
          border: '1px solid var(--dash-border, var(--color-border))',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        }}
      >
        <p className="font-semibold text-xs text-theme-primary">{d.name}</p>
        <p className="text-xs text-theme-muted mt-1">{d.value} {d.unit}</p>
      </div>
    );
  };

  return (
    <div className="rounded-xl border border-theme-border bg-theme-surface p-5">
      <h3 className="font-semibold text-theme-primary mb-4">Model Speed Comparison</h3>
      <div ref={containerRef} style={{ width: '100%', height: Math.max(200, barData.length * 44 + 40) }}>
        {chartWidth > 0 && (
          <BarChart
            width={chartWidth}
            height={Math.max(200, barData.length * 44 + 40)}
            data={barData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--dash-border, rgba(128,128,128,0.15))" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--dash-axis-tick, #888)' }} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: 'var(--dash-axis-tick, #888)' }}
              axisLine={false}
              tickLine={false}
              width={140}
            />
            <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'var(--dash-border, rgba(128,128,128,0.08))' }} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={28}>
              {barData.map((_entry, idx) => (
                <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        )}
      </div>
    </div>
  );
};

/* ── Main Component ───────────────────────────────────────────────────────── */

const PerformanceMetrics: React.FC<Props> = ({ tabId, isActive = true }) => {
  const [summary, setSummary] = useState<MetricsSummary | null>(null);
  const [history, setHistory] = useState<InferenceMetric[]>([]);
  const [liveStats, setLiveStats] = useState<LiveStats | null>(null);
  const [liveHistory, setLiveHistory] = useState<LiveSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');
  const [analyzerStatus, setAnalyzerStatus] = useState<'idle' | 'building' | 'done' | 'error'>('idle');
  const [analyzerError, setAnalyzerError] = useState<string | null>(null);
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
          gpuUtil: stats.gpu?.gpu_utilization ?? null,
          gpuVramGb: stats.gpu ? parseFloat((stats.gpu.vram_used_mb / 1024).toFixed(2)) : null,
          gpuTempC: stats.gpu?.temperature_c ?? null,
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

  const handleGenerateAnalyzer = async () => {
    setAnalyzerStatus('building');
    setAnalyzerError(null);
    try {
      const res = await axios.get(`${API}/generate-tier-analyzer`, {
        responseType: 'blob',
        timeout: 200_000,
      });
      const disposition = res.headers['content-disposition'] || '';
      const match = disposition.match(/filename="?([^"]+)"?/);
      const filename = match ? match[1] : 'OLH_Tier_Analyzer.exe';
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      setAnalyzerStatus('done');
      setTimeout(() => setAnalyzerStatus('idle'), 4000);
    } catch (err: any) {
      console.error('Analyzer generation failed:', err);
      let msg = 'Build failed.';
      try {
        const blob: Blob = err?.response?.data;
        if (blob instanceof Blob) {
          const text = await blob.text();
          const parsed = JSON.parse(text);
          if (parsed?.detail) msg = parsed.detail;
        } else if (err?.response?.data?.detail) {
          msg = err.response.data.detail;
        } else if (err?.message) {
          msg = err.message;
        }
      } catch { /* ignore */ }
      setAnalyzerError(msg);
      setAnalyzerStatus('error');
      setTimeout(() => { setAnalyzerStatus('idle'); setAnalyzerError(null); }, 8000);
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
  const hasGpu = specs?.has_gpu ?? false;
  const maxRamGb = liveStats?.ram_total_gb || 16;
  const maxVramGb = liveStats?.gpu ? Math.ceil(liveStats.gpu.vram_total_mb / 1024) : 8;
  const warnings = getResourceWarnings(liveStats, specs);

  // Compute weighted average TPS
  const avgTps = summary?.text_summary?.length
    ? (summary.text_summary.reduce((a, b) => a + b.avg_tps * b.count, 0) /
        summary.text_summary.reduce((a, b) => a + b.count, 0)).toFixed(1)
    : '—';

  // Compute weighted average TTFT
  const avgTtft = (() => {
    const withTtft = summary?.text_summary?.filter(s => s.avg_ttft_ms != null && s.avg_ttft_ms > 0) || [];
    if (!withTtft.length) return '—';
    const totalWeighted = withTtft.reduce((a, b) => a + b.avg_ttft_ms * b.count, 0);
    const totalCount = withTtft.reduce((a, b) => a + b.count, 0);
    return formatMs(totalWeighted / totalCount);
  })();

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
            onClick={handleGenerateAnalyzer}
            disabled={analyzerStatus === 'building'}
            title="Generate a standalone tool teachers can run to find their compatible OLH tier"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              analyzerStatus === 'done'
                ? 'bg-green-500/15 text-green-400'
                : analyzerStatus === 'error'
                ? 'bg-red-500/10 text-red-400'
                : analyzerStatus === 'building'
                ? 'bg-theme-surface text-theme-muted cursor-wait'
                : 'bg-theme-surface hover:bg-theme-hover text-theme-secondary'
            }`}
          >
            {analyzerStatus === 'building' ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                Building...
              </>
            ) : analyzerStatus === 'done' ? (
              <>
                <Icon icon={Download01IconData} size={16} />
                Analyzer Ready
              </>
            ) : analyzerStatus === 'error' ? (
              <>
                <Icon icon={Download01IconData} size={16} />
                Build Failed
              </>
            ) : (
              <>
                <Icon icon={Download01IconData} size={16} />
                OLH Tier Analyzer
              </>
            )}
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

      {/* Analyzer error banner */}
      {analyzerError && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <Icon icon={AlertCircleIconData} size={18} className="mt-0.5 shrink-0" />
          <div>
            <span className="font-semibold">Tier Analyzer build failed — </span>
            <span className="font-mono text-xs">{analyzerError}</span>
          </div>
        </div>
      )}

      {/* Resource Warnings */}
      {warnings.length > 0 && (
        <div className="space-y-2">
          {warnings.map((w, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                w.level === 'critical'
                  ? 'border-red-500/30 bg-red-500/10 text-red-400'
                  : 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'
              }`}
            >
              <Icon icon={AlertCircleIconData} size={18} />
              <span>{w.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* System Specs Card */}
      {specs && (
        <div className="rounded-xl border border-theme-border bg-theme-surface p-5">
          <div className="flex items-center gap-2 mb-4">
            <Icon icon={ComputerIconData} size={20} className="text-theme-accent" />
            <h2 className="font-semibold text-theme-primary">System Specs</h2>
          </div>
          <div className={`grid grid-cols-2 ${hasGpu ? 'md:grid-cols-3 lg:grid-cols-6' : 'md:grid-cols-4'} gap-4 text-sm`}>
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
                {specs.ram_total_gb ? `${specs.ram_total_gb} GB` : 'N/A'}
              </div>
            </div>
            {hasGpu && (
              <>
                <div>
                  <div className="text-theme-muted">GPU</div>
                  <div className="text-theme-primary font-medium">{specs.gpu_name}</div>
                </div>
                <div>
                  <div className="text-theme-muted">VRAM</div>
                  <div className="text-theme-primary font-medium">
                    {specs.gpu_vram_total_mb ? `${(specs.gpu_vram_total_mb / 1024).toFixed(1)} GB` : 'N/A'}
                  </div>
                </div>
              </>
            )}
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
          <div className={`grid grid-cols-1 ${hasGpu ? 'lg:grid-cols-2' : 'md:grid-cols-2'} gap-4`}>
            <LiveAreaChart
              data={liveHistory}
              series={CPU_SERIES}
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
            {hasGpu && (
              <>
                <LiveAreaChart
                  data={liveHistory}
                  series={GPU_UTIL_SERIES}
                  title="GPU Utilization (%)"
                  yDomain={[0, 100]}
                />
                <LiveAreaChart
                  data={liveHistory}
                  series={GPU_VRAM_SERIES}
                  title="VRAM Usage (GB)"
                  yDomain={[0, maxVramGb]}
                  yFormatter={(v) => `${v} GB`}
                />
              </>
            )}
          </div>
        </div>
      )}

      {/* Current values — live stat cards */}
      {liveStats && (
        <div className={`grid grid-cols-2 ${hasGpu ? 'md:grid-cols-3 lg:grid-cols-4' : 'md:grid-cols-4'} gap-4`}>
          <LiveStatCard label="System CPU" value={`${liveStats.cpu_percent_system.toFixed(1)}%`} color="#3b82f6" />
          <LiveStatCard label="System RAM" value={`${liveStats.ram_used_gb.toFixed(1)} / ${liveStats.ram_total_gb.toFixed(1)} GB`} color="#8b5cf6" />
          <LiveStatCard label="App CPU" value={`${(liveStats.app_cpu_percent / (specs?.cpu_count_logical || 1)).toFixed(1)}%`} color="#f59e0b" />
          <LiveStatCard label="App RAM" value={`${(liveStats.app_ram_mb / 1024).toFixed(2)} GB`} color="#ec4899" />
          {liveStats.gpu && (
            <>
              <LiveStatCard label="GPU Load" value={`${liveStats.gpu.gpu_utilization.toFixed(0)}%`} color="#10b981" />
              <LiveStatCard
                label="VRAM"
                value={`${(liveStats.gpu.vram_used_mb / 1024).toFixed(1)} / ${(liveStats.gpu.vram_total_mb / 1024).toFixed(1)} GB`}
                color="#06b6d4"
              />
              <LiveStatCard label="GPU Temp" value={`${liveStats.gpu.temperature_c}°C`} color={liveStats.gpu.temperature_c >= 80 ? '#ef4444' : '#10b981'} />
              {liveStats.gpu.power_watts != null && (
                <LiveStatCard label="GPU Power" value={`${liveStats.gpu.power_watts} W`} color="#f59e0b" />
              )}
            </>
          )}
        </div>
      )}

      {/* Key Metrics Cards — Avg TPS and Avg TTFT */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        <StatCard
          label="Avg Tokens/sec"
          value={avgTps}
          icon={Activity01IconData}
        />
        <StatCard
          label="Avg Time-to-First-Token"
          value={avgTtft}
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
          {/* Model Speed Comparison Bar Chart */}
          {(summary?.text_summary?.length || summary?.image_summary?.length) ? (
            <ModelComparisonChart
              textSummary={summary?.text_summary || []}
              imageSummary={summary?.image_summary || []}
            />
          ) : null}

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
                      <th className="text-right py-2 pr-4">Avg TTFT</th>
                      <th className="text-right py-2">Avg Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.text_summary.map((row, i) => (
                      <tr key={i} className="border-b border-theme-border/50 text-theme-primary">
                        <td className="py-2 pr-4 font-medium">{row.model_name}</td>
                        <td className="py-2 pr-4">{row.task_type}</td>
                        <td className="py-2 pr-4 text-right">{row.count}</td>
                        <td className="py-2 pr-4 text-right font-mono font-semibold text-green-400">{row.avg_tps}</td>
                        <td className="py-2 pr-4 text-right">{row.avg_ttft_ms ? formatMs(row.avg_ttft_ms) : '—'}</td>
                        <td className="py-2 text-right">{formatMs(row.avg_total_ms)}</td>
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
                      <th className="text-right py-2">Avg Steps/s</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.image_summary.map((row, i) => (
                      <tr key={i} className="border-b border-theme-border/50 text-theme-primary">
                        <td className="py-2 pr-4 font-medium">{row.model_name}</td>
                        <td className="py-2 pr-4">{row.backend}</td>
                        <td className="py-2 pr-4 text-right">{row.count}</td>
                        <td className="py-2 pr-4 text-right font-mono font-semibold text-purple-400">{formatMs(row.avg_total_ms)}</td>
                        <td className="py-2 text-right">{row.avg_sps}</td>
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
                    <th className="text-right py-2">Total</th>
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
                      <td className="py-2 text-right">{formatMs(row.total_time_ms)}</td>
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
