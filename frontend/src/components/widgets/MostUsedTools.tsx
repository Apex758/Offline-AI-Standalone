import React from 'react';
import {
  MessageSquare, BookMarked, ListChecks, FileText, GraduationCap,
  Users, School, BookOpen, Target, Library, Zap
} from 'lucide-react';
import type { ToolUsage } from '../../types/analytics';

interface MostUsedToolsProps {
  toolUsage: ToolUsage[];
  onToolClick: (type: string) => void;
}

const iconMap: { [key: string]: any } = {
  MessageSquare,
  BookMarked,
  ListChecks,
  FileText,
  GraduationCap,
  Users,
  School,
  BookOpen,
  Target,
  Library
};

const MostUsedTools: React.FC<MostUsedToolsProps> = ({ toolUsage, onToolClick }) => {
  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName] || BookOpen;
    return Icon;
  };

  const getToolColor = (type: string): string => {
    const colorMap: { [key: string]: string } = {
      'lesson-planner': '#8b5cf6',
      'quiz-generator': '#10b981',
      'rubric-generator': '#f59e0b',
      'kindergarten-planner': '#ec4899',
      'multigrade-planner': '#6366f1',
      'cross-curricular-planner': '#14b8a6',
      'chat': '#3b82f6',
      'curriculum': '#f97316',
      'curriculum-tracker': '#8b5cf6',
      'resource-manager': '#6366f1'
    };
    return colorMap[type] || '#6b7280';
  };

  // Limit to 5 tools
  const limitedToolUsage = toolUsage.slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-yellow-600" />
          <h3 className="font-bold text-gray-900">Most Used Tools</h3>
        </div>
      </div>

      {/* Tool Grid - Horizontal Layout */}
      <div className="p-4">
        {limitedToolUsage.length === 0 ? (
          <div className="text-center py-8">
            <Zap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-600">No tool usage data yet</p>
            <p className="text-xs text-gray-400 mt-1">Start using tools to see stats</p>
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-3">
            {limitedToolUsage.map((tool, index) => {
              const Icon = getIcon(tool.icon);
              const color = getToolColor(tool.type);

              return (
                <button
                  key={tool.type}
                  onClick={() => onToolClick(tool.type)}
                  className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-200"
                  title={tool.name}
                >
                  {/* Icon with color background */}
                  <div
                    className="relative mb-2 p-3 rounded-lg"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color }} />
                    
                    {/* Rank Badge */}
                    <div
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: color }}
                    >
                      {index + 1}
                    </div>
                  </div>

                  {/* Tool Name */}
                  <p className="text-xs font-semibold text-gray-900 text-center line-clamp-2 mb-1">
                    {tool.name}
                  </p>

                  {/* Usage Count */}
                  <div className="px-2 py-0.5 bg-gray-100 rounded-full">
                    <span className="text-xs font-bold text-gray-700">{tool.count}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MostUsedTools;