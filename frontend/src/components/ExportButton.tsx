import React, { useState } from "react";
import { Download } from "lucide-react";
import axios from "axios";

type ExportFormat = "pdf" | "docx" | "csv" | "json" | "md";

interface ExportButtonProps {
  dataType: "plan" | "quiz" | "rubric" | string;
  data: any;
  filename?: string;
  className?: string;
}

const FORMAT_LABELS: Record<ExportFormat, string> = {
  pdf: "PDF",
  docx: "Word (DOCX)",
  csv: "CSV",
  json: "JSON",
  md: "Markdown",
};

const getSupportedFormats = (dataType: string): ExportFormat[] => {
  if (["plan", "quiz", "rubric"].includes(dataType)) {
    return ["pdf", "docx"];
  }
  return ["pdf", "docx", "csv", "json", "md"];
};

const getMimeType = (format: ExportFormat) => {
  switch (format) {
    case "pdf":
      return "application/pdf";
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "csv":
      return "text/csv";
    case "json":
      return "application/json";
    case "md":
      return "text/markdown";
    default:
      return "application/octet-stream";
  }
};

export const ExportButton: React.FC<ExportButtonProps> = ({
  dataType,
  data,
  filename = "export",
  className = "",
}) => {
  const [format, setFormat] = useState<ExportFormat>(getSupportedFormats(dataType)[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supportedFormats = getSupportedFormats(dataType);

  const handleExport = async () => {
    setError(null);
    setLoading(true);
    try {
      if (!supportedFormats.includes(format)) {
        setError("This format is not supported for this data type.");
        setLoading(false);
        return;
      }
      // Humanize filename for title (replace dashes/underscores with spaces, capitalize)
      const humanTitle =
        filename && filename.trim()
          ? filename
              .replace(/[-_]+/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase())
          : "Lesson Plan Export";

      const response = await axios.post(
        "/api/export",
        {
          data_type: dataType,
          format,
          data,
          title: humanTitle,
        },
        {
          responseType: "blob",
        }
      );
      const blob = new Blob([response.data], { type: getMimeType(format) });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      if (err.response && err.response.data) {
        // Try to read error message from backend
        const reader = new FileReader();
        reader.onload = () => {
          setError(reader.result as string || "Export failed due to backend error.");
        };
        reader.readAsText(err.response.data);
      } else {
        setError("Export failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div className="flex gap-2">
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value as ExportFormat)}
          className="rounded-l-lg border border-gray-300 px-2 py-2 text-sm focus:outline-none"
          disabled={loading}
        >
          {supportedFormats.map((fmt) => (
            <option key={fmt} value={fmt}>
              {FORMAT_LABELS[fmt]}
            </option>
          ))}
        </select>
        <button
          onClick={handleExport}
          disabled={loading}
          className={`flex items-center px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition disabled:bg-gray-400`}
        >
          <Download className="w-4 h-4 mr-2" />
          {loading ? "Exporting..." : "Export"}
        </button>
      </div>
      {error && (
        <div className="absolute left-0 mt-2 w-max bg-red-100 text-red-700 px-3 py-2 rounded shadow z-10 text-xs">
          {error}
        </div>
      )}
    </div>
  );
};

export default ExportButton;