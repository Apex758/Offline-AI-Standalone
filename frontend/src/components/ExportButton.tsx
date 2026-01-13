// components/ExportButton.tsx - UPDATED VERSION
import React, { useState } from 'react';
import { Download, Loader2, FileText, FileDown } from 'lucide-react';
import axios from 'axios';
import { generateQuizHTML, prepareQuizForExport } from '../utils/quizHtmlRenderer';
import { prepareWorksheetForExport } from '../utils/worksheetHtmlRenderer';
import { prepareLessonForExport } from '../utils/lessonHtmlRenderer';
import { prepareRubricForExport } from '../utils/rubricHtmlRenderer';

interface ExportButtonProps {
  dataType: 'quiz' | 'plan' | 'rubric' | 'kindergarten' | 'multigrade' | 'cross-curricular';
  data: {
    content: string;
    formData: any;
    accentColor: string;
    parsedQuiz?: any;
    curriculumReferences?: any;
    exportOptions?: {  // ADD THIS
      showAnswerKey?: boolean;
      showExplanations?: boolean;
      boldCorrectAnswers?: boolean;
    };
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
  const [isExporting, setIsExporting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleExport = async (format: 'pdf' | 'docx') => {
    setIsExporting(true);
    setShowMenu(false);

    try {
      let exportData;
      let title;
      
      if (dataType === 'worksheet') {
        // Handle worksheet export
        exportData = prepareWorksheetForExport(
          data.content,
          data.parsedWorksheet,
          data.formData,
          data.accentColor
        );
        title = data.formData.subject
          ? `${data.formData.subject} - Grade ${data.formData.gradeLevel}`
          : 'Worksheet';
      } else if (dataType === 'plan') {
        // Handle lesson plan export
        exportData = prepareLessonForExport(
          data.content,
          data.formData,
          data.accentColor,
          data.curriculumReferences // ✅ ADD THIS
        );
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
      } else {
        // Handle quiz export (existing code)
        exportData = prepareQuizForExport(
          data.content,
          data.formData,
          data.accentColor,
          data.exportOptions || {  // ADD THIS
            showAnswerKey: true,
            showExplanations: true,
            boldCorrectAnswers: false
          }
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
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-20 overflow-hidden">
            <div className="py-1">
              <button
                onClick={() => handleExport('pdf')}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center transition"
              >
                <FileText className="w-4 h-4 mr-3 text-red-600" />
                <span className="text-sm text-gray-700">Export as PDF</span>
              </button>
              <button
                onClick={() => handleExport('docx')}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center transition"
              >
                <FileDown className="w-4 h-4 mr-3 text-blue-600" />
                <span className="text-sm text-gray-700">Export as Word</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExportButton;