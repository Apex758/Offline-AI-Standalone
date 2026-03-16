import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import Download01IconData from '@hugeicons/core-free-icons/Download01Icon';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const Download: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Download01IconData} {...p} />;

interface PdfExportButtonProps {
  content?: string;
  filename?: string;
  className?: string;
}

// Change from default export to named export
export function PDFExportButton({ content, filename, className }: PdfExportButtonProps) {
  const handleExport = async () => {
    if (!content) return;

    // Convert string to ArrayBuffer
    const encoder = new TextEncoder();
    const arrayBuffer = encoder.encode(content).buffer;

    // Check if running in Electron
    if (window.electronAPI?.downloadFile) {
      // Use Electron's download handler
      await window.electronAPI.downloadFile(arrayBuffer, filename || 'export.txt');
    } else {
      // Fallback for browser (development mode)
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || 'export.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <button
      onClick={handleExport}
      className={`flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${className}`}
    >
      <Download className="w-4 h-4 mr-2" />
      Export
    </button>
  );
}

// Keep default export for flexibility
export default PDFExportButton;