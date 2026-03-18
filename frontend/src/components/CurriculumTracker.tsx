import React, { useState, useEffect, useMemo } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import ArrowRight01IconData from '@hugeicons/core-free-icons/ArrowRight01Icon';
import ArrowDown01IconData from '@hugeicons/core-free-icons/ArrowDown01Icon';
import CircleIconData from '@hugeicons/core-free-icons/CircleIcon';
import CheckmarkCircle01IconData from '@hugeicons/core-free-icons/CheckmarkCircle01Icon';
import PlayCircleIconData from '@hugeicons/core-free-icons/PlayCircleIcon';
import CancelCircleIconData from '@hugeicons/core-free-icons/CancelCircleIcon';
import Calendar01IconData from '@hugeicons/core-free-icons/Calendar01Icon';
import PencilEdit01IconData from '@hugeicons/core-free-icons/PencilEdit01Icon';
import FilterIconData from '@hugeicons/core-free-icons/FilterIcon';
import BookOpen01IconData from '@hugeicons/core-free-icons/BookOpen01Icon';
import ChartIncreaseIconData from '@hugeicons/core-free-icons/ChartIncreaseIcon';
import Target01IconData from '@hugeicons/core-free-icons/Target01Icon';
import Clock01IconData from '@hugeicons/core-free-icons/Clock01Icon';
import AlertCircleIconData from '@hugeicons/core-free-icons/AlertCircleIcon';
import ArrowUp01IconData from '@hugeicons/core-free-icons/ArrowUp01Icon';
import CheckListIconData from '@hugeicons/core-free-icons/CheckListIcon';

const IconW: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const ChevronRight: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={ArrowRight01IconData} {...p} />;
const ChevronDown: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={ArrowDown01IconData} {...p} />;
const Circle: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={CircleIconData} {...p} />;
const CheckCircle2: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={CheckmarkCircle01IconData} {...p} />;
const PlayCircle: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={PlayCircleIconData} {...p} />;
const XCircle: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={CancelCircleIconData} {...p} />;
const Calendar: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={Calendar01IconData} {...p} />;
const Edit2: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={PencilEdit01IconData} {...p} />;
const Filter: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={FilterIconData} {...p} />;
const BookOpen: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={BookOpen01IconData} {...p} />;
const TrendingUp: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={ChartIncreaseIconData} {...p} />;
const Target: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={Target01IconData} {...p} />;
const Clock: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={Clock01IconData} {...p} />;
const AlertCircle: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={AlertCircleIconData} {...p} />;
const ChevronUp: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={ArrowUp01IconData} {...p} />;
const ListChecks: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={CheckListIconData} {...p} />;
import { milestoneApi } from '../lib/milestoneApi';
import type { Milestone, MilestoneTreeNode, ChecklistItem } from '../types/milestone';
import { format, parseISO } from 'date-fns';
import { useSettings } from '../contexts/SettingsContext';
import SmartTextArea from './SmartTextArea';

import { TutorialOverlay } from './TutorialOverlay';
import { tutorials, TUTORIAL_IDS } from '../data/tutorialSteps';
import curriculumIndex from '../data/curriculumIndex.json';
import CurriculumSkillTree from './CurriculumSkillTree';

const curriculumPages = (curriculumIndex as any).indexedPages || [];

interface EloGroup {
  elo: string;
  scoRange: [number, number]; // [startIndex, endIndex] inclusive
}

// Build lookups: topic_id -> eloGroups (structured) or essentialOutcomes (fallback)
const eloGroupsLookup = new Map<string, EloGroup[]>();
const eloLookup = new Map<string, string[]>();
curriculumPages.forEach((page: any) => {
  if (page.id) {
    if (page.eloGroups) {
      eloGroupsLookup.set(page.id, page.eloGroups);
    }
    if (page.essentialOutcomes) {
      eloLookup.set(page.id, page.essentialOutcomes.map((e: any) => typeof e === 'string' ? e : e.text));
    }
  }
});

interface CurriculumTrackerProps {
  tabId: string;
  savedData?: any;
  onDataChange: (data: any) => void;
}

const CurriculumTracker: React.FC<CurriculumTrackerProps> = ({
  tabId,
  savedData,
  onDataChange
}) => {
  const { settings, markTutorialComplete, isTutorialCompleted } = useSettings();
  const accentColor = settings.tabColors['curriculum-tracker'] ?? '#22c55e';
  const [showTutorial, setShowTutorial] = useState(false);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [filters, setFilters] = useState({
    grade: '',
    subject: '',
    status: ''
  });
  const [expandedChecklists, setExpandedChecklists] = useState<Set<string>>(new Set());
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);
  const highlightTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Draggable divider: right panel as fraction of total width (0.4 = 40%)
  const [rightPanelRatio, setRightPanelRatio] = useState(() => {
    const saved = localStorage.getItem('curriculum-tracker-divider');
    return saved ? parseFloat(saved) : 0.4;
  });
  const isDragging = React.useRef(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const handleDividerMouseDown = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMouseMove = (ev: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newRatio = (rect.right - ev.clientX) / rect.width;
      setRightPanelRatio(Math.max(0.15, Math.min(0.5, newRatio)));
    };

    const onMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      // Persist the divider position
      setRightPanelRatio(prev => {
        localStorage.setItem('curriculum-tracker-divider', String(prev));
        return prev;
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, []);

  const teacherId = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')!).username
    : 'default_teacher';

  useEffect(() => {
    loadMilestones();
  }, [filters]);

  // Tutorial auto-show logic
  useEffect(() => {
    if (
      settings.tutorials.tutorialPreferences.autoShowOnFirstUse &&
      !isTutorialCompleted(TUTORIAL_IDS.CURRICULUM_TRACKER)
    ) {
      setShowTutorial(true);
    }
  }, [settings, isTutorialCompleted]);

  const handleTutorialComplete = () => {
    markTutorialComplete(TUTORIAL_IDS.CURRICULUM_TRACKER);
    setShowTutorial(false);
  };

  const [hasSynced, setHasSynced] = useState(false);

  const loadMilestones = async () => {
    setLoading(true);
    try {
      // On first load, always initialize/sync to pick up curriculum changes
      if (!hasSynced && !filters.grade && !filters.subject && !filters.status) {
        await milestoneApi.initialize(teacherId);
        setHasSynced(true);
      }

      const data = await milestoneApi.getMilestones(teacherId, {
        grade: filters.grade || undefined,
        subject: filters.subject || undefined,
        status: filters.status || undefined
      });
      setMilestones(data);
    } catch (error) {
      console.error('Failed to load milestones:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter milestones by profile
  const filteredMilestones = useMemo(() => {
    if (!settings.profile.filterContentByProfile) return milestones;
    return milestones.filter(m => {
      const gradeOk = settings.profile.gradeLevels.length === 0 || settings.profile.gradeLevels.includes(m.grade.toLowerCase());
      const subjectOk = settings.profile.subjects.length === 0 || settings.profile.subjects.includes(m.subject);
      return gradeOk && subjectOk;
    });
  }, [milestones, settings.profile.filterContentByProfile, settings.profile.gradeLevels, settings.profile.subjects]);

  // Build tree structure
  const treeData = useMemo(() => {
    const tree: MilestoneTreeNode[] = [];
    const gradeMap = new Map<string, MilestoneTreeNode>();

    filteredMilestones.forEach(milestone => {
      // Get or create grade node
      if (!gradeMap.has(milestone.grade)) {
        const gradeNode: MilestoneTreeNode = {
          id: `grade-${milestone.grade}`,
          label: milestone.grade,
          type: 'grade',
          children: []
        };
        gradeMap.set(milestone.grade, gradeNode);
        tree.push(gradeNode);
      }

      const gradeNode = gradeMap.get(milestone.grade)!;

      // Get or create subject node
      let subjectNode = gradeNode.children?.find(n => n.label === milestone.subject);
      if (!subjectNode) {
        subjectNode = {
          id: `subject-${milestone.grade}-${milestone.subject}`,
          label: milestone.subject,
          type: 'subject',
          children: []
        };
        gradeNode.children!.push(subjectNode);
      }

      // Get or create strand node (if exists)
      if (milestone.strand) {
        let strandNode = subjectNode.children?.find(n => n.label === milestone.strand);
        if (!strandNode) {
          strandNode = {
            id: `strand-${milestone.grade}-${milestone.subject}-${milestone.strand}`,
            label: milestone.strand,
            type: 'strand',
            milestones: []
          };
          subjectNode.children!.push(strandNode);
        }
        strandNode.milestones!.push(milestone);
      } else {
        // No strand, add directly to subject
        if (!subjectNode.milestones) subjectNode.milestones = [];
        subjectNode.milestones.push(milestone);
      }
    });

    // Calculate progress for each node
    const calculateProgress = (node: MilestoneTreeNode): void => {
      if (node.milestones) {
        const total = node.milestones.length;
        const completed = node.milestones.filter(m => m.status === 'completed').length;
        node.progress = {
          total,
          completed,
          percentage: total > 0 ? Math.round((completed / total) * 100) : 0
        };
      } else if (node.children) {
        node.children.forEach(calculateProgress);
        const total = node.children.reduce((sum, child) => sum + (child.progress?.total || 0), 0);
        const completed = node.children.reduce((sum, child) => sum + (child.progress?.completed || 0), 0);
        node.progress = {
          total,
          completed,
          percentage: total > 0 ? Math.round((completed / total) * 100) : 0
        };
      }
    };

    tree.forEach(calculateProgress);

    // Sort grades: Kindergarten first, then numeric order
    tree.sort((a, b) => {
      if (a.label === 'K') return -1;
      if (b.label === 'K') return 1;
      return Number(a.label) - Number(b.label);
    });

    return tree;
  }, [filteredMilestones]);

  // Get unique values for filters (respecting profile content filtering)
  const uniqueGrades = useMemo(() => {
    const all = [...new Set(milestones.map(m => m.grade))].sort((a, b) => {
      if (a === 'K') return -1;
      if (b === 'K') return 1;
      return Number(a) - Number(b);
    });
    if (settings.profile.filterContentByProfile && settings.profile.gradeLevels.length > 0) {
      return all.filter(g => settings.profile.gradeLevels.includes(g.toLowerCase()));
    }
    return all;
  }, [milestones, settings.profile.filterContentByProfile, settings.profile.gradeLevels]);

  const uniqueSubjects = useMemo(() => {
    const all = [...new Set(milestones.map(m => m.subject))].sort();
    if (settings.profile.filterContentByProfile && settings.profile.subjects.length > 0) {
      return all.filter(s => settings.profile.subjects.includes(s));
    }
    return all;
  }, [milestones, settings.profile.filterContentByProfile, settings.profile.subjects]);

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  // Optimistically update a milestone in local state without full reload
  const updateMilestoneLocally = (milestoneId: string, updates: Partial<Milestone>) => {
    setMilestones(prev => prev.map(m =>
      m.id === milestoneId ? { ...m, ...updates } : m
    ));
  };

  const handleUpdateMilestone = async (
    milestoneId: string,
    update: Partial<Milestone>
  ) => {
    try {
      // When marking as completed, auto-check all checklist items
      if (update.status === 'completed') {
        const milestone = milestones.find(m => m.id === milestoneId);
        if (milestone && milestone.checklist && milestone.checklist.length > 0) {
          const allChecked = milestone.checklist.map(item => ({ ...item, checked: true }));
          update = { ...update, checklist: allChecked, checklist_json: JSON.stringify(allChecked) };
        }
      }
      // Optimistic local update
      updateMilestoneLocally(milestoneId, update as Partial<Milestone>);
      await milestoneApi.updateMilestone(milestoneId, update);
      if (selectedMilestone?.id === milestoneId) {
        setSelectedMilestone(null);
      }
    } catch (error) {
      console.error('Failed to update milestone:', error);
      // Reload on error to restore correct state
      await loadMilestones();
    }
  };

  const handleChecklistToggle = async (milestone: Milestone, index: number) => {
    const updatedChecklist = milestone.checklist.map((item, i) =>
      i === index ? { ...item, checked: !item.checked } : item
    );
    const updates: Partial<Milestone> = { checklist: updatedChecklist };
    // Auto-switch to in_progress when first outcome is checked on a not_started milestone
    if (milestone.status === 'not_started' && updatedChecklist.some(c => c.checked)) {
      updates.status = 'in_progress';
    }
    // Optimistic local update (no reload, no scroll jump)
    updateMilestoneLocally(milestone.id, updates);
    try {
      const apiUpdate: any = { checklist_json: JSON.stringify(updatedChecklist) };
      if (updates.status) apiUpdate.status = updates.status;
      await milestoneApi.updateMilestone(milestone.id, apiUpdate);
    } catch (error) {
      console.error('Failed to update checklist:', error);
      await loadMilestones();
    }
  };

  const toggleChecklist = (milestoneId: string) => {
    setExpandedChecklists(prev => {
      const next = new Set(prev);
      if (next.has(milestoneId)) next.delete(milestoneId);
      else next.add(milestoneId);
      return next;
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'in_progress': return <PlayCircle className="w-5 h-5" style={{ color: accentColor }} />;
      case 'skipped': return <XCircle className="w-5 h-5 text-gray-400 dark:text-gray-500" />;
      default: return <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700';
      case 'in_progress': return 'border-2 font-medium';
      case 'skipped': return 'bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-700/30 dark:text-gray-400 dark:border-gray-600';
      default: return 'bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-800/30 dark:text-gray-400 dark:border-gray-600';
    }
  };

  const renderMilestone = (milestone: Milestone) => {
    const checklist = milestone.checklist || [];
    const checkedCount = checklist.filter(c => c.checked).length;
    const isChecklistExpanded = expandedChecklists.has(milestone.id);
    const elos = eloLookup.get(milestone.topic_id) || [];
    const eloGroups = eloGroupsLookup.get(milestone.topic_id) || [];

    return (
      <div
        key={milestone.id}
        className={`ml-8 p-3 rounded-lg border-2 transition-all ${
          selectedMilestone?.id === milestone.id
            ? 'bg-theme-surface'
            : 'border-theme bg-theme-surface'
        }`}
        style={selectedMilestone?.id === milestone.id
          ? { borderColor: accentColor, backgroundColor: `${accentColor}08` }
          : {}
        }
        data-tutorial="milestone-item"
      >
        <div className="flex items-center justify-between">
          <div
            className={`flex items-center space-x-3 flex-1 ${(checklist.length > 0 || elos.length > 0) ? 'cursor-pointer' : ''}`}
            onClick={() => (checklist.length > 0 || elos.length > 0) && toggleChecklist(milestone.id)}
          >
            {(checklist.length > 0 || elos.length > 0) ? (
              isChecklistExpanded
                ? <ChevronDown className="w-5 h-5 text-theme-muted flex-shrink-0" />
                : <ChevronRight className="w-5 h-5 text-theme-muted flex-shrink-0" />
            ) : (
              <div className="w-5" />
            )}
            {getStatusIcon(milestone.status)}
            <div className="flex-1">
              <h4 className="font-semibold text-theme-title">{milestone.topic_title}</h4>
              {milestone.notes && (
                <p className="text-sm text-theme-muted mt-1">{milestone.notes}</p>
              )}
              <div className="flex items-center space-x-3 mt-1">
                {milestone.due_date && (
                  <div className="flex items-center space-x-1 text-xs text-theme-hint">
                    <Calendar className="w-3 h-3" />
                    <span>Due: {format(parseISO(milestone.due_date), 'MMM d, yyyy')}</span>
                  </div>
                )}
                {checklist.length > 0 && (
                  <div className="flex items-center space-x-1 text-xs text-theme-muted">
                    <ListChecks className="w-3 h-3" />
                    <span>{checkedCount}/{checklist.length} outcomes</span>
                    <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${checklist.length > 0 ? Math.round((checkedCount / checklist.length) * 100) : 0}%`,
                          backgroundColor: accentColor
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={milestone.status}
              onChange={(e) => handleUpdateMilestone(milestone.id, { status: e.target.value as any })}
              className={`px-3 py-1 rounded-lg border-2 font-medium text-sm ${getStatusColor(milestone.status)}`}
              style={milestone.status === 'in_progress' ? { backgroundColor: `${accentColor}18`, color: accentColor, borderColor: `${accentColor}50` } : {}}
              data-tutorial="milestone-status"
            >
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="skipped">Skipped</option>
            </select>

            <button
              onClick={() => setSelectedMilestone(milestone)}
              className="p-2 rounded-lg transition-colors"
              style={{ color: accentColor }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${accentColor}18`}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              title="Edit details"
              data-tutorial="edit-milestone"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expandable ELO + SCO breakdown */}
        {isChecklistExpanded && (
          <div className="mt-3 ml-8 border-t border-theme pt-3 space-y-4">
            {eloGroups.length > 0 ? (
              /* Structured view: each ELO with its SCOs */
              eloGroups.map((group, gi) => {
                const groupScos = checklist.slice(group.scoRange[0], group.scoRange[1] + 1);
                const groupChecked = groupScos.filter(s => s.checked).length;
                return (
                  <div key={`elo-group-${gi}`} className="space-y-2">
                    {/* ELO header */}
                    <div className="flex items-start space-x-2">
                      <Target className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: accentColor }} />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>
                            ELO {eloGroups.length > 1 ? gi + 1 : ''}
                          </span>
                          <span className="text-xs text-theme-muted">
                            ({groupChecked}/{groupScos.length} SCOs)
                          </span>
                        </div>
                        <p className="text-sm text-theme-label mt-1 bg-theme-tertiary rounded-lg px-3 py-2">
                          {group.elo}
                        </p>
                      </div>
                    </div>
                    {/* SCOs under this ELO */}
                    <div className="space-y-1 ml-6">
                      {groupScos.map((item, si) => {
                        const globalIndex = group.scoRange[0] + si;
                        return (
                          <label
                            key={`sco-${gi}-${si}`}
                            className="flex items-start space-x-2 py-1 px-2 rounded hover:bg-theme-hover cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={item.checked}
                              onChange={() => handleChecklistToggle(milestone, globalIndex)}
                              className="mt-0.5 w-4 h-4 rounded border-gray-300 dark:border-gray-600 cursor-pointer"
                              style={{ accentColor }}
                            />
                            <span className={`text-sm ${item.checked ? 'line-through text-theme-hint' : 'text-theme-label'}`}>
                              {item.key.match(/^\d/) && <span className="font-medium mr-1">{item.key}</span>}
                              {item.text}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              /* Fallback: show ELOs then flat SCO list */
              <>
                {elos.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-4 h-4" style={{ color: accentColor }} />
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>
                        Essential Learning Outcomes
                      </span>
                    </div>
                    <div className="space-y-1 ml-6">
                      {elos.map((elo, i) => (
                        <div key={`elo-${i}`} className="text-sm text-theme-label bg-theme-tertiary rounded-lg px-3 py-2">
                          {elo}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {checklist.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <ListChecks className="w-4 h-4" style={{ color: accentColor }} />
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>
                        Specific Curriculum Outcomes ({checkedCount}/{checklist.length})
                      </span>
                    </div>
                    <div className="space-y-1 ml-6">
                      {checklist.map((item, index) => (
                        <label
                          key={`${item.key}-${index}`}
                          className="flex items-start space-x-2 py-1 px-2 rounded hover:bg-theme-hover cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => handleChecklistToggle(milestone, index)}
                            className="mt-0.5 w-4 h-4 rounded border-gray-300 dark:border-gray-600 cursor-pointer"
                            style={{ accentColor }}
                          />
                          <span className={`text-sm ${item.checked ? 'line-through text-theme-hint' : 'text-theme-label'}`}>
                            {item.key.match(/^\d/) && <span className="font-medium mr-1">{item.key}</span>}
                            {item.text}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderNode = (node: MilestoneTreeNode) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = (node.children && node.children.length > 0) || (node.milestones && node.milestones.length > 0);
    const isHighlighted = highlightedNodeId === node.id;

    return (
      <div key={node.id} className="mb-2" data-node-id={node.id}>
        <div
          className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition-all duration-300 ${
            isHighlighted
              ? 'ring-2 shadow-sm'
              : 'hover:bg-theme-hover'
          }`}
          style={isHighlighted ? { ringColor: accentColor, '--tw-ring-color': accentColor, backgroundColor: `${accentColor}10` } as any : {}}
          onClick={() => hasChildren && toggleNode(node.id)}
          data-tutorial={node.type === 'grade' ? 'grade-node' : node.type === 'subject' ? 'subject-node' : 'strand-node'}
        >
          {hasChildren && (
            isExpanded
              ? <ChevronDown className="w-5 h-5 text-theme-muted" />
              : <ChevronRight className="w-5 h-5 text-theme-muted" />
          )}

          <BookOpen className="w-5 h-5" style={{ color: accentColor }} />

          <span className="font-semibold text-theme-title flex-1">  {node.type === 'grade' ? (node.label === 'K' ? 'Kindergarten' : `Grade ${node.label}`) : node.type === 'strand' ? node.label.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : node.label}</span>

          {node.progress && (
            <div className="flex items-center space-x-2" data-tutorial="node-progress">
              <div className="text-sm text-theme-muted">
                {node.progress.completed}/{node.progress.total}
              </div>
              <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all rounded-full"
                  style={{ width: `${node.progress.percentage}%`, background: `linear-gradient(90deg, ${accentColor}bb, ${accentColor})` }}
                />
              </div>
              <span className="text-sm font-semibold text-theme-label">
                {node.progress.percentage}%
              </span>
            </div>
          )}
        </div>

        {isExpanded && (
          <div className="ml-4 mt-2 space-y-2">
            {node.children?.map(renderNode)}
            {node.milestones?.map(renderMilestone)}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col bg-theme-secondary">
        {/* Header Skeleton */}
        <div className="px-6 py-4" style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)` }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded animate-pulse bg-white/20" />
              <div className="space-y-2">
                <div className="h-7 w-48 rounded animate-pulse bg-white/20" />
                <div className="h-4 w-64 rounded animate-pulse bg-white/15" />
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 space-y-1">
              <div className="h-3 w-24 rounded animate-pulse bg-white/20" />
              <div className="h-7 w-12 rounded animate-pulse bg-white/25" />
            </div>
          </div>
        </div>

        {/* Filters Skeleton */}
        <div className="bg-theme-surface border-b border-theme px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="w-5 h-5 rounded animate-pulse bg-theme-tertiary" />
            <div className="h-9 w-32 rounded-lg animate-pulse bg-theme-tertiary" />
            <div className="h-9 w-32 rounded-lg animate-pulse bg-theme-tertiary" />
            <div className="h-9 w-32 rounded-lg animate-pulse bg-theme-tertiary" />
            <div className="ml-auto flex items-center space-x-2">
              <div className="h-9 w-24 rounded-lg animate-pulse bg-theme-tertiary" />
              <div className="h-9 w-28 rounded-lg animate-pulse bg-theme-tertiary" />
            </div>
          </div>
        </div>

        {/* Main Content Skeleton - Tree + Skill Panel */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Tree View Skeleton */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-5xl mx-auto rounded-xl p-6 widget-glass space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="space-y-2">
                  {/* Grade level row */}
                  <div className="flex items-center space-x-3 p-3 rounded-lg" style={{ backgroundColor: `${accentColor}08` }}>
                    <div className="w-5 h-5 rounded animate-pulse" style={{ backgroundColor: `${accentColor}20` }} />
                    <div className="h-5 rounded animate-pulse" style={{ width: `${140 + i * 20}px`, backgroundColor: `${accentColor}15` }} />
                    <div className="ml-auto flex items-center space-x-2">
                      <div className="h-2 w-24 rounded-full animate-pulse" style={{ backgroundColor: `${accentColor}15` }} />
                      <div className="h-4 w-8 rounded animate-pulse" style={{ backgroundColor: `${accentColor}15` }} />
                    </div>
                  </div>
                  {/* Subject rows */}
                  {i <= 3 && [1, 2].map(j => (
                    <div key={j} className="ml-8 flex items-center space-x-3 p-2.5 rounded-lg">
                      <div className="w-4 h-4 rounded animate-pulse bg-theme-tertiary" />
                      <div className="h-4 rounded animate-pulse bg-theme-tertiary" style={{ width: `${100 + j * 30}px` }} />
                      <div className="ml-auto flex items-center space-x-2">
                        <div className="h-5 w-16 rounded-full animate-pulse bg-theme-tertiary" />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="flex-shrink-0 w-px" style={{ backgroundColor: `${accentColor}30` }} />

          {/* Right Skill Tree Skeleton */}
          <div className="w-80 flex-shrink-0 bg-theme-surface p-6 space-y-4">
            <div className="h-6 w-28 rounded animate-pulse bg-theme-tertiary" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full animate-pulse" style={{ backgroundColor: `${accentColor}15` }} />
                  <div className="flex-1 space-y-1">
                    <div className="h-3.5 rounded animate-pulse bg-theme-tertiary" style={{ width: `${60 + i * 10}%` }} />
                    <div className="h-2.5 w-1/3 rounded animate-pulse bg-theme-tertiary" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-theme-secondary">
      {/* Header */}
      <div className="text-white px-6 py-4" style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)` }} data-tutorial="curriculum-tracker-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Target className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Curriculum Tracker</h1>
              <p className="text-white/80 text-sm">Track your progress through the curriculum</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2" data-tutorial="overall-progress">
              <div className="text-sm text-white/80">Overall Progress</div>
              <div className="text-2xl font-bold">
                {milestones.length > 0
                  ? Math.round((milestones.filter(m => m.status === 'completed').length / milestones.length) * 100)
                  : 0}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-theme-surface border-b border-theme px-6 py-4" data-tutorial="filters-section">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-theme-muted" />

          <select
            value={filters.grade}
            onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
            className="px-3 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:border-transparent bg-theme-surface text-theme-label"
            style={{ '--tw-ring-color': accentColor } as any}
            data-tutorial="grade-filter"
          >
            <option value="">All Grades</option>
            {uniqueGrades.map(grade => (
              <option key={grade} value={grade}>{grade === 'K' ? 'Kindergarten' : `Grade ${grade}`}</option>
            ))}
          </select>

          <select
            value={filters.subject}
            onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
            className="px-3 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:border-transparent bg-theme-surface text-theme-label"
            style={{ '--tw-ring-color': accentColor } as any}
            data-tutorial="subject-filter"
          >
            <option value="">All Subjects</option>
            {uniqueSubjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:border-transparent bg-theme-surface text-theme-label"
            style={{ '--tw-ring-color': accentColor } as any}
            data-tutorial="status-filter"
          >
            <option value="">All Statuses</option>
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="skipped">Skipped</option>
          </select>

          <div className="ml-auto flex items-center space-x-2">
            <button
              onClick={() => setFilters({ grade: '', subject: '', status: '' })}
              className="px-4 py-2 bg-theme-tertiary hover:bg-theme-hover text-theme-label rounded-lg font-medium transition-colors"
              data-tutorial="clear-filters"
            >
              Clear Filters
            </button>
            <button
              onClick={() => setExpandedNodes(new Set())}
              className="px-4 py-2 bg-theme-tertiary hover:bg-theme-hover text-theme-label rounded-lg font-medium transition-colors flex items-center space-x-2"
              title="Collapse All"
              data-tutorial="collapse-all"
            >
              <ChevronUp className="w-4 h-4" />
              <span>Collapse All</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content: Left tree + draggable divider + Right progress tree */}
      <div className="flex-1 flex overflow-hidden" ref={containerRef}>
        {/* Left panel - Tree View */}
        <div className="flex-1 overflow-y-auto p-6" data-tutorial="tree-view">
          <div className="max-w-5xl mx-auto rounded-xl p-6 widget-glass">
            {treeData.length === 0 ? (
              <div className="text-center py-16">
                <AlertCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-theme-muted font-semibold">No milestones found</p>
                <p className="text-theme-hint text-sm mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="space-y-2" data-tutorial="curriculum-tree">
                {treeData.map(renderNode)}
              </div>
            )}
          </div>
        </div>

        {/* Draggable divider */}
        <div
          className="flex-shrink-0 relative z-10 group"
          style={{ width: '6px', cursor: 'col-resize' }}
          onMouseDown={handleDividerMouseDown}
        >
          <div
            className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px transition-all duration-150 group-hover:w-1 group-active:w-1"
            style={{ backgroundColor: `${accentColor}30` }}
          />
          <div
            className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
            style={{ backgroundColor: `${accentColor}10` }}
          />
        </div>

        {/* Right panel - Progress Tree */}
        <div className="flex-shrink-0 overflow-hidden" style={{ width: `${rightPanelRatio * 100}%` }}>
          <CurriculumSkillTree
            treeData={treeData}
            accentColor={accentColor}
            onNavigate={(expandIds, highlightId) => {
              setExpandedNodes(new Set(expandIds));
              // If a strand was clicked, expand all its milestone checklists
              if (highlightId?.startsWith('strand-')) {
                const strandMilestoneIds = new Set<string>();
                for (const grade of treeData) {
                  for (const subject of grade.children || []) {
                    for (const strand of subject.children || []) {
                      if (strand.id === highlightId && strand.milestones) {
                        strand.milestones.forEach(m => strandMilestoneIds.add(m.id));
                      }
                    }
                  }
                }
                if (strandMilestoneIds.size > 0) {
                  setExpandedChecklists(prev => {
                    const next = new Set(prev);
                    strandMilestoneIds.forEach(id => next.add(id));
                    return next;
                  });
                }
              }
              // Set highlight and auto-clear after 2.5s
              if (highlightId) {
                setHighlightedNodeId(highlightId);
                if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
                highlightTimerRef.current = setTimeout(() => setHighlightedNodeId(null), 2500);
                // Scroll the highlighted node into view after DOM updates
                requestAnimationFrame(() => {
                  setTimeout(() => {
                    const el = document.querySelector(`[data-node-id="${highlightId}"]`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }, 50);
                });
              } else {
                setHighlightedNodeId(null);
              }
            }}
            onToggleSco={(milestoneId, checklistIndex) => {
              const milestone = milestones.find(m => m.id === milestoneId);
              if (milestone) {
                handleChecklistToggle(milestone, checklistIndex);
              }
            }}
          />
        </div>
      </div>

      {/* Edit Modal */}
      {selectedMilestone && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMilestone(null)}
          data-tutorial="edit-modal"
        >
          <div
            className="rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 widget-glass"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-theme-title mb-4">
              {selectedMilestone.topic_title}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-theme-label mb-2">
                  Status
                </label>
                <select
                  value={selectedMilestone.status}
                  onChange={(e) => {
                    handleUpdateMilestone(selectedMilestone.id, { status: e.target.value as any });
                  }}
                  className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:border-transparent bg-theme-surface text-theme-label"
                  style={{ '--tw-ring-color': accentColor } as any}
                  data-tutorial="modal-status"
                >
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="skipped">Skipped</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-theme-label mb-2">
                  Notes
                </label>
                <SmartTextArea
                  value={selectedMilestone.notes || ''}
                  onChange={(val) => {
                    setSelectedMilestone({ ...selectedMilestone, notes: val });
                  }}
                  placeholder="Add notes about this milestone..."
                  className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:border-transparent h-32 resize-none bg-theme-surface text-theme-label placeholder:text-theme-hint"
                  style={{ '--tw-ring-color': accentColor } as any}
                  data-tutorial="modal-notes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-theme-label mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={selectedMilestone.due_date || ''}
                  onChange={(e) => {
                    setSelectedMilestone({ ...selectedMilestone, due_date: e.target.value });
                  }}
                  className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:border-transparent bg-theme-surface text-theme-label"
                  style={{ '--tw-ring-color': accentColor } as any}
                  data-tutorial="modal-due-date"
                />
              </div>

              {/* Specific Outcomes Checklist */}
              {selectedMilestone.checklist && selectedMilestone.checklist.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-theme-label mb-2">
                    Specific Outcomes ({selectedMilestone.checklist.filter(c => c.checked).length}/{selectedMilestone.checklist.length})
                  </label>
                  <div className="border border-theme-strong rounded-lg max-h-64 overflow-y-auto">
                    {selectedMilestone.checklist.map((item, index) => (
                      <label
                        key={`${item.key}-${index}`}
                        className="flex items-start space-x-3 px-4 py-2 hover:bg-theme-hover cursor-pointer transition-colors border-b border-theme last:border-b-0"
                      >
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => {
                            const updated = selectedMilestone.checklist.map((c, i) =>
                              i === index ? { ...c, checked: !c.checked } : c
                            );
                            setSelectedMilestone({ ...selectedMilestone, checklist: updated });
                          }}
                          className="mt-0.5 w-4 h-4 rounded border-gray-300 dark:border-gray-600 cursor-pointer"
                          style={{ accentColor }}
                        />
                        <span className={`text-sm ${item.checked ? 'line-through text-theme-hint' : 'text-theme-label'}`}>
                          {item.key.match(/^\d/) && <span className="font-semibold mr-1">{item.key}</span>}
                          {item.text}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    handleUpdateMilestone(selectedMilestone.id, {
                      notes: selectedMilestone.notes,
                      due_date: selectedMilestone.due_date,
                      checklist_json: JSON.stringify(selectedMilestone.checklist || [])
                    });
                  }}
                  className="flex-1 text-white py-3 rounded-lg font-semibold transition-colors"
                  style={{ backgroundColor: accentColor }}
                  data-tutorial="save-changes"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setSelectedMilestone(null)}
                  className="px-6 bg-theme-tertiary hover:bg-theme-hover text-theme-label py-3 rounded-lg font-semibold transition-colors"
                  data-tutorial="cancel-edit"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tutorial Components */}
      <TutorialOverlay
        steps={tutorials[TUTORIAL_IDS.CURRICULUM_TRACKER].steps}
        onComplete={handleTutorialComplete}
        autoStart={showTutorial}
        showFloatingButton={false}
      />
    </div>
  );
};

export default CurriculumTracker;
