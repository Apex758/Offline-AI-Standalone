// components/ScanTemplatePreview.tsx
// WYSIWYG iframe preview of the scan template — what you see is what prints.
import React, { useMemo } from 'react';
import { generateScanTemplate } from '../utils/scanTemplateRenderer';

interface ScanTemplatePreviewProps {
  questions: Array<any>;
  docMeta: {
    title: string;
    subject: string;
    gradeLevel: string;
    docId: string;
  };
  qrCodeBase64?: string;
}

const ScanTemplatePreview: React.FC<ScanTemplatePreviewProps> = ({
  questions,
  docMeta,
  qrCodeBase64,
}) => {
  const { html, pageCount } = useMemo(
    () => generateScanTemplate(questions, docMeta, qrCodeBase64),
    [questions, docMeta, qrCodeBase64]
  );

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      padding: '16px',
      background: '#f3f4f6',
      borderRadius: '8px',
    }}>
      <div style={{
        overflow: 'auto',
        maxHeight: '70vh',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
      }}>
        <iframe
          srcDoc={html}
          title="Scan Template Preview"
          style={{
            width: '595px',
            minHeight: `${Math.min(pageCount * 842, 1684)}px`,
            border: 'none',
            background: 'white',
            display: 'block',
            transform: 'scale(0.85)',
            transformOrigin: 'top center',
          }}
          sandbox="allow-same-origin"
        />
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '12px',
        color: '#6b7280',
      }}>
        <span>{pageCount} page{pageCount !== 1 ? 's' : ''}</span>
        <span style={{ color: '#d1d5db' }}>|</span>
        <span>{questions.length} questions</span>
        <span style={{ color: '#d1d5db' }}>|</span>
        <span>A4 scan-ready layout</span>
      </div>
    </div>
  );
};

export default ScanTemplatePreview;
