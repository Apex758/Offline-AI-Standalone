import React from 'react';
import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import ArrowRight01Icon from '@hugeicons/core-free-icons/ArrowRight01Icon';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const ChevronRight = (props: { className?: string }) => <Icon icon={ArrowRight01Icon} {...props} />;

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
            )}
            {item.href ? (
              <Link
                to={item.href}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-sm font-medium text-gray-500">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};