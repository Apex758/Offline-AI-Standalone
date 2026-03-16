import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { BulbIcon } from '@hugeicons/core-free-icons/BulbIcon';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const Lightbulb = (props: { className?: string }) => <Icon icon={BulbIcon} {...props} />;

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