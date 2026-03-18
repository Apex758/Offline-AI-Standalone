import React, { useState, useEffect, useCallback } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import Activity01IconData from '@hugeicons/core-free-icons/Activity01Icon';
import Download01IconData from '@hugeicons/core-free-icons/Download01Icon';
import Delete01IconData from '@hugeicons/core-free-icons/Delete01Icon';
import Refresh01IconData from '@hugeicons/core-free-icons/RefreshIcon';
import ComputerIconData from '@hugeicons/core-free-icons/ComputerIcon';
import ImageIconData from '@hugeicons/core-free-icons/Image01Icon';
import TextIconData from '@hugeicons/core-free-icons/TextIcon';
import Clock01IconData from '@hugeicons/core-free-icons/Clock01Icon';
import axios from 'axios';

const API = 'http://localhost:8000/api';

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

interface Props {
  tabId: string;
  savedData?: any;
  onDataChange?: (data: any) => void;
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

const PerformanceMetrics: React.FC<Props> = ({ tabId }) => {
  const [summary, setSummary] = useState<MetricsSummary | null>(null);
  const [history, setHistory] = useState<InferenceMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');

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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
                {specs.ram_available_gb ? ` (${specs.ram_available_gb} GB free)` : ''}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Text Generations"
          value={summary?.total_text_generations ?? 0}
          icon={TextIconData}
        />
        <StatCard
          label="Image Generations"
          value={summary?.total_image_generations ?? 0}
          icon={ImageIconData}
        />
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
            summary?.text_summary?.length
              ? formatMs(
                  summary.text_summary.reduce((a, b) => a + b.avg_ttft_ms * b.count, 0) /
                    summary.text_summary.reduce((a, b) => a + b.count, 0)
                )
              : '—'
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
          {/* Text Generation Summary */}
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
                        <td className="py-2 pr-4 text-right">{formatMs(row.avg_ttft_ms)}</td>
                        <td className="py-2 pr-4 text-right">{formatMs(row.avg_total_ms)}</td>
                        <td className="py-2 text-right">{row.avg_ram_mb ? `${row.avg_ram_mb} MB` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Image Generation Summary */}
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

          {/* Empty State */}
          {(!summary?.text_summary?.length && !summary?.image_summary?.length) && (
            <div className="rounded-xl border border-theme-border bg-theme-surface p-12 text-center">
              <Icon icon={Activity01IconData} size={48} className="text-theme-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-theme-primary mb-2">No metrics recorded yet</h3>
              <p className="text-theme-muted text-sm">
                Start using PEARL AI to generate content. Performance data will appear here automatically.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* History Tab */
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

export default PerformanceMetrics;
