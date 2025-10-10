import React from 'react';
import { Lightbulb } from 'lucide-react';

interface TeachingTipProps {
  children: React.ReactNode;
  title?: string;
}

export const TeachingTip: React.FC<TeachingTipProps> = ({ children, title = "Teaching Tip" }) => {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 my-4 rounded-r-lg">
      <div className="flex items-start">
        <Lightbulb className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-amber-900 mb-2">{title}</h4>
          <div className="text-amber-800 text-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};