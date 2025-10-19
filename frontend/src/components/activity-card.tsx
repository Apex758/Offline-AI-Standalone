import React from 'react';
import { Clock, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface ActivityCardProps {
  title: string;
  description: string;
  duration?: string;
  groupSize?: string;
  materials?: string[];
  instructions?: string[];
  learningAreas?: string[];
  color?: string;
  children?: React.ReactNode;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  title,
  description,
  duration,
  groupSize,
  materials,
  instructions,
  learningAreas,
  color = "blue",
  children
}) => {
  return (
    <Card className="my-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {(duration || groupSize) && (
          <div className="flex gap-4 text-sm text-gray-600 mt-2">
            {duration && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{duration}</span>
              </div>
            )}
            {groupSize && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{groupSize}</span>
              </div>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {materials && materials.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Materials:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {materials.map((material, index) => (
                <li key={index}>{material}</li>
              ))}
            </ul>
          </div>
        )}

        {learningAreas && learningAreas.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Learning Areas:</h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {learningAreas.map((area, index) => (
                <li key={index}>{area}</li>
              ))}
            </ul>
          </div>
        )}
        
        {instructions && instructions.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Instructions:</h4>
            <ol className="list-decimal pl-5 space-y-2">
              {instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
        )}
        
        {children}
      </CardContent>
    </Card>
  );
};