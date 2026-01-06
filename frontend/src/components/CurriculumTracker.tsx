import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronRight, ChevronDown, Circle, CheckCircle2, PlayCircle, XCircle,
  Calendar, Edit2, Eye, Filter, RotateCcw, BookOpen, TrendingUp,
  Target, Clock, AlertCircle
} from 'lucide-react';
import { milestoneApi } from '../lib/milestoneApi';
import type { Milestone, MilestoneTreeNode } from '../types/milestone';
import { format, parseISO } from 'date-fns';

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
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [filters, setFilters] = useState({
    grade: '',
    subject: '',
    status: ''
  });

  const teacherId = localStorage.getItem('user') 
    ? JSON.parse(localStorage.getItem('user')!).username 
    : 'default_teacher';

  useEffect(() => {
    loadMilestones();
  }, [filters]);

  const loadMilestones = async () => {
    setLoading(true);
    try {
      // Try to get milestones
      const data = await milestoneApi.getMilestones(teacherId, {
        grade: filters.grade || undefined,
        subject: filters.subject || undefined,
        status: filters.status || undefined
      });

      if (data.length === 0 && !filters.grade && !filters.subject && !filters.status) {
        // No milestones exist, initialize
        await milestoneApi.initialize(teacherId);
        const initialized = await milestoneApi.getMilestones(teacherId);
        setMilestones(initialized);
      } else {
        setMilestones(data);
      }
    } catch (error) {
      console.error('Failed to load milestones:', error);
    } finally {
      setLoading(false);
    }
  };

  // Build tree structure
  const treeData = useMemo(() => {
    const tree: MilestoneTreeNode[] = [];
    const gradeMap = new Map<string, MilestoneTreeNode>();

    milestones.forEach(milestone => {
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
    return tree;
  }, [milestones]);

  // Get unique values for filters
  const uniqueGrades = useMemo(() => 
    [...new Set(milestones.map(m => m.grade))].sort(),
    [milestones]
  );

  const uniqueSubjects = useMemo(() =>
    [...new Set(milestones.map(m => m.subject))].sort(),
    [milestones]
  );

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

  const handleUpdateMilestone = async (
    milestoneId: string,
    update: Partial<Milestone>
  ) => {
    try {
      await milestoneApi.updateMilestone(milestoneId, update);
      await loadMilestones();
      if (selectedMilestone?.id === milestoneId) {
        setSelectedMilestone(null);
      }
    } catch (error) {
      console.error('Failed to update milestone:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in_progress': return <PlayCircle className="w-5 h-5 text-blue-600" />;
      case 'skipped': return <XCircle className="w-5 h-5 text-gray-400" />;
      default: return <Circle className="w-5 h-5 text-gray-300" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-300';
      case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'skipped': return 'bg-gray-100 text-gray-600 border-gray-300';
      default: return 'bg-gray-50 text-gray-500 border-gray-200';
    }
  };

  const renderMilestone = (milestone: Milestone) => (
    <div
      key={milestone.id}
      className={`ml-8 p-3 rounded-lg border-2 transition-all ${
        selectedMilestone?.id === milestone.id
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-blue-300 bg-white'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          {getStatusIcon(milestone.status)}
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">{milestone.topic_title}</h4>
            {milestone.notes && (
              <p className="text-sm text-gray-600 mt-1">{milestone.notes}</p>
            )}
            {milestone.due_date && (
              <div className="flex items-center space-x-1 mt-1 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>Due: {format(parseISO(milestone.due_date), 'MMM d, yyyy')}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={milestone.status}
            onChange={(e) => handleUpdateMilestone(milestone.id, { status: e.target.value })}
            className={`px-3 py-1 rounded-lg border-2 font-medium text-sm ${getStatusColor(milestone.status)}`}
          >
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="skipped">Skipped</option>
          </select>
          
          <button
            onClick={() => setSelectedMilestone(milestone)}
            className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
            title="Edit details"
          >
            <Edit2 className="w-4 h-4 text-blue-600" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderNode = (node: MilestoneTreeNode) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = (node.children && node.children.length > 0) || (node.milestones && node.milestones.length > 0);

    return (
      <div key={node.id} className="mb-2">
        <div
          className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          onClick={() => hasChildren && toggleNode(node.id)}
        >
          {hasChildren && (
            isExpanded ? <ChevronDown className="w-5 h-5 text-gray-600" /> : <ChevronRight className="w-5 h-5 text-gray-600" />
          )}
          
          <BookOpen className="w-5 h-5 text-indigo-600" />
          
          <span className="font-semibold text-gray-900 flex-1">  {node.type === 'grade' ? `Grade ${node.label}` : node.label}</span>
          
          {node.progress && (
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-600">
                {node.progress.completed}/{node.progress.total}
              </div>
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all"
                  style={{ width: `${node.progress.percentage}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700">
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
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading curriculum tracker...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Target className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Curriculum Tracker</h1>
              <p className="text-indigo-100 text-sm">Track your progress through the curriculum</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <div className="text-sm text-indigo-100">Overall Progress</div>
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
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-600" />
          
          <select
            value={filters.grade}
            onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Grades</option>
            {uniqueGrades.map(grade => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>

          <select
            value={filters.subject}
            onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Subjects</option>
            {uniqueSubjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="skipped">Skipped</option>
          </select>

          <button
            onClick={() => setFilters({ grade: '', subject: '', status: '' })}
            className="ml-auto px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Tree View */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {treeData.length === 0 ? (
            <div className="text-center py-16">
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-semibold">No milestones found</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="space-y-2">
              {treeData.map(renderNode)}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {selectedMilestone && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMilestone(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {selectedMilestone.topic_title}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={selectedMilestone.status}
                  onChange={(e) => {
                    handleUpdateMilestone(selectedMilestone.id, { status: e.target.value });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="skipped">Skipped</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={selectedMilestone.notes || ''}
                  onChange={(e) => {
                    setSelectedMilestone({ ...selectedMilestone, notes: e.target.value });
                  }}
                  placeholder="Add notes about this milestone..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={selectedMilestone.due_date || ''}
                  onChange={(e) => {
                    setSelectedMilestone({ ...selectedMilestone, due_date: e.target.value });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    handleUpdateMilestone(selectedMilestone.id, {
                      notes: selectedMilestone.notes,
                      due_date: selectedMilestone.due_date
                    });
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setSelectedMilestone(null)}
                  className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurriculumTracker;