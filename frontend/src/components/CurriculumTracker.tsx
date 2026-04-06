import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react';
import ArrowRight01IconData from '@hugeicons/core-free-icons/ArrowRight01Icon';
import ArrowDown01IconData from '@hugeicons/core-free-icons/ArrowDown01Icon';
import { useAchievementTrigger } from '../contexts/AchievementContext';
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
import HierarchySquare02IconData from '@hugeicons/core-free-icons/HierarchySquare02Icon';
import FlowConnectionIconData from '@hugeicons/core-free-icons/FlowConnectionIcon';
import { TreeBrowserSkeleton } from './ui/TreeBrowserSkeleton';

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
const PrereqIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={HierarchySquare02IconData} {...p} />;
const RelatedIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={FlowConnectionIconData} {...p} />;
import { milestoneApi } from '../lib/milestoneApi';
import type { Milestone, MilestoneTreeNode, ChecklistItem } from '../types/milestone';
import { format, parseISO } from 'date-fns';
import { useSettings } from '../contexts/SettingsContext';
import { getTeacherGrades, getTeacherSubjects, GRADE_VALUE_MAP, GRADE_LABEL_MAP } from '../data/teacherConstants';
import SmartTextArea from './SmartTextArea';

import { TutorialOverlay } from './TutorialOverlay';
import { tutorials, TUTORIAL_IDS } from '../data/tutorialSteps';
import { preloadAllCurriculum, getAllCurriculumFiles, normalizeGrade } from '../data/curriculumLoader';
import CurriculumSkillTree from './CurriculumSkillTree';
import { useRefetchOnActivation } from '../hooks/useRefetchOnActivation';
import { useCurrentPhase } from '../hooks/useCurrentPhase';
import PhaseContextBanner from './PhaseContextBanner';

interface EloGroup {
  elo: string;
  scoRange: [number, number]; // [startIndex, endIndex] inclusive
}

// Lazy-init lookups — built on first access after curriculum data loads
let _lookupsBuilt = false;
const eloGroupsLookup = new Map<string, EloGroup[]>();
const eloLookup = new Map<string, string[]>();
const prereqLookup = new Map<string, string[]>();
const relatedLookup = new Map<string, string[]>();
const pageInfoLookup = new Map<string, { id: string; displayName: string; grade: string; subject: string; strand: string }>();

function ensureLookups() {
  if (_lookupsBuilt) return;
  const files = getAllCurriculumFiles();
  if (files.length === 0) return;
  for (const file of files) {
    const grade = normalizeGrade(file.metadata.grade);
    const subject = file.metadata.subject;
    for (const strand of file.strands) {
      const id = `${grade === 'K' ? 'kindergarten' : `grade${grade}`}-${subject.toLowerCase().replace(/\s+/g, '-')}-${strand.strand_name.toLowerCase().replace(/\s+/g, '-')}`;
      pageInfoLookup.set(id, { id, displayName: strand.strand_name, grade, subject, strand: strand.strand_name });
      // Build ELO groups from strand data
      const eloGroups: EloGroup[] = [];
      const eloTexts: string[] = [];
      let scoIdx = 0;
      for (const elo of strand.essential_learning_outcomes) {
        const scoCount = elo.specific_curriculum_outcomes.length;
        eloGroups.push({
          elo: elo.elo_description,
          scoRange: [scoIdx, scoIdx + scoCount - 1],
        });
        eloTexts.push(elo.elo_description);
        scoIdx += scoCount;
      }
      if (eloGroups.length > 0) eloGroupsLookup.set(id, eloGroups);
      if (eloTexts.length > 0) eloLookup.set(id, eloTexts);
    }
  }
  _lookupsBuilt = true;
}

interface CurriculumTrackerProps {
  tabId: string;
  savedData?: any;
  onDataChange: (data: any) => void;
  isActive?: boolean;
}

const CurriculumTracker: React.FC<CurriculumTrackerProps> = ({
  tabId,
  savedData,
  onDataChange,
  isActive = true
}) => {
  const { t } = useTranslation();
  const [curriculumReady, setCurriculumReady] = useState(false);
  useEffect(() => {
    preloadAllCurriculum().then(() => {
      ensureLookups();
      setCurriculumReady(true);
    });
  }, []);
  const triggerCheck = useAchievementTrigger();
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
    status: '',
    phase: '',  // '' = all, '__unassigned__' = unassigned, or phase_id
  });
  const [expandedChecklists, setExpandedChecklists] = useState<Set<string>>(new Set());
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);
  const highlightTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const [progressView, setProgressView] = useState<'overall' | 'phase'>('overall');

  // Completion warning modal state
  const [completionWarning, setCompletionWarning] = useState<{
    milestoneId: string;
    update: Partial<Milestone>;
    incompleteElos: { eloId: string; elo: string; checked: number; total: number }[];
  } | null>(null);

  // Completion history panel state
  const [historyOpen, setHistoryOpen] = useState(false);
  const [completedHistory, setCompletedHistory] = useState<Array<{ id: string; topic_title: string; grade: string; subject: string; completed_at: string }>>([]);

  const loadCompletedHistory = async () => {
    try {
      const data = await milestoneApi.getCompleted(teacherId);
      setCompletedHistory(data);
    } catch (error) {
      console.error('Failed to load completed milestones:', error);
    }
  };

  const toggleHistoryPanel = () => {
    const opening = !historyOpen;
    setHistoryOpen(opening);
    if (opening) loadCompletedHistory();
  };

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

  // Phase awareness
  const { currentPhase: ctPhase, allPhases: ctAllPhases } = useCurrentPhase(teacherId);

  useEffect(() => {
    loadMilestones();
  }, [filters, progressView, ctPhase?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useRefetchOnActivation(isActive, useCallback(() => { loadMilestones(); }, []));

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
        try {
          await milestoneApi.initialize(teacherId);
        } catch (initError: any) {
          console.error('Failed to initialize milestones:', initError?.response?.data?.detail || initError?.message || JSON.stringify(initError));
        }
        setHasSynced(true);
      }

      // Determine phase filter: explicit dropdown takes priority, then toggle
      const effectivePhaseId = filters.phase
        ? filters.phase
        : (progressView === 'phase' && ctPhase) ? ctPhase.id : undefined;

      // Convert normalized grade (e.g. "2") back to DB format (e.g. "Grade 2") for API query
      const apiGrade = filters.grade ? (GRADE_LABEL_MAP[filters.grade.toLowerCase()] || filters.grade) : undefined;
      const data = await milestoneApi.getMilestones(teacherId, {
        grade: apiGrade,
        subject: filters.subject || undefined,
        status: filters.status || undefined,
        phase_id: effectivePhaseId || undefined,
      });
      setMilestones(data);
    } catch (error: any) {
      console.error('Failed to load milestones:', error?.response?.data?.detail || error?.message || JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  };

  // Filter milestones by profile
  const gradeMapping = settings.profile.gradeSubjects || {};
  const filterOn = settings.profile.filterContentByProfile;
  const filteredMilestones = useMemo(() => {
    if (!filterOn) return milestones;
    const tGrades = getTeacherGrades(gradeMapping);
    const tSubjects = getTeacherSubjects(gradeMapping);
    if (tGrades.length === 0 && tSubjects.length === 0) return milestones;
    return milestones.filter(m => {
      // Normalize milestone grade (e.g. "Grade 1" -> "1", "Kindergarten" -> "k") to match profile keys
      const gradeKey = (GRADE_VALUE_MAP[m.grade] || m.grade).toLowerCase();
      const gradeOk = tGrades.length === 0 || tGrades.includes(gradeKey);
      if (!gradeOk) return false;
      // Kindergarten uses integrated units with subject "Unknown" — include all if grade is selected
      if (gradeKey === 'k') return true;
      // For per-grade filtering: check if this subject is taught for this grade
      const gradeSubjectList = gradeMapping[gradeKey] || [];
      const subjectOk = gradeSubjectList.length === 0 || gradeSubjectList.includes(m.subject);
      return subjectOk;
    });
  }, [milestones, filterOn, gradeMapping]);

  // Build tree structure
  const treeData = useMemo(() => {
    const tree: MilestoneTreeNode[] = [];
    const gradeMap = new Map<string, MilestoneTreeNode>();

    filteredMilestones.forEach(milestone => {
      // Normalize grade label to short form ("Grade 2" -> "2", "Kindergarten" -> "K")
      const gradeLabel = GRADE_VALUE_MAP[milestone.grade]?.toUpperCase() || milestone.grade;

      // Get or create grade node
      if (!gradeMap.has(gradeLabel)) {
        const gradeNode: MilestoneTreeNode = {
          id: `grade-${gradeLabel}`,
          label: gradeLabel,
          type: 'grade',
          children: []
        };
        gradeMap.set(gradeLabel, gradeNode);
        tree.push(gradeNode);
      }

      const gradeNode = gradeMap.get(gradeLabel)!;

      // Get or create subject node
      let subjectNode = gradeNode.children?.find(n => n.label === milestone.subject);
      if (!subjectNode) {
        subjectNode = {
          id: `subject-${gradeLabel}-${milestone.subject}`,
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
            id: `strand-${gradeLabel}-${milestone.subject}-${milestone.strand}`,
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
        const activeMilestones = node.milestones.filter(m => m.status !== 'skipped');
        let total = 0;
        let completed = 0;
        for (const m of activeMilestones) {
          if (m.checklist && m.checklist.length > 0) {
            total += m.checklist.length;
            completed += m.checklist.filter(c => c.checked).length;
          } else {
            // Milestones without a checklist count as 1 SCO
            total += 1;
            completed += m.status === 'completed' ? 1 : 0;
          }
        }
        node.progress = {
          total,
          completed,
          percentage: total > 0 ? Math.round((completed / total) * 10000) / 100 : 0
        };
      } else if (node.children) {
        node.children.forEach(calculateProgress);
        const total = node.children.reduce((sum, child) => sum + (child.progress?.total || 0), 0);
        const completed = node.children.reduce((sum, child) => sum + (child.progress?.completed || 0), 0);
        node.progress = {
          total,
          completed,
          percentage: total > 0 ? Math.round((completed / total) * 10000) / 100 : 0
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
    // Normalize grades to short form ("Grade 2" -> "2", "Kindergarten" -> "K")
    const all = [...new Set(milestones.map(m => GRADE_VALUE_MAP[m.grade]?.toUpperCase() || m.grade))].sort((a, b) => {
      if (a === 'K') return -1;
      if (b === 'K') return 1;
      return Number(a) - Number(b);
    });
    const tGrades = getTeacherGrades(gradeMapping);
    if (filterOn && tGrades.length > 0) {
      return all.filter(g => tGrades.includes(g.toLowerCase()));
    }
    return all;
  }, [milestones, filterOn, gradeMapping]);

  const uniqueSubjects = useMemo(() => {
    const all = [...new Set(milestones.map(m => m.subject))].sort();
    const tSubjects = getTeacherSubjects(gradeMapping);
    if (filterOn && tSubjects.length > 0) {
      return all.filter(s => tSubjects.includes(s));
    }
    return all;
  }, [milestones, filterOn, gradeMapping]);

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

  const navigateToPage = (pageId: string) => {
    const info = pageInfoLookup.get(pageId);
    if (!info) return;
    const gradeId = `grade-${info.grade}`;
    const subjectId = `subject-${info.grade}-${info.subject}`;
    const strandId = `strand-${info.grade}-${info.subject}-${info.strand}`;
    setExpandedNodes(new Set([gradeId, subjectId, strandId]));
    setHighlightedNodeId(strandId);
    // Expand milestone checklists within that strand
    for (const grade of treeData) {
      for (const subject of grade.children || []) {
        for (const strand of subject.children || []) {
          if (strand.id === strandId && strand.milestones) {
            setExpandedChecklists(prev => {
              const next = new Set(prev);
              strand.milestones!.forEach(m => next.add(m.id));
              return next;
            });
          }
        }
      }
    }
    if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    highlightTimerRef.current = setTimeout(() => setHighlightedNodeId(null), 2500);
    requestAnimationFrame(() => {
      setTimeout(() => {
        const el = document.querySelector(`[data-node-id="${strandId}"]`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
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
    // When marking as completed, check for incomplete ELOs first
    if (update.status === 'completed') {
      const milestone = milestones.find(m => m.id === milestoneId);
      if (milestone && milestone.checklist && milestone.checklist.length > 0) {
        const eloGroups = eloGroupsLookup.get(milestone.topic_id) || [];
        const incompleteElos: { eloId: string; elo: string; checked: number; total: number }[] = [];
        eloGroups.forEach(g => {
          if (!g.scoRange) return;
          const scos = milestone.checklist.slice(g.scoRange[0], g.scoRange[1] + 1);
          const checked = scos.filter(s => s.checked).length;
          if (checked < scos.length) {
            incompleteElos.push({
              eloId: (g as any).eloId || '',
              elo: g.elo,
              checked,
              total: scos.length,
            });
          }
        });
        if (incompleteElos.length > 0) {
          // Show the warning modal — don't proceed yet
          setCompletionWarning({ milestoneId, update, incompleteElos });
          return;
        }
      }
    }
    await executeUpdateMilestone(milestoneId, update);
  };

  const executeUpdateMilestone = async (
    milestoneId: string,
    update: Partial<Milestone>
  ) => {
    try {
      // When marking as completed, auto-check all checklist items
      if (update.status === 'completed') {
        const milestone = milestones.find(m => m.id === milestoneId);
        if (milestone && milestone.checklist && milestone.checklist.length > 0) {
          const nowISO = new Date().toISOString();
          const allChecked = milestone.checklist.map(item => ({ ...item, checked: true, checked_at: item.checked_at || nowISO }));
          update = { ...update, checklist: allChecked, checklist_json: JSON.stringify(allChecked) };
        }
      }
      // When marking as not_started, clear all checklist items
      if (update.status === 'not_started') {
        const milestone = milestones.find(m => m.id === milestoneId);
        if (milestone && milestone.checklist && milestone.checklist.length > 0) {
          const allUnchecked = milestone.checklist.map(item => ({ ...item, checked: false, checked_at: null }));
          update = { ...update, checklist: allUnchecked, checklist_json: JSON.stringify(allUnchecked) };
        }
      }
      // Optimistic local update
      updateMilestoneLocally(milestoneId, update as Partial<Milestone>);
      await milestoneApi.updateMilestone(milestoneId, update);
      triggerCheck();
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
    const nowISO = new Date().toISOString();
    const updatedChecklist = milestone.checklist.map((item, i) =>
      i === index ? { ...item, checked: !item.checked, checked_at: !item.checked ? nowISO : null } : item
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

  // Phase tag badge for a milestone
  const getPhaseTag = (milestone: Milestone): React.ReactNode => {
    if (!milestone.phase_id) {
      return (
        <span style={{ fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 4, background: '#f59e0b18', color: '#f59e0b', border: '1px solid #f59e0b30' }}>
          Unassigned
        </span>
      );
    }
    const phase = ctAllPhases.find(p => p.id === milestone.phase_id);
    if (!phase) return null;
    const isCurrent = ctPhase?.id === phase.id;
    if (isCurrent) return null; // current phase = no tag needed

    const today = new Date();
    const phaseEnd = new Date(phase.end_date);
    const phaseStart = new Date(phase.start_date);
    const isPast = phaseEnd < today;
    const isFuture = phaseStart > today;

    if (isPast && milestone.status === 'completed') {
      return (
        <span style={{ fontSize: 10, fontWeight: 500, padding: '1px 6px', borderRadius: 4, background: '#6b728018', color: '#6b7280' }}>
          Previous
        </span>
      );
    }
    if (isPast && milestone.status !== 'completed') {
      return (
        <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 4, background: '#ef444418', color: '#ef4444', border: '1px solid #ef444440' }}>
          Overdue
        </span>
      );
    }
    if (isFuture) {
      return (
        <span style={{ fontSize: 10, fontWeight: 500, padding: '1px 6px', borderRadius: 4, background: '#6b728018', color: '#9ca3af', fontStyle: 'italic' }}>
          Upcoming
        </span>
      );
    }
    return null;
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
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-theme-title">{milestone.topic_title}</h4>
                {getPhaseTag(milestone)}
              </div>
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
              eloGroups.filter(g => g.scoRange).map((group, gi) => {
                const groupScos = checklist.slice(group.scoRange[0], group.scoRange[1] + 1);
                const groupChecked = groupScos.filter(s => s.checked).length;
                return (
                  <div key={`elo-group-${gi}`} className="space-y-2">
                    {/* ELO header */}
                    <div className="flex items-start space-x-2">
                      <Target className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: accentColor }} />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          {(group as any).eloId && (
                            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded" style={{ background: `${accentColor}15`, color: accentColor }}>
                              {(group as any).eloId}
                            </span>
                          )}
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
                              {item.key && !item.key.match(/^\d/) && (
                                <span className="inline-block text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded mr-1" style={{ background: `${accentColor}15`, color: accentColor }}>
                                  {item.key}
                                </span>
                              )}
                              {item.key.match(/^\d/) && <span className="font-medium mr-1">{item.key}</span>}
                              {item.text}
                            </span>
                            {item.checked && item.checked_at && (
                              <span className="ml-2 flex-shrink-0 text-[10px] text-theme-muted bg-theme-surface px-1.5 py-0.5 rounded">
                                {new Date(item.checked_at).toLocaleDateString()}
                              </span>
                            )}
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
                            {item.key && !item.key.match(/^\d/) && (
                              <span className="inline-block text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded mr-1" style={{ background: `${accentColor}15`, color: accentColor }}>
                                {item.key}
                              </span>
                            )}
                            {item.key.match(/^\d/) && <span className="font-medium mr-1">{item.key}</span>}
                            {item.text}
                          </span>
                          {item.checked && item.checked_at && (
                            <span className="ml-2 flex-shrink-0 text-[10px] text-theme-muted bg-theme-surface px-1.5 py-0.5 rounded">
                              {new Date(item.checked_at).toLocaleDateString()}
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Prerequisites */}
            {(() => {
              const prereqIds = prereqLookup.get(milestone.topic_id) || [];
              if (prereqIds.length === 0) return null;
              return (
                <div className="mt-4 pt-3 border-t border-theme">
                  <div className="flex items-center space-x-2 mb-2">
                    <PrereqIcon className="w-4 h-4" style={{ color: accentColor }} />
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>
                      Prerequisites
                    </span>
                  </div>
                  <div className="space-y-1 ml-6">
                    {prereqIds.map(pid => {
                      const info = pageInfoLookup.get(pid);
                      if (!info) return null;
                      const prereqMilestone = milestones.find(m => m.topic_id === pid);
                      const isComplete = prereqMilestone?.status === 'completed';
                      return (
                        <div
                          key={pid}
                          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-theme-hover cursor-pointer transition-colors"
                          onClick={() => navigateToPage(pid)}
                        >
                          {isComplete
                            ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                            : <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          }
                          <div className="flex-1 min-w-0">
                            <span className={`text-sm font-medium ${isComplete ? 'text-theme-hint line-through' : 'text-theme-label'}`}>
                              {info.displayName}
                            </span>
                            <span className="text-xs text-theme-hint ml-2">
                              {info.grade === 'K' ? 'Kindergarten' : `Grade ${info.grade}`}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Related Topics */}
            {(() => {
              const relatedIds = relatedLookup.get(milestone.topic_id) || [];
              if (relatedIds.length === 0) return null;
              return (
                <div className="mt-4 pt-3 border-t border-theme">
                  <div className="flex items-center space-x-2 mb-2">
                    <RelatedIcon className="w-4 h-4" style={{ color: accentColor }} />
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor }}>
                      Related Topics
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 ml-6">
                    {relatedIds.map(rid => {
                      const info = pageInfoLookup.get(rid);
                      if (!info) return null;
                      return (
                        <button
                          key={rid}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-theme hover:border-opacity-80 transition-colors hover:bg-theme-hover"
                          style={{ color: accentColor, borderColor: `${accentColor}40` }}
                          onClick={() => navigateToPage(rid)}
                          title={`${info.displayName} — ${info.grade === 'K' ? 'Kindergarten' : `Grade ${info.grade}`} ${info.subject}`}
                        >
                          {info.displayName}
                          <span className="text-theme-hint text-[10px]">G{info.grade}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
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
            <div className="flex items-center space-x-2 flex-shrink-0" data-tutorial="node-progress">
              <div className="text-sm text-theme-muted min-w-[55px] text-right">
                {node.progress.completed}/{node.progress.total}
              </div>
              <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex-shrink-0">
                <div
                  className="h-full transition-all rounded-full"
                  style={{ width: `${node.progress.percentage}%`, background: `linear-gradient(90deg, ${accentColor}bb, ${accentColor})` }}
                />
              </div>
              <span className="text-sm font-semibold text-theme-label min-w-[48px] text-right">
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
    return <TreeBrowserSkeleton accentColor={accentColor} />;
  }

  return (
    <div className="h-full flex flex-col bg-theme-secondary">
      {/* Header */}
      <div className="text-white px-6 py-4" style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)` }} data-tutorial="curriculum-tracker-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Target className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Progress Tracker</h1>
              <p className="text-white/80 text-sm">Track your progress through the curriculum</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={toggleHistoryPanel}
              className={`p-2.5 rounded-lg transition-colors ${historyOpen ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20'}`}
              title="Completion History"
            >
              <Clock className="w-5 h-5" />
            </button>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2" data-tutorial="overall-progress">
              <div className="text-sm text-white/80">
                {progressView === 'phase' ? 'Phase Progress' : 'Overall Progress'}
              </div>
              <div className="text-2xl font-bold">
                {(() => {
                  // Until phase assignment is built, both views show same data
                  const active = filteredMilestones.filter(m => m.status !== 'skipped');
                  let total = 0, done = 0;
                  for (const m of active) {
                    if (m.checklist && m.checklist.length > 0) {
                      total += m.checklist.length;
                      done += m.checklist.filter(c => c.checked).length;
                    } else {
                      total += 1;
                      done += m.status === 'completed' ? 1 : 0;
                    }
                  }
                  return total > 0 ? Math.round((done / total) * 10000) / 100 : 0;
                })()}%
              </div>
              {progressView === 'phase' && (
                <div className="text-xs text-white/60 mt-0.5">
                  {ctPhase ? ctPhase.phase_label : 'No active phase'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-theme-surface border-b border-theme px-6 py-4" data-tutorial="filters-section">
        <div className="flex items-center space-x-4">
          {/* Overall / Phase toggle */}
          <div
            style={{
              display: 'inline-flex',
              borderRadius: 8,
              border: '1px solid var(--border-color, #e5e7eb)',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            {(['overall', 'phase'] as const).map(mode => {
              const active = progressView === mode;
              return (
                <button
                  key={mode}
                  onClick={() => setProgressView(mode)}
                  style={{
                    padding: '6px 14px',
                    fontSize: 13,
                    fontWeight: active ? 600 : 400,
                    background: active ? accentColor : 'transparent',
                    color: active ? '#fff' : 'var(--text-secondary, #6b7280)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {mode === 'overall' ? 'Overall' : 'Phase'}
                </button>
              );
            })}
          </div>

          <div className="w-px h-6" style={{ backgroundColor: 'var(--border-color, #e5e7eb)' }} />

          <Filter className="w-5 h-5 text-theme-muted" />

          <select
            value={filters.grade}
            onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
            className="px-3 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:border-transparent bg-theme-surface text-theme-label"
            style={{ '--tw-ring-color': accentColor } as any}
            data-tutorial="grade-filter"
          >
            <option value="">{t('curriculum.allGrades')}</option>
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
            <option value="">{t('curriculum.allSubjects')}</option>
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
            <option value="">{t('curriculum.allStatuses')}</option>
            <option value="not_started">{t('curriculum.notStarted')}</option>
            <option value="in_progress">{t('curriculum.inProgress')}</option>
            <option value="completed">{t('curriculum.completed')}</option>
            <option value="skipped">Skipped</option>
          </select>

          {/* Phase filter dropdown */}
          {ctAllPhases.length > 0 && (
            <select
              value={filters.phase}
              onChange={(e) => setFilters({ ...filters, phase: e.target.value })}
              className="px-3 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:border-transparent bg-theme-surface text-theme-label"
              style={{ '--tw-ring-color': accentColor } as any}
            >
              <option value="">{t('curriculum.allPhases')}</option>
              {ctAllPhases.map(p => (
                <option key={p.id} value={p.id}>{p.phase_label}</option>
              ))}
              <option value="__unassigned__">Unassigned</option>
            </select>
          )}

          <div className="ml-auto flex items-center space-x-2">
            <button
              onClick={() => setFilters({ grade: '', subject: '', status: '', phase: '' })}
              className="px-4 py-2 bg-theme-tertiary hover:bg-theme-hover text-theme-label rounded-lg font-medium transition-colors"
              data-tutorial="clear-filters"
            >
              Clear Filters
            </button>
            <button
              onClick={() => setExpandedNodes(new Set())}
              className="px-4 py-2 bg-theme-tertiary hover:bg-theme-hover text-theme-label rounded-lg font-medium transition-colors flex items-center space-x-2"
              title={t('curriculum.collapseAll')}
              data-tutorial="collapse-all"
            >
              <ChevronUp className="w-4 h-4" />
              <span>{t('curriculum.collapseAll')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Unassigned ELO warning */}
      {ctAllPhases.length > 0 && milestones.some(m => !m.phase_id) && filters.phase === '' && progressView === 'overall' && (
        <div
          className="px-6 py-2 border-b border-theme"
          style={{ background: '#f59e0b0a', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <AlertCircle className="w-4 h-4" style={{ color: '#f59e0b' }} />
          <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 600 }}>
            {milestones.filter(m => !m.phase_id).length} ELO{milestones.filter(m => !m.phase_id).length !== 1 ? 's' : ''} not assigned to any phase
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            — assign them in Curriculum Plan
          </span>
        </div>
      )}

      {/* Phase context banner */}
      {progressView === 'phase' && ctPhase && (
        <PhaseContextBanner phase={ctPhase} onClear={() => setProgressView('overall')} />
      )}
      {progressView === 'phase' && !ctPhase && (
        <div className="px-6 py-2 border-b border-theme text-sm" style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
          No active phase. Set up your school year to use phase filtering.
        </div>
      )}
      {filters.phase && filters.phase !== '__unassigned__' && progressView !== 'phase' && (() => {
        const fp = ctAllPhases.find(p => p.id === filters.phase);
        if (!fp) return null;
        // Build a minimal CurrentPhaseInfo-compatible object
        const PHASE_C: Record<string, string> = { midterm_1: '#f97316', midterm_2: '#f97316', midterm_1_prep: '#fbbf24', midterm_2_prep: '#fbbf24', inter_semester_break: '#eab308', end_of_year_exam: '#ef4444' };
        const SEM_C: Record<string, string> = { 'Semester 1': '#3b82f6', 'Semester 2': '#22c55e' };
        const c = PHASE_C[fp.phase_key] || (fp.semester ? SEM_C[fp.semester] || '#6b7280' : '#6b7280');
        return <PhaseContextBanner phase={{ id: fp.id, phase_key: fp.phase_key, phase_label: fp.phase_label, semester: fp.semester, start_date: fp.start_date, end_date: fp.end_date, days_remaining: 0, color: c }} onClear={() => setFilters(f => ({ ...f, phase: '' }))} />;
      })()}

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
                            const nowISO = new Date().toISOString();
                            const updated = selectedMilestone.checklist.map((c, i) =>
                              i === index ? { ...c, checked: !c.checked, checked_at: !c.checked ? nowISO : null } : c
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
                        {item.checked && item.checked_at && (
                          <span className="ml-2 flex-shrink-0 text-[10px] text-theme-muted bg-theme-surface px-1.5 py-0.5 rounded">
                            {new Date(item.checked_at).toLocaleDateString()}
                          </span>
                        )}
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

      {/* Completion warning modal */}
      {completionWarning && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backdropFilter: 'blur(6px)', backgroundColor: 'rgba(0,0,0,0.4)' }}
          onClick={() => setCompletionWarning(null)}
        >
          <div
            className="bg-theme-surface border border-theme rounded-xl shadow-2xl p-6 max-w-md w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-4">
              <IconW icon={AlertCircleIconData} className="w-5 h-5" style={{ color: '#f59e0b' }} />
              <h3 className="text-lg font-bold text-theme-title">Incomplete ELOs</h3>
            </div>
            <p className="text-sm text-theme-label mb-3">
              The following ELOs have SCOs that haven't been confirmed yet:
            </p>
            <div className="space-y-2 mb-5 max-h-60 overflow-y-auto">
              {completionWarning.incompleteElos.map((elo, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-theme text-sm"
                  style={{ backgroundColor: `${accentColor}08` }}
                >
                  {elo.eloId && (
                    <span
                      className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0"
                      style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                    >
                      {elo.eloId}
                    </span>
                  )}
                  <span className="text-theme-label flex-1 text-xs line-clamp-2">{elo.elo}</span>
                  <span className="text-xs font-semibold shrink-0" style={{ color: '#f59e0b' }}>
                    {elo.checked}/{elo.total}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                className="flex-1 px-4 py-2 rounded-lg border border-theme text-sm font-medium text-theme-label hover:bg-theme-hover transition-colors"
                onClick={() => setCompletionWarning(null)}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 rounded-lg text-sm font-bold text-white transition-colors"
                style={{ backgroundColor: accentColor }}
                onClick={() => {
                  const { milestoneId, update } = completionWarning;
                  setCompletionWarning(null);
                  executeUpdateMilestone(milestoneId, update);
                }}
              >
                Complete Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Completion History Panel */}
      <div
        className={`fixed top-0 right-0 h-full z-40 border-l border-theme bg-theme-secondary transition-all duration-300 overflow-hidden ${
          historyOpen ? 'w-80' : 'w-0'
        }`}
      >
        {historyOpen && (
          <div className="h-full flex flex-col p-4 w-80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-theme-title flex items-center gap-2">
                <Clock className="w-5 h-5" style={{ color: accentColor }} />
                Completion History
              </h3>
              <button
                onClick={() => setHistoryOpen(false)}
                className="p-1 rounded hover:bg-theme-hover transition-colors"
              >
                <XCircle className="w-5 h-5 text-theme-muted" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1">
              {completedHistory.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-theme-muted text-sm">No completed milestones yet</p>
                </div>
              ) : (
                (() => {
                  const grouped: Record<string, typeof completedHistory> = {};
                  for (const m of completedHistory) {
                    const dateKey = new Date(m.completed_at).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'long', day: 'numeric'
                    });
                    if (!grouped[dateKey]) grouped[dateKey] = [];
                    grouped[dateKey].push(m);
                  }
                  return Object.entries(grouped).map(([date, items]) => (
                    <div key={date} className="mb-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-theme-muted px-2 py-1.5 sticky top-0 bg-theme-secondary">
                        {date}
                      </div>
                      <div className="space-y-1">
                        {items.map((m) => (
                          <div
                            key={m.id}
                            className="px-3 py-2 rounded-lg bg-theme-tertiary hover:bg-theme-hover transition-colors"
                          >
                            <p className="text-sm font-medium text-theme-label line-clamp-2">{m.topic_title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                                style={{ background: `${accentColor}15`, color: accentColor }}
                              >
                                {m.grade}
                              </span>
                              <span className="text-[10px] text-theme-muted">{m.subject}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ));
                })()
              )}
            </div>
          </div>
        )}
      </div>

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
