import React from 'react';
import {
  MessageSquare, BookMarked, ListChecks, FileText, GraduationCap,
  Users, School, BookOpen, Target, Library, Sparkles
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

  const getToolColor = (index: number): { bg: string; color: string; shadow: string } => {
    const colors = [
      { bg: '#1D362D20', color: '#1D362D', shadow: 'rgba(29, 54, 45, 0.15)' },
      { bg: '#F2A63120', color: '#F2A631', shadow: 'rgba(242, 166, 49, 0.15)' },
      { bg: '#552A0120', color: '#552A01', shadow: 'rgba(85, 42, 1, 0.15)' },
      { bg: '#1D362D20', color: '#1D362D', shadow: 'rgba(29, 54, 45, 0.15)' },
      { bg: '#F8E59D40', color: '#552A01', shadow: 'rgba(248, 229, 157, 0.15)' }
    ];
    return colors[index % colors.length];
  };

  // Limit to 5 tools
  const limitedToolUsage = toolUsage.slice(0, 5);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      data-tutorial="analytics-most-used-tools"
      style={{
        backgroundColor: 'white',
        boxShadow: '0 4px 16px rgba(29, 54, 45, 0.08)'
      }}
    >
      {/* Header */}
      <div 
        className="p-4"
        style={{ borderBottom: '1px solid #E8EAE3' }}
      >
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5" style={{ color: '#F2A631' }} />
          <h3 className="font-bold" style={{ color: '#020D03' }}>Most Used Tools</h3>
        </div>
      </div>

      {/* Tool Grid - Bento Box Layout */}
      <div className="p-4">
        {limitedToolUsage.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 mx-auto mb-3" style={{ color: '#E8EAE3' }} />
            <p className="text-sm font-medium" style={{ color: '#552A01' }}>No tool usage data yet</p>
            <p className="text-xs mt-1" style={{ color: '#A8AFA3' }}>Start using tools to see stats</p>
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-3" data-tutorial="analytics-tools-grid">
            {limitedToolUsage.map((tool, index) => {
              const Icon = getIcon(tool.icon);
              const { bg, color, shadow } = getToolColor(index);

              return (
                <button
                  key={tool.type}
                  onClick={() => onToolClick(tool.type)}
                  className="flex flex-col items-center p-3 rounded-xl transition-all hover:scale-105 group"
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #E8EAE3',
                    boxShadow: `0 2px 8px ${shadow}`
                  }}
                  title={tool.name}
                >
                  {/* Icon with color background */}
                  <div
                    className="relative mb-2 p-3 rounded-lg transition-all group-hover:scale-110"
                    style={{ backgroundColor: bg }}
                  >
                    <Icon className="w-6 h-6" style={{ color }} />
                    
                    {/* Rank Badge */}
                    <div
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ 
                        backgroundColor: color,
                        color: 'white',
                        boxShadow: `0 2px 4px ${shadow}`
                      }}
                    >
                      {index + 1}
                    </div>
                  </div>

                  {/* Tool Name */}
                  <p 
                    className="text-xs font-semibold text-center line-clamp-2"
                    style={{ color: '#020D03' }}
                  >
                    {tool.name}
                  </p>
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