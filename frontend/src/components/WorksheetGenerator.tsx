import React from 'react';
import { FileText } from 'lucide-react';

interface WorksheetGeneratorProps {
  tabId?: string;
  savedData?: Record<string, unknown>;
  onDataChange?: (data: Record<string, unknown>) => void;
}

const WorksheetGenerator: React.FC<WorksheetGeneratorProps> = () => {
  return (
    <div className="h-full bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Worksheet Generator</h3>
        <p className="text-gray-500">Coming soon...</p>
      </div>
    </div>
  );
};

export default WorksheetGenerator;