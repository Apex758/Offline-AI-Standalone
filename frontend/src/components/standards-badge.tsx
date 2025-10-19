import React from 'react';
import { BookOpen } from 'lucide-react';

interface StandardsBadgeProps {
  code?: string;
  title?: string;
  className?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning';
}

// Add named export
export function StandardsBadge({ 
  code, 
  title, 
  className = '',
  variant = 'default'
}: StandardsBadgeProps) {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-700 border-gray-300',
    primary: 'bg-blue-100 text-blue-700 border-blue-300',
    success: 'bg-green-100 text-green-700 border-green-300',
    warning: 'bg-amber-100 text-amber-700 border-amber-300',
  };

  return (
    <div 
      className={`inline-flex items-center px-3 py-1.5 rounded-lg border text-sm font-medium ${variantStyles[variant]} ${className}`}
      title={title}
    >
      <BookOpen className="w-3.5 h-3.5 mr-1.5" />
      {code || 'Standard'}
    </div>
  );
}

// Keep default export
export default StandardsBadge;