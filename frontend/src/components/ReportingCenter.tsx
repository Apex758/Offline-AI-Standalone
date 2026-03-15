import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle, Send, Loader2, CheckCircle, Clock,
  ChevronDown, ChevronRight, Tag, MessageSquare,
  Image, X, Filter, ArrowUpDown, Search, Bug,
  Lightbulb, HelpCircle, Zap, FileText, Camera
} from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface ReportingCenterProps {
  tabId: string;
  savedData?: any;
  onDataChange?: (data: any) => void;
  initialScreenshot?: string | null;
}

interface Ticket {
  id: string;
  category: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-review' | 'resolved';
  createdAt: string;
  screenshot?: string;
}

const TICKET_CATEGORIES = [
  { id: 'bug', label: 'Bug Report', icon: Bug, color: '#ef4444', description: 'Something isn\'t working correctly' },
  { id: 'feature', label: 'Feature Request', icon: Lightbulb, color: '#f59e0b', description: 'Suggest a new feature or improvement' },
  { id: 'content', label: 'Content Issue', icon: FileText, color: '#8b5cf6', description: 'Incorrect or missing curriculum content' },
  { id: 'performance', label: 'Performance Issue', icon: Zap, color: '#f97316', description: 'App is slow or unresponsive' },
  { id: 'question', label: 'General Question', icon: HelpCircle, color: '#06b6d4', description: 'Need help with something' },
  { id: 'other', label: 'Other', icon: MessageSquare, color: '#64748b', description: 'Anything else' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', color: '#64748b', description: 'Minor issue, no rush' },
  { value: 'medium', label: 'Medium', color: '#f59e0b', description: 'Affecting my work' },
  { value: 'high', label: 'High', color: '#ef4444', description: 'Blocking my work' },
];

const STATUS_LABELS: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  'open': { label: 'Open', color: '#3b82f6', icon: Clock },
  'in-review': { label: 'In Review', color: '#f59e0b', icon: Search },
  'resolved': { label: 'Resolved', color: '#10b981', icon: CheckCircle },
};

const ReportingCenter: React.FC<ReportingCenterProps> = ({ tabId, savedData, onDataChange, initialScreenshot }) => {
  const { settings } = useSettings();
  const [view, setView] = useState<'list' | 'create'>(savedData?.view || 'list');
  const [tickets, setTickets] = useState<Ticket[]>(savedData?.tickets || []);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority'>('newest');
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);

  // Form state
  const [category, setCategory] = useState('bug');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [screenshot, setScreenshot] = useState<string | null>(initialScreenshot || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // If initialScreenshot is provided, switch to create view
  useEffect(() => {
    if (initialScreenshot) {
      setScreenshot(initialScreenshot);
      setView('create');
      setCategory('bug');
      setDescription('(Screenshot attached — please describe what you see or what went wrong)');
    }
  }, [initialScreenshot]);

  const saveState = (updates: Record<string, any>) => {
    const newData = {
      view,
      tickets,
      ...updates
    };
    onDataChange?.(newData);
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setScreenshot(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!subject.trim() || !description.trim()) return;

    setSubmitting(true);

    // Simulate ticket submission (would be an API call in production)
    await new Promise(resolve => setTimeout(resolve, 1200));

    const newTicket: Ticket = {
      id: `TK-${String(tickets.length + 1).padStart(4, '0')}`,
      category,
      subject: subject.trim(),
      description: description.trim(),
      priority,
      status: 'open',
      createdAt: new Date().toISOString(),
      screenshot: screenshot || undefined,
    };

    const updatedTickets = [newTicket, ...tickets];
    setTickets(updatedTickets);
    setSubmitting(false);
    setSubmitSuccess(true);
    saveState({ tickets: updatedTickets });

    // Reset form after showing success
    setTimeout(() => {
      setSubmitSuccess(false);
      setSubject('');
      setDescription('');
      setPriority('medium');
      setCategory('bug');
      setScreenshot(null);
      setView('list');
      saveState({ tickets: updatedTickets, view: 'list' });
    }, 2000);
  };

  const filteredTickets = tickets
    .filter(t => filterStatus === 'all' || t.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  const categoryInfo = TICKET_CATEGORIES.find(c => c.id === category);

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div
        className="px-6 py-5 flex-shrink-0"
        style={{
          borderBottom: '1px solid var(--border-primary)',
          background: 'var(--bg-secondary)'
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(249,115,22,0.15))',
                  border: '1px solid rgba(239,68,68,0.2)'
                }}
              >
                <AlertTriangle className="w-5 h-5" style={{ color: 'rgb(239,68,68)' }} />
              </div>
              <div>
                <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  Reporting Center
                </h1>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Submit and track support tickets
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                const newView = view === 'list' ? 'create' : 'list';
                setView(newView);
                saveState({ view: newView });
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              style={{
                background: view === 'list'
                  ? 'linear-gradient(135deg, rgb(59,130,246), rgb(37,99,235))'
                  : 'var(--bg-primary)',
                color: view === 'list' ? 'white' : 'var(--text-primary)',
                border: view === 'list' ? 'none' : '1px solid var(--border-primary)',
                boxShadow: view === 'list' ? '0 2px 8px rgba(59,130,246,0.3)' : 'none'
              }}
            >
              {view === 'list' ? (
                <>
                  <Send className="w-4 h-4" />
                  New Ticket
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  View Tickets
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {submitSuccess ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'rgba(16,185,129,0.15)' }}
              >
                <CheckCircle className="w-8 h-8" style={{ color: '#10b981' }} />
              </div>
              <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Ticket Submitted!
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                Thank you for your feedback. We'll review your ticket shortly.
              </p>
            </div>
          ) : view === 'create' ? (
            /* Create Ticket Form */
            <div className="space-y-5">
              {/* Category Selection */}
              <div>
                <label className="text-sm font-medium block mb-2" style={{ color: 'var(--text-primary)' }}>
                  Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TICKET_CATEGORIES.map(cat => {
                    const CatIcon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className="flex items-center gap-2.5 p-3 rounded-xl text-left transition-all"
                        style={{
                          background: isSelected ? `${cat.color}15` : 'var(--bg-secondary)',
                          border: `1.5px solid ${isSelected ? `${cat.color}50` : 'var(--border-primary)'}`,
                          transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                        }}
                      >
                        <CatIcon
                          className="w-4 h-4 flex-shrink-0"
                          style={{ color: isSelected ? cat.color : 'var(--text-muted)' }}
                        />
                        <div className="min-w-0">
                          <p
                            className="text-xs font-semibold"
                            style={{ color: isSelected ? cat.color : 'var(--text-primary)' }}
                          >
                            {cat.label}
                          </p>
                          <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
                            {cat.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="text-sm font-medium block mb-2" style={{ color: 'var(--text-primary)' }}>
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Brief summary of the issue..."
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-primary)',
                    color: 'var(--text-primary)',
                  }}
                  maxLength={120}
                />
                <p className="text-xs mt-1 text-right" style={{ color: 'var(--text-muted)' }}>
                  {subject.length}/120
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium block mb-2" style={{ color: 'var(--text-primary)' }}>
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Please describe the issue in detail. What were you trying to do? What happened instead? Any steps to reproduce?"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-primary)',
                    color: 'var(--text-primary)',
                    minHeight: '120px',
                  }}
                  rows={5}
                />
              </div>

              {/* Priority */}
              <div>
                <label className="text-sm font-medium block mb-2" style={{ color: 'var(--text-primary)' }}>
                  Priority
                </label>
                <div className="flex gap-2">
                  {PRIORITY_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setPriority(opt.value as 'low' | 'medium' | 'high')}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                      style={{
                        background: priority === opt.value ? `${opt.color}18` : 'var(--bg-secondary)',
                        border: `1.5px solid ${priority === opt.value ? `${opt.color}50` : 'var(--border-primary)'}`,
                        color: priority === opt.value ? opt.color : 'var(--text-secondary)',
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: opt.color }}
                      />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Screenshot */}
              <div>
                <label className="text-sm font-medium block mb-2" style={{ color: 'var(--text-primary)' }}>
                  Screenshot (optional)
                </label>
                {screenshot ? (
                  <div className="relative rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-primary)' }}>
                    <img
                      src={screenshot}
                      alt="Attached screenshot"
                      className="w-full max-h-64 object-contain"
                      style={{ background: 'var(--bg-secondary)' }}
                    />
                    <button
                      onClick={() => setScreenshot(null)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{
                        background: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex flex-col items-center gap-2 px-4 py-6 rounded-xl transition-colors"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '2px dashed var(--border-primary)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgb(59,130,246)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-primary)')}
                  >
                    <Camera className="w-6 h-6" style={{ color: 'var(--text-muted)' }} />
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Click to upload a screenshot, or use the floating help button's camera option
                    </span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleScreenshotUpload}
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!subject.trim() || !description.trim() || submitting}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: (!subject.trim() || !description.trim())
                    ? 'var(--bg-secondary)'
                    : 'linear-gradient(135deg, rgb(59,130,246), rgb(37,99,235))',
                  color: (!subject.trim() || !description.trim()) ? 'var(--text-muted)' : 'white',
                  opacity: submitting ? 0.7 : 1,
                  boxShadow: (!subject.trim() || !description.trim()) ? 'none' : '0 4px 16px rgba(59,130,246,0.3)',
                  cursor: (!subject.trim() || !description.trim()) ? 'not-allowed' : 'pointer',
                }}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Ticket
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Ticket List View */
            <div>
              {/* Filters */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                  <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    className="text-xs px-2 py-1.5 rounded-lg outline-none"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-primary)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <option value="all">All Status</option>
                    <option value="open">Open</option>
                    <option value="in-review">In Review</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
                <div className="flex items-center gap-1.5">
                  <ArrowUpDown className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as typeof sortBy)}
                    className="text-xs px-2 py-1.5 rounded-lg outline-none"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-primary)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="priority">By Priority</option>
                  </select>
                </div>
                <span className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>
                  {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''}
                </span>
              </div>

              {filteredTickets.length === 0 ? (
                <div className="text-center py-16">
                  <FileText className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
                  <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {tickets.length === 0 ? 'No tickets yet' : 'No matching tickets'}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    {tickets.length === 0
                      ? 'Create a ticket to report issues or request features'
                      : 'Try changing your filter settings'}
                  </p>
                  {tickets.length === 0 && (
                    <button
                      onClick={() => { setView('create'); saveState({ view: 'create' }); }}
                      className="mt-4 flex items-center gap-2 mx-auto px-4 py-2 rounded-xl text-sm font-medium"
                      style={{
                        background: 'linear-gradient(135deg, rgb(59,130,246), rgb(37,99,235))',
                        color: 'white',
                        boxShadow: '0 2px 8px rgba(59,130,246,0.3)',
                      }}
                    >
                      <Send className="w-4 h-4" />
                      Create Your First Ticket
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredTickets.map(ticket => {
                    const catInfo = TICKET_CATEGORIES.find(c => c.id === ticket.category);
                    const CatIcon = catInfo?.icon || MessageSquare;
                    const statusInfo = STATUS_LABELS[ticket.status];
                    const StatusIcon = statusInfo.icon;
                    const isExpanded = expandedTicket === ticket.id;
                    const priorityInfo = PRIORITY_OPTIONS.find(p => p.value === ticket.priority);

                    return (
                      <div
                        key={ticket.id}
                        className="rounded-xl overflow-hidden transition-all"
                        style={{
                          border: `1px solid ${isExpanded ? (catInfo?.color || 'var(--border-primary)') + '40' : 'var(--border-primary)'}`,
                          background: 'var(--bg-secondary)',
                        }}
                      >
                        <button
                          onClick={() => setExpandedTicket(isExpanded ? null : ticket.id)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left"
                        >
                          <CatIcon
                            className="w-4 h-4 flex-shrink-0"
                            style={{ color: catInfo?.color || 'var(--text-muted)' }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                                {ticket.id}
                              </span>
                              <span
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium"
                                style={{
                                  background: `${statusInfo.color}18`,
                                  color: statusInfo.color,
                                }}
                              >
                                <StatusIcon className="w-2.5 h-2.5" />
                                {statusInfo.label}
                              </span>
                              <span
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium"
                                style={{
                                  background: `${priorityInfo?.color}18`,
                                  color: priorityInfo?.color,
                                }}
                              >
                                {ticket.priority}
                              </span>
                              {ticket.screenshot && (
                                <Image className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                              )}
                            </div>
                            <p className="text-sm font-medium mt-0.5 truncate" style={{ color: 'var(--text-primary)' }}>
                              {ticket.subject}
                            </p>
                          </div>
                          <span className="text-[10px] flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </span>
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                          ) : (
                            <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                          )}
                        </button>

                        {isExpanded && (
                          <div
                            className="px-4 pb-4"
                            style={{ borderTop: '1px solid var(--border-primary)' }}
                          >
                            <p
                              className="text-sm mt-3 leading-relaxed whitespace-pre-wrap"
                              style={{ color: 'var(--text-secondary)' }}
                            >
                              {ticket.description}
                            </p>
                            {ticket.screenshot && (
                              <div className="mt-3 rounded-lg overflow-hidden" style={{ border: '1px solid var(--border-primary)' }}>
                                <img
                                  src={ticket.screenshot}
                                  alt="Ticket screenshot"
                                  className="w-full max-h-80 object-contain"
                                  style={{ background: 'var(--bg-primary)' }}
                                />
                              </div>
                            )}
                            <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                              <span>Category: {catInfo?.label}</span>
                              <span>Priority: {ticket.priority}</span>
                              <span>Created: {new Date(ticket.createdAt).toLocaleString()}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportingCenter;
