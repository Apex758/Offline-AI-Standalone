import React from 'react';
import { Clock, Users, BookOpen } from 'lucide-react';

interface Activity {
  time: string;
  title: string;
  description: string;
  materials?: string[];
}

interface DailyPlanProps {
  day?: string;
  theme?: string;
  activities?: Activity[];
  morningActivity?: string;
  literacyFocus?: string;
  mathFocus?: string;
  afternoonActivity?: string;
  materials?: string[];
  assessmentNotes?: string;
  color?: string;
  className?: string;
}

// Add named export
export function DailyPlan({
  day = 'Monday',
  theme = 'Learning Activities',
  activities = [],
  morningActivity,
  literacyFocus,
  mathFocus,
  afternoonActivity,
  materials,
  assessmentNotes,
  color = "blue",
  className = ''
}: DailyPlanProps) {
  const hasStructuredProps =
    morningActivity || literacyFocus || mathFocus || afternoonActivity;

  const selectedColor = color ?? "blue";

  return (
    <div className={`bg-white rounded-lg shadow-md border border-${selectedColor}-200 p-6 ${className}`}>
      <div className="mb-6">
        <h2 className={`text-2xl font-bold text-${selectedColor}-700 mb-2`}>{day}</h2>
        <p className={`text-${selectedColor}-600 flex items-center`}>
          <BookOpen className="w-4 h-4 mr-2" />
          {theme}
        </p>
      </div>

      {!hasStructuredProps ? (
        <div className="space-y-4">
          {activities && activities.length > 0 ? (
            activities.map((activity, index) => (
              <div
                key={index}
                className={`border-l-4 border-${selectedColor}-500 pl-4 py-2 hover:bg-gray-50 transition-colors`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-semibold text-gray-600">{activity.time}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {activity.title}
                    </h3>
                    <p className="text-gray-600 mb-2">{activity.description}</p>
                    
                    {activity.materials && activity.materials.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700 mb-1">Materials:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {activity.materials.map((material, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className={`text-${selectedColor}-500 mr-2`}>•</span>
                              <span>{material}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No activities scheduled</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-gray-700">
          {morningActivity && (
            <p className="mb-2"><strong>Morning Activity:</strong> {morningActivity}</p>
          )}
          {literacyFocus && (
            <p className="mb-2"><strong>Literacy Focus:</strong> {literacyFocus}</p>
          )}
          {mathFocus && (
            <p className="mb-2"><strong>Math Focus:</strong> {mathFocus}</p>
          )}
          {afternoonActivity && (
            <p className="mb-2"><strong>Afternoon Activity:</strong> {afternoonActivity}</p>
          )}
          {materials && materials.length > 0 && (
            <div className="mt-3">
              <p className="font-medium">Materials:</p>
              <ul className="list-disc pl-6">
                {materials.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {assessmentNotes && (
            <p className="mt-3"><strong>Assessment Notes:</strong> {assessmentNotes}</p>
          )}
        </div>
      )}
    </div>
  );
}

// Keep default export
export default DailyPlan;