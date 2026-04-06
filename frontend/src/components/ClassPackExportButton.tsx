// components/ClassPackExportButton.tsx - Bulk download for class mode
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react';
import Download01IconData from '@hugeicons/core-free-icons/Download01Icon';
import File01IconData from '@hugeicons/core-free-icons/File01Icon';
import { HeartbeatLoader } from './ui/HeartbeatLoader';
import axios from 'axios';
import { prepareQuizForExport } from '../utils/quizHtmlRenderer';
import { prepareWorksheetForExport } from '../utils/worksheetHtmlRenderer';
import { quizToDisplayText, ParsedQuiz } from '../types/quiz';
import type { ParsedWorksheet } from '../types/worksheet';
import type { StudentWorksheetVersion } from '../types/worksheet';
import { addBubblesToHtml } from '../utils/bubblePostProcessor';
import { generateAnswerRegions } from '../utils/answerRegionGenerator';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const Download: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Download01IconData} {...p} />;
const FileText: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={File01IconData} {...p} />;
const FileDown: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Download01IconData} {...p} />;

// --- Quiz class pack types ---
interface QuizClassPackProps {
  dataType: 'quiz';
  docId: string;
  formData: any;
  accentColor: string;
  parsedQuiz: ParsedQuiz;
  classQuizData: Array<{ id: string; name: string; questionOrder: number[] }>;
  className?: string;
}

// --- Worksheet class pack types ---
interface WorksheetClassPackProps {
  dataType: 'worksheet';
  docId: string;
  formData: any;
  accentColor: string;
  parsedWorksheet: ParsedWorksheet;
  generatedWorksheet: string;
  studentVersions: StudentWorksheetVersion[];
  generatedImages?: string[];
  className?: string;
}

type ClassPackExportButtonProps = QuizClassPackProps | WorksheetClassPackProps;

const ClassPackExportButton: React.FC<ClassPackExportButtonProps> = (props) => {
  const { t } = useTranslation();
  const [isExporting, setIsExporting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [progress, setProgress] = useState('');

  const handleExport = async (format: 'pdf' | 'docx') => {
    setIsExporting(true);
    setShowMenu(false);

    try {
      let studentVersionsPayload: Array<{
        student_id: string;
        name: string;
        question_order: number[];
        class_name?: string;
        option_maps?: any;
        shuffled_column_b?: any;
        shuffled_word_bank?: any;
      }> = [];
      const rawHtmlPerStudent: Record<string, string> = {};

      if (props.dataType === 'quiz') {
        const { parsedQuiz, classQuizData, formData, accentColor, docId } = props;

        setProgress(`Preparing ${classQuizData.length} student versions...`);

        for (const student of classQuizData) {
          // Reorder questions for this student
          const studentQuiz: ParsedQuiz = {
            ...parsedQuiz,
            questions: student.questionOrder.map(i => parsedQuiz.questions[i])
          };

          // Generate HTML for this student's version (student copy - no answers)
          const exportData = prepareQuizForExport(
            quizToDisplayText(studentQuiz),
            formData,
            accentColor,
            {
              showAnswerKey: false,
              showExplanations: false,
              boldCorrectAnswers: false,
              scanMode: true
            },
            { name: student.name, id: student.id },
            docId
          );

          // Post-process HTML to add scannable bubbles
          const bubbleResult = addBubblesToHtml(exportData.rawHtml);
          rawHtmlPerStudent[student.id] = bubbleResult.html;

          // Save bubble regions from first student (all have same layout)
          if (studentVersionsPayload.length === 0 && bubbleResult.regions.length > 0) {
            const template = generateAnswerRegions(
              bubbleResult.regions,
              parsedQuiz.questions.map(q => ({ type: q.type, question: q.question })),
              docId,
              'quiz'
            );
            // Save answer region template to backend
            axios.post('http://localhost:8000/api/save-answer-regions', template).catch(e =>
              console.warn('Failed to save answer regions:', e)
            );
          }
          studentVersionsPayload.push({
            student_id: student.id,
            name: student.name,
            question_order: student.questionOrder
          });
        }
      } else {
        // Worksheet
        const { parsedWorksheet, studentVersions, formData, accentColor, docId, generatedWorksheet, generatedImages } = props;

        setProgress(`Preparing ${studentVersions.length} student versions...`);

        for (const version of studentVersions) {
          // Build per-student ParsedWorksheet with their shuffled questions
          const studentParsedWorksheet: ParsedWorksheet = {
            ...parsedWorksheet,
            questions: version.questions
          };

          // Generate HTML for this student's version
          const exportData = prepareWorksheetForExport(
            generatedWorksheet,
            studentParsedWorksheet,
            { ...formData, viewMode: 'student' },
            accentColor,
            generatedImages,
            docId,
            true // scanMode
          );

          // Post-process HTML to add scannable bubbles
          const bubbleResult = addBubblesToHtml(exportData.rawHtml);
          rawHtmlPerStudent[version.student.id] = bubbleResult.html;

          // Save bubble regions from first student (all have same layout)
          if (studentVersionsPayload.length === 0 && bubbleResult.regions.length > 0) {
            const template = generateAnswerRegions(
              bubbleResult.regions,
              parsedWorksheet.questions.map(q => ({ type: q.type, question: q.question })),
              docId,
              'worksheet'
            );
            axios.post('http://localhost:8000/api/save-answer-regions', template).catch(e =>
              console.warn('Failed to save answer regions:', e)
            );
          }

          // Build question_order from index mapping
          const questionOrder = version.questions.map((q, i) => {
            const origIdx = parsedWorksheet.questions.findIndex(
              orig => orig.question === q.question
            );
            return origIdx >= 0 ? origIdx : i;
          });

          studentVersionsPayload.push({
            student_id: version.student.id,
            name: version.student.full_name,
            question_order: questionOrder,
            class_name: version.student.class_name,
            option_maps: version.optionMaps,
            shuffled_column_b: version.shuffledColumnB,
            shuffled_word_bank: version.shuffledWordBank
          });
        }
      }

      setProgress('Generating class pack...');

      // Call the backend class pack endpoint
      const response = await axios.post(
        'http://localhost:8000/api/export-class-pack',
        {
          doc_type: props.dataType,
          doc_id: props.docId,
          student_versions: studentVersionsPayload,
          format: format,
          raw_html_per_student: rawHtmlPerStudent
        },
        {
          responseType: 'blob',
          timeout: 120000 // 2 min for large classes
        }
      );

      // Download the ZIP
      const blob = new Blob([response.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `class_pack_${props.docId}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Class pack export failed:', error);
      alert('Class pack export failed. Please try again.');
    } finally {
      setIsExporting(false);
      setProgress('');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isExporting}
        className={`flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 ${props.className || ''}`}
      >
        {isExporting ? (
          <>
            <HeartbeatLoader className="w-4 h-4 mr-2" />
            {progress || 'Exporting...'}
          </>
        ) : (
          <>
            <Download className="w-4 h-4 mr-2" />
            Bulk Download
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
                <span className="text-sm text-gray-700">PDF (ZIP)</span>
              </button>
              <button
                onClick={() => handleExport('docx')}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center transition"
              >
                <FileDown className="w-4 h-4 mr-3 text-blue-600" />
                <span className="text-sm text-gray-700">Word (ZIP)</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ClassPackExportButton;
