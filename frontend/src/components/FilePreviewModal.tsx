import React, { useState, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import Cancel01IconData from '@hugeicons/core-free-icons/Cancel01Icon';
import File01IconData from '@hugeicons/core-free-icons/File01Icon';
import axios from 'axios';

const IconW: React.FC<{ icon: any; className?: string }> = ({ icon, className = '' }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} />;
};

const fileAPI = {
  isElectron: !!(window as any).electronAPI,
  async readFileContent(filePath: string): Promise<{ base64?: string; error?: string }> {
    const api = (window as any).electronAPI;
    if (api?.readFileContent) return api.readFileContent(filePath);
    const res = await axios.get('http://localhost:8000/api/file-explorer/read-file', { params: { filePath } });
    return res.data;
  },
  async previewByPath(filePath: string): Promise<any> {
    const api = (window as any).electronAPI;
    if (api?.previewByPath) return api.previewByPath(filePath);
    const res = await axios.get('http://localhost:8000/api/file-explorer/preview-by-path', { params: { filePath } });
    return res.data;
  },
};

const IMAGE_EXT = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];

function getFileTypeColor(ext: string): string {
  const e = ext.toLowerCase();
  if (['.docx', '.doc'].includes(e)) return 'text-blue-500';
  if (['.pptx', '.ppt'].includes(e)) return 'text-orange-500';
  if (['.xlsx', '.xls', '.csv'].includes(e)) return 'text-green-500';
  if (e === '.pdf') return 'text-red-500';
  if (IMAGE_EXT.includes(e)) return 'text-purple-500';
  return 'text-gray-500';
}

function getFileTypeLabel(ext: string): string {
  const e = ext.toLowerCase();
  if (['.docx', '.doc'].includes(e)) return 'Word';
  if (['.pptx', '.ppt'].includes(e)) return 'PowerPoint';
  if (['.xlsx', '.xls'].includes(e)) return 'Excel';
  if (e === '.csv') return 'CSV';
  if (e === '.pdf') return 'PDF';
  if (e === '.txt') return 'Text';
  if (e === '.md') return 'Markdown';
  if (IMAGE_EXT.includes(e)) return 'Image';
  return ext.replace('.', '').toUpperCase();
}

interface FilePreviewModalProps {
  filePath: string;
  fileName: string;
  extension: string;
  onClose: () => void;
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({ filePath, fileName, extension, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<any>(null);
  const [base64Data, setBase64Data] = useState<string | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [pdfFallbackText, setPdfFallbackText] = useState<string | null>(null);

  const ext = extension.toLowerCase();
  const isImage = IMAGE_EXT.includes(ext);
  const isPDF = ext === '.pdf';

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      setPreviewData(null);
      setBase64Data(null);
      try {
        if (isImage) {
          const data = await fileAPI.readFileContent(filePath);
          if (cancelled) return;
          if (data.error) setError(data.error);
          else setBase64Data(data.base64 || null);
        } else if (isPDF) {
          // Use blob URL for PDFs (no data URI size limits)
          const data = await fileAPI.readFileContent(filePath);
          if (cancelled) return;
          if (data.error) {
            setError(data.error);
          } else if (data.base64) {
            const byteChars = atob(data.base64);
            const byteArray = new Uint8Array(byteChars.length);
            for (let i = 0; i < byteChars.length; i++) byteArray[i] = byteChars.charCodeAt(i);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            setPdfBlobUrl(URL.createObjectURL(blob));
            // Also fetch parsed text as fallback
            try {
              const parsed = await fileAPI.previewByPath(filePath);
              if (!cancelled && parsed?.pages) setPdfFallbackText(parsed.pages.join('\n\n--- Page Break ---\n\n'));
            } catch { /* fallback is optional */ }
          }
        } else {
          const data = await fileAPI.previewByPath(filePath);
          if (cancelled) return;
          if (data.error) setError(data.error);
          else setPreviewData(data);
        }
      } catch (e: any) {
        if (cancelled) return;
        const msg = e?.response?.data?.error || e?.message || 'Failed to load preview';
        setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
      // Clean up blob URL on unmount or re-fetch
      setPdfBlobUrl(prev => { if (prev) URL.revokeObjectURL(prev); return null; });
    };
  }, [filePath, isImage, isPDF]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const getMimeType = () => {
    const e = ext.replace('.', '');
    if (e === 'jpg') return 'jpeg';
    return e;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <span className="block w-8 h-8 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    if (error) {
      const isOldFormat = ext === '.doc' || ext === '.ppt' || ext === '.xls';
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center px-6">
          <p className="text-sm text-red-500">{isOldFormat ? `Cannot preview old ${ext} format` : error}</p>
          {isOldFormat && <p className="text-xs text-theme-hint mt-2">Try converting to {ext}x format for preview support</p>}
        </div>
      );
    }

    if (isImage && base64Data) {
      return (
        <div className="flex items-center justify-center p-4">
          <img
            src={`data:image/${getMimeType()};base64,${base64Data}`}
            alt={fileName}
            className="max-w-full max-h-[70vh] object-contain rounded"
          />
        </div>
      );
    }

    if (isPDF && pdfBlobUrl) {
      return (
        <div className="flex flex-col h-[75vh]">
          <iframe
            src={pdfBlobUrl}
            className="w-full flex-1 rounded"
            title={fileName}
          />
          {pdfFallbackText && (
            <details className="mt-2 px-4 pb-2">
              <summary className="text-xs text-theme-hint cursor-pointer hover:text-theme-muted">PDF not rendering? Click to view as text</summary>
              <pre className="whitespace-pre-wrap text-sm text-theme-body leading-relaxed mt-2 max-h-[50vh] overflow-y-auto">{pdfFallbackText}</pre>
            </details>
          )}
        </div>
      );
    }

    if (previewData) {
      // Word documents with paragraphs
      if (previewData.paragraphs && previewData.paragraphs.length > 0) {
        return (
          <div className="p-5 space-y-3">
            {previewData.metadata?.title && (
              <h2 className="text-lg font-bold text-theme-heading mb-4">{previewData.metadata.title}</h2>
            )}
            {previewData.paragraphs.map((para: string, i: number) => (
              <p key={i} className="text-sm text-theme-body leading-relaxed">{para}</p>
            ))}
          </div>
        );
      }

      // PDF parsed text fallback (when blob URL not available)
      if (previewData.pages && previewData.pages.length > 0) {
        return (
          <div className="p-5 space-y-6">
            {previewData.metadata?.page_count && (
              <p className="text-xs text-theme-hint">{previewData.metadata.page_count} pages</p>
            )}
            {previewData.pages.map((page: string, i: number) => (
              <div key={i}>
                <p className="text-[10px] text-theme-hint mb-1">Page {i + 1}</p>
                <pre className="whitespace-pre-wrap text-sm text-theme-body leading-relaxed">{page}</pre>
                {i < previewData.pages.length - 1 && <hr className="border-gray-200 dark:border-gray-700 mt-4" />}
              </div>
            ))}
          </div>
        );
      }

      // PowerPoint slides
      if (previewData.slides) {
        return (
          <div className="p-4 space-y-4">
            {previewData.metadata && (
              <p className="text-xs text-theme-hint mb-2">{previewData.metadata.slide_count || previewData.slides.length} slides</p>
            )}
            {previewData.slides.map((slide: any, i: number) => (
              <div key={i} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <p className="text-[10px] text-theme-hint mb-1">Slide {i + 1}</p>
                {slide.title && <p className="font-semibold text-sm text-theme-heading">{slide.title}</p>}
                {slide.bullets && slide.bullets.length > 0 && (
                  <ul className="list-disc ml-4 mt-2 space-y-1">
                    {slide.bullets.map((b: string, j: number) => (
                      <li key={j} className="text-sm text-theme-body">{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        );
      }

      // Spreadsheet sheets
      if (previewData.sheets) {
        return (
          <div className="p-4 space-y-6">
            {previewData.sheets.map((sheet: any, i: number) => (
              <div key={i}>
                {previewData.sheets.length > 1 && (
                  <p className="text-xs font-medium text-theme-heading mb-2">{sheet.name || `Sheet ${i + 1}`}</p>
                )}
                <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                  <table className="text-sm border-collapse w-full">
                    {sheet.headers && (
                      <thead>
                        <tr>
                          {sheet.headers.map((h: string, j: number) => (
                            <th key={j} className="border-b border-gray-200 dark:border-gray-700 px-3 py-2 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-theme-heading sticky top-0">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                    )}
                    <tbody>
                      {(sheet.rows || []).slice(0, 100).map((row: string[], ri: number) => (
                        <tr key={ri} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          {row.map((cell: string, ci: number) => (
                            <td key={ci} className="border-b border-gray-100 dark:border-gray-800 px-3 py-1.5 text-xs text-theme-body">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {(sheet.rows || []).length > 100 && (
                  <p className="text-xs text-theme-hint mt-1">Showing first 100 of {sheet.rows.length} rows</p>
                )}
              </div>
            ))}
          </div>
        );
      }

      // Text content (Word, TXT, MD, etc.)
      const text = previewData.text || previewData.content || JSON.stringify(previewData, null, 2);
      return (
        <div className="p-4">
          <pre className="whitespace-pre-wrap text-sm text-theme-body font-mono leading-relaxed">{text}</pre>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-64 text-theme-hint">
        <p className="text-sm">No preview available</p>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-[90vw] max-w-4xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <IconW icon={File01IconData} className={`w-4.5 h-4.5 flex-shrink-0 ${getFileTypeColor(extension)}`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-theme-heading truncate">{fileName}</p>
            <p className="text-[11px] text-theme-hint">{getFileTypeLabel(extension)}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition flex-shrink-0"
            title="Close preview"
          >
            <IconW icon={Cancel01IconData} className="w-4 h-4 text-theme-muted" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
