// components/ExportButton.tsx - UPDATED VERSION
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react';
import Download01IconData from '@hugeicons/core-free-icons/Download01Icon';
import Loading02IconData from '@hugeicons/core-free-icons/Loading02Icon';
import File01IconData from '@hugeicons/core-free-icons/File01Icon';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const Download: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Download01IconData} {...p} />;
const Loader2: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Loading02IconData} {...p} />;
const FileText: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={File01IconData} {...p} />;
const FileDown: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Download01IconData} {...p} />;
import { HeartbeatLoader } from './ui/HeartbeatLoader';
import axios from 'axios';
import { generateQuizHTML, prepareQuizForExport } from '../utils/quizHtmlRenderer';
import { prepareWorksheetForExport } from '../utils/worksheetHtmlRenderer';
import { prepareLessonForExport } from '../utils/lessonHtmlRenderer';
import { prepareOhpcLessonForExport } from '../utils/ohpcLessonHtmlRenderer';
import { prepareRubricForExport } from '../utils/rubricHtmlRenderer';
import { prepareMultigradeForExport } from '../utils/multigradeHtmlRenderer';
import { prepareKindergartenForExport } from '../utils/kindergartenHtmlRenderer';
import { prepareCrossCurricularForExport } from '../utils/crossCurricularHtmlRenderer';
import { generateScanTemplate } from '../utils/scanTemplateRenderer';

interface ExportButtonProps {
  dataType: 'quiz' | 'plan' | 'rubric' | 'kindergarten' | 'multigrade' | 'cross-curricular' | 'worksheet';
  data: {
    content: string;
    formData: any;
    accentColor: string;
    parsedQuiz?: any;
    parsedWorksheet?: any;
    parsedPlan?: any;
    parsedKindergartenPlan?: any;
    curriculumReferences?: any;
    generatedImages?: string[];
    exportOptions?: {
      showAnswerKey?: boolean;
      showExplanations?: boolean;
      boldCorrectAnswers?: boolean;
    };
    studentInfo?: { name: string; id: string };
    quizId?: string;
    worksheetId?: string;
    scanMode?: boolean;
  };
  filename?: string;
  className?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  dataType,
  data,
  filename = 'export',
  className = ''
}) => {
  const { t } = useTranslation();
  const [isExporting, setIsExporting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleExport = async (format: 'pdf' | 'docx') => {
    setIsExporting(true);
    setShowMenu(false);

    try {
      // Generate QR code if student info is available
      let qrCodeBase64: string | undefined;
      if (data.studentInfo?.id) {
        const docId = data.quizId || data.worksheetId || '';
        const docType = dataType === 'worksheet' ? 'worksheet' : 'quiz';
        if (docId) {
          try {
            const qrRes = await axios.post('http://localhost:8000/api/generate-qr', {
              doc_type: docType,
              doc_id: docId,
              student_id: data.studentInfo.id
            });
            qrCodeBase64 = qrRes.data.qr_base64;
          } catch (e) {
            console.warn('QR generation failed, falling back to text ID:', e);
          }
        }
      }

      let exportData;
      let title;

      if (data.scanMode && (dataType === 'quiz' || dataType === 'worksheet')) {
        const questions = dataType === 'quiz' ? data.parsedQuiz?.questions : data.parsedWorksheet?.questions;
        if (questions) {
          const scanResult = generateScanTemplate(
            questions,
            {
              title: data.formData?.subject
                ? `${data.formData.subject} ${dataType === 'quiz' ? 'Quiz' : 'Worksheet'}`
                : dataType === 'quiz' ? 'Quiz' : 'Worksheet',
              subject: data.formData?.subject || '',
              gradeLevel: data.formData?.gradeLevel || '',
              docId: data.quizId || data.worksheetId || ''
            },
            qrCodeBase64
          );
          exportData = { rawHtml: scanResult.html };
        }
        title = data.formData?.subject
          ? `${data.formData.subject} - Grade ${data.formData.gradeLevel}`
          : dataType === 'quiz' ? 'Quiz' : 'Worksheet';
      } else if (dataType === 'worksheet') {
        // Handle worksheet export
        exportData = prepareWorksheetForExport(
          data.content,
          data.parsedWorksheet,
          data.formData,
          data.accentColor,
          data.generatedImages || [],
          data.worksheetId,
          undefined,
          qrCodeBase64
        );
        title = data.formData.subject
          ? `${data.formData.subject} - Grade ${data.formData.gradeLevel}`
          : 'Worksheet';
      } else if (dataType === 'plan') {
        // Handle lesson plan export.
        // New path: structured OHPC lesson plan (Phase 3) -- use the OHPC
        // renderer when a structured lesson object is provided.
        // Legacy path: markdown content -- fall back to the old renderer.
        if (data.ohpcLesson) {
          exportData = prepareOhpcLessonForExport(
            data.ohpcLesson,
            data.reflections,
            data.formData,
            data.accentColor,
            data.curriculumReferences
          );
        } else {
          exportData = prepareLessonForExport(
            data.content,
            data.formData,
            data.accentColor,
            data.curriculumReferences
          );
        }
        title = data.formData.topic
          ? `${data.formData.topic} - Grade ${data.formData.gradeLevel}`
          : 'Lesson Plan';
      } else if (dataType === 'rubric') {  // ✅ ADD THIS
        exportData = prepareRubricForExport(
          data.content,
          data.formData,
          data.accentColor
        );
        title = data.formData.assignmentTitle || 'Assessment Rubric';
      } else if (dataType === 'multigrade') {  // ✅ ADD THIS
        exportData = prepareMultigradeForExport(
          data.content,
          data.formData,
          data.accentColor
        );
        title = data.formData.topic || 'Multigrade Lesson Plan';
      } else if (dataType === 'kindergarten') {  // ✅ ADD THIS
        exportData = prepareKindergartenForExport(
          data.content,
          data.formData,
          data.accentColor,
          data.parsedKindergartenPlan
        );
        title = data.formData.lessonTopic || 'Kindergarten Plan';
      } else if (dataType === 'cross-curricular') {  // ✅ ADD THIS
        exportData = prepareCrossCurricularForExport(
          data.content,
          data.formData,
          data.accentColor,
          data.parsedPlan
        );
        title = data.formData.lessonTitle || 'Cross-Curricular Plan';
      } else {
        // Handle quiz export (existing code)
        exportData = prepareQuizForExport(
          data.content,
          data.formData,
          data.accentColor,
          {
            ...(data.exportOptions || {
              showAnswerKey: true,
              showExplanations: true,
              boldCorrectAnswers: false
            }),
            qrCodeBase64
          },
          data.studentInfo,
          data.quizId
        );
        title = data.formData.subject
          ? `${data.formData.subject} - Grade ${data.formData.gradeLevel}`
          : 'Quiz';
      }
      // Send to backend with rawHtml for perfect rendering
      const response = await axios.post(
        'http://localhost:8000/api/export',
        {
          data_type: dataType,
          format: format,
          data: exportData,  // This includes rawHtml, content, formData, accentColor
          title: title
        },
        {
          responseType: 'blob'
        }
      );

      // Download the file
      const blob = new Blob([response.data], {
        type: format === 'pdf'
          ? 'application/pdf'
          : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isExporting}
        className={`flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 ${className}`}
      >
        {isExporting ? (
          <>
            <HeartbeatLoader className="w-4 h-4 mr-2" />
            Exporting...
          </>
        ) : (
          <>
            <Download className="w-4 h-4 mr-2" />
            Export
          </>
        )}
      </button>

      {showMenu && !isExporting && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-48 rounded-lg z-20 overflow-hidden export-dropdown-glass">
            <div className="py-1">
              <button
                onClick={() => handleExport('pdf')}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center transition"
              >
                <FileText className="w-4 h-4 mr-3 text-red-600" />
                <span className="text-sm text-gray-700">{t('export.exportPdf')}</span>
              </button>
              <button
                onClick={() => handleExport('docx')}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center transition"
              >
                <FileDown className="w-4 h-4 mr-3 text-blue-600" />
                <span className="text-sm text-gray-700">{t('export.exportWord')}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExportButton;