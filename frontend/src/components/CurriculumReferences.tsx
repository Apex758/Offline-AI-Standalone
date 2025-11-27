import React from "react";
import { BookOpen, ExternalLink } from "lucide-react";

export interface CurriculumReference {
  id: string;
  route: string;
  displayName: string;
  matchScore?: number;
}

interface CurriculumReferencesProps {
  references: CurriculumReference[];
  heading?: string;
  description?: string;
  className?: string;
}

const defaultHeading = "Curriculum References";
const defaultDescription =
  "These curriculum activities and pages are relevant to this lesson. Click a link to view the full curriculum resource.";

export const CurriculumReferences: React.FC<CurriculumReferencesProps> = ({
  references,
  heading = defaultHeading,
  description = defaultDescription,
  className = "",
}) => {
  if (!references || references.length === 0) return null;

  return (
    <section
      className={`mt-10 mb-6 p-6 rounded-xl border border-blue-200 bg-blue-50/60 shadow-sm ${className}`}
      aria-labelledby="curriculum-references-heading"
      tabIndex={-1}
    >
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="w-6 h-6 text-blue-600" aria-hidden="true" />
        <h2
          id="curriculum-references-heading"
          className="text-lg font-bold text-blue-800"
        >
          {heading}
        </h2>
      </div>
      <p className="text-sm text-blue-700 mb-4">{description}</p>
      <ul className="space-y-2" aria-label="Curriculum Reference List">
        {references.map((ref) => (
          <li key={ref.id}>
            <a
              href={ref.route}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-blue-100 focus:bg-blue-100 border border-blue-100 transition-colors outline-none focus:ring-2 focus:ring-blue-400"
              aria-label={`Open curriculum page: ${ref.displayName}`}
            >
              <BookOpen className="w-5 h-5 text-blue-500 flex-shrink-0" aria-hidden="true" />
              <span className="flex-1 text-blue-900 font-medium group-hover:underline">
                {ref.displayName}
              </span>
              {typeof ref.matchScore === "number" && (
                <span
                  className="ml-2 text-xs text-blue-700 bg-blue-100 rounded-full px-2 py-0.5"
                  title="Match Score"
                  aria-label={`Match score: ${Math.round(ref.matchScore * 100)}%`}
                >
                  {Math.round(ref.matchScore * 100)}%
                </span>
              )}
              <ExternalLink className="w-4 h-4 text-blue-400 group-hover:text-blue-600" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CurriculumReferences;