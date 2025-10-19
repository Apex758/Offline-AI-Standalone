import React from 'react';
import { Lightbulb } from 'lucide-react';

interface TeacherTipProps {
  title?: string;
  tip?: string;
  color?: "pink" | "orange" | "amber" | "yellow" | "green" | "blue" | "purple";
  children?: React.ReactNode;
}

export const TeacherTip: React.FC<TeacherTipProps> = ({
  title = "Teacher Tip",
  tip,
  color = "yellow",
  children,
}) => {
  // Map color prop to Tailwind colors
  const colorMap: Record<string, { bg: string; border: string; text: string }> = {
    pink: { bg: "bg-pink-50", border: "border-pink-400", text: "text-pink-800" },
    orange: { bg: "bg-orange-50", border: "border-orange-400", text: "text-orange-800" },
    amber: { bg: "bg-amber-50", border: "border-amber-400", text: "text-amber-800" },
    yellow: { bg: "bg-yellow-50", border: "border-yellow-400", text: "text-yellow-800" },
    green: { bg: "bg-green-50", border: "border-green-400", text: "text-green-800" },
    blue: { bg: "bg-blue-50", border: "border-blue-400", text: "text-blue-800" },
    purple: { bg: "bg-purple-50", border: "border-purple-400", text: "text-purple-800" },
  };

  const { bg, border, text } = colorMap[color] || colorMap.yellow;

  return (
    <div className={`${bg} border-l-4 ${border} p-4 rounded-r-lg my-4`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Lightbulb className={`h-5 w-5 ${text.replace("text-", "text-")}`} />
        </div>
        <div className="ml-3">
          <h3 className={`text-sm font-medium ${text}`}>{title}</h3>
          <div className={`mt-2 text-sm ${text.replace("800", "700")}`}>
            {tip || children}
          </div>
        </div>
      </div>
    </div>
  );
};