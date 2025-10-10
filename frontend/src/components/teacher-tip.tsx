import React from 'react';
import { Lightbulb } from 'lucide-react';

interface TeacherTipProps {
  children: React.ReactNode;
  title?: string;
}

export const TeacherTip: React.FC<TeacherTipProps> = ({ children, title = "Teacher Tip" }) => {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg my-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <Lightbulb className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">{title}</h3>
          <div className="mt-2 text-sm text-yellow-700">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};