import React from 'react';
import { Clock, BookMarked, CheckCircle2, Target, FileText, ListChecks, GraduationCap, Users, School } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import type { Activity } from '../../types/analytics';

interface RecentActivityTimelineProps {
  activities: Activity[];
  limit?: number;
}

const RecentActivityTimeline: React.FC<RecentActivityTimelineProps> = ({
  activities,
  limit = 7
}) => {
  const getActivityIcon = (activity: Activity) => {
    switch (activity.type) {
      case 'resource_created':
        switch (activity.resourceType) {
          case 'lesson':
            return { Icon: BookMarked, color: '#8b5cf6' };
          case 'quiz':
            return { Icon: ListChecks, color: '#10b981' };
          case 'rubric':
            return { Icon: FileText, color: '#f59e0b' };
          case 'kindergarten':
            return { Icon: GraduationCap, color: '#ec4899' };
          case 'multigrade':
            return { Icon: Users, color: '#6366f1' };
          case 'cross-curricular':
            return { Icon: School, color: '#14b8a6' };
          default:
            return { Icon: BookMarked, color: '#8b5cf6' };
        }
      case 'task_completed':
        return { Icon: CheckCircle2, color: '#10b981' };
      case 'milestone_reached':
        return { Icon: Target, color: '#3b82f6' };
      default:
        return { Icon: Clock, color: '#6b7280' };
    }
  };

  const getActivityColor = (activity: Activity) => {
    switch (activity.type) {
      case 'resource_created':
        return 'bg-purple-50 border-purple-200';
      case 'task_completed':
        return 'bg-green-50 border-green-200';
      case 'milestone_reached':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const displayedActivities = activities.slice(0, limit);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gray-600" />
          <h3 className="font-bold text-gray-900">Recent Activity</h3>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-4">
        {displayedActivities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-600">No recent activity</p>
            <p className="text-xs text-gray-400 mt-1">Create resources to see your activity</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedActivities.map((activity, index) => {
              const { Icon, color } = getActivityIcon(activity);
              const bgColor = getActivityColor(activity);
              const isLast = index === displayedActivities.length - 1;

              return (
                <div key={activity.id} className="relative">
                  {/* Timeline Line */}
                  {!isLast && (
                    <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-200" />
                  )}

                  <div className="flex items-start space-x-3">
                    {/* Icon */}
                    <div
                      className={`relative z-10 flex-shrink-0 p-2 rounded-lg border ${bgColor}`}
                    >
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-1">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(parseISO(activity.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* View All Link */}
      {activities.length > limit && (
        <div className="px-4 pb-4">
          <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all {activities.length} activities
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentActivityTimeline;