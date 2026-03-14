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
  limit = 4
}) => {
  const getActivityIcon = (activity: Activity) => {
    switch (activity.type) {
      case 'resource_created':
        switch (activity.resourceType) {
          case 'lesson':
            return { Icon: BookMarked, color: 'var(--dash-primary)' };
          case 'quiz':
            return { Icon: ListChecks, color: 'var(--dash-orange)' };
          case 'rubric':
            return { Icon: FileText, color: 'var(--dash-text-sub)' };
          case 'kindergarten':
            return { Icon: GraduationCap, color: 'var(--dash-primary)' };
          case 'multigrade':
            return { Icon: Users, color: 'var(--dash-text-sub)' };
          case 'cross-curricular':
            return { Icon: School, color: 'var(--dash-orange)' };
          default:
            return { Icon: BookMarked, color: 'var(--dash-primary)' };
        }
      case 'task_completed':
        return { Icon: CheckCircle2, color: 'var(--dash-primary)' };
      case 'milestone_reached':
        return { Icon: Target, color: 'var(--dash-orange)' };
      default:
        return { Icon: Clock, color: 'var(--dash-text-sub)' };
    }
  };

  const getActivityBg = (activity: Activity) => {
    switch (activity.type) {
      case 'resource_created':
        return { bg: 'var(--dash-primary-a12)', border: 'var(--dash-primary-a25)' };
      case 'task_completed':
        return { bg: 'var(--dash-primary-a12)', border: 'var(--dash-primary-a25)' };
      case 'milestone_reached':
        return { bg: 'var(--dash-orange-a12)', border: 'var(--dash-orange-a25)' };
      default:
        return { bg: 'var(--dash-border-a25)', border: 'var(--dash-border)' };
    }
  };

  const displayedActivities = activities.slice(0, limit);

  return (
    <div
      className="widget-glass rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-4" style={{ borderBottom: `1px solid var(--dash-border)` }}>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5" style={{ color: 'var(--dash-text-sub)' }} />
          <h3 className="font-bold" style={{ color: 'var(--dash-text)' }}>Recent Activity</h3>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-4">
        {displayedActivities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--dash-border)' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--dash-text-sub)' }}>No recent activity</p>
            <p className="text-xs mt-1" style={{ color: 'var(--dash-text-faint)' }}>Create resources to see your activity</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedActivities.map((activity, index) => {
              const { Icon, color } = getActivityIcon(activity);
              const { bg, border } = getActivityBg(activity);
              const isLast = index === displayedActivities.length - 1;

              return (
                <div key={activity.id} className="relative">
                  {/* Timeline Line */}
                  {!isLast && (
                    <div
                      className="absolute left-4 top-10 bottom-0 w-0.5"
                      style={{ backgroundColor: 'var(--dash-border)' }}
                    />
                  )}

                  <div className="flex items-start space-x-3">
                    {/* Icon */}
                    <div
                      className="relative z-10 flex-shrink-0 p-2 rounded-lg"
                      style={{
                        backgroundColor: bg,
                        border: `1px solid ${border}`
                      }}
                    >
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-1">
                      <p className="text-sm font-medium line-clamp-2" style={{ color: 'var(--dash-text)' }}>
                        {activity.description}
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--dash-text-sub)' }}>
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
          <button className="w-full text-sm font-medium" style={{ color: 'var(--dash-orange)' }}>
            View all {activities.length} activities
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentActivityTimeline;
