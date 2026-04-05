import React from 'react';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react';
import Calendar01Icon from '@hugeicons/core-free-icons/Calendar01Icon';
import Target01Icon from '@hugeicons/core-free-icons/Target01Icon';
import BookOpen01Icon from '@hugeicons/core-free-icons/BookOpen01Icon';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const Calendar = (props: { className?: string }) => <Icon icon={Calendar01Icon} {...props} />;
const Target = (props: { className?: string }) => <Icon icon={Target01Icon} {...props} />;
const BookOpen = (props: { className?: string }) => <Icon icon={BookOpen01Icon} {...props} />;

interface WeeklyOverviewProps {
  weekNumber?: number;
  theme: string;
  learningGoals?: string[];
  keyVocabulary?: string[];
  focusAreas?: string[];
  vocabulary?: string[];
  color?: string;
  children?: React.ReactNode;
}

export const WeeklyOverview: React.FC<WeeklyOverviewProps> = ({
  weekNumber,
  theme,
  learningGoals,
  keyVocabulary,
  focusAreas,
  vocabulary,
  color = "blue",
  children
}) => {
  const { t } = useTranslation();
  return (
    <Card className={`my-6 bg-gradient-to-br from-${color}-50 to-${color}-100 border-2 border-${color}-200`}>
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Calendar className={`h-6 w-6 text-${color}-600`} />
          <CardTitle className="text-2xl">{weekNumber ? `Week ${weekNumber} Overview` : "Weekly Overview"}</CardTitle>
        </div>
        <p className={`text-lg font-semibold text-${color}-700`}>{theme}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(focusAreas || learningGoals) && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className={`h-5 w-5 text-${color}-600`} />
                <h4 className="font-semibold text-gray-800">{t('weeklyOverview.focusAreas')}</h4>
              </div>
              <ul className="list-disc pl-5 space-y-1">
                {(focusAreas || learningGoals)?.map((goal, index) => (
                  <li key={index} className="text-gray-700">{goal}</li>
                ))}
              </ul>
            </div>
          )}

          {(vocabulary || keyVocabulary) && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className={`h-5 w-5 text-${color}-600`} />
                <h4 className="font-semibold text-gray-800">{t('weeklyOverview.keyVocabulary')}</h4>
              </div>
              <ul className="list-disc pl-5 space-y-1">
                {(vocabulary || keyVocabulary)?.map((word, index) => (
                  <li key={index} className="text-gray-700">{word}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {children && (
          <div className={`mt-4 pt-4 border-t border-${color}-200`}>
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
};