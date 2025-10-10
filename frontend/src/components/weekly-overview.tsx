import React from 'react';
import { Calendar, Target, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface WeeklyOverviewProps {
  weekNumber: number;
  theme: string;
  learningGoals?: string[];
  keyVocabulary?: string[];
  children?: React.ReactNode;
}

export const WeeklyOverview: React.FC<WeeklyOverviewProps> = ({
  weekNumber,
  theme,
  learningGoals,
  keyVocabulary,
  children
}) => {
  return (
    <Card className="my-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="h-6 w-6 text-blue-600" />
          <CardTitle className="text-2xl">Week {weekNumber} Overview</CardTitle>
        </div>
        <p className="text-lg font-semibold text-blue-700">{theme}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {learningGoals && learningGoals.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-gray-800">Learning Goals</h4>
              </div>
              <ul className="list-disc pl-5 space-y-1">
                {learningGoals.map((goal, index) => (
                  <li key={index} className="text-gray-700">{goal}</li>
                ))}
              </ul>
            </div>
          )}
          
          {keyVocabulary && keyVocabulary.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                <h4 className="font-semibold text-gray-800">Key Vocabulary</h4>
              </div>
              <ul className="list-disc pl-5 space-y-1">
                {keyVocabulary.map((word, index) => (
                  <li key={index} className="text-gray-700">{word}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {children && (
          <div className="mt-4 pt-4 border-t border-blue-200">
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
};