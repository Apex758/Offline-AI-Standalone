import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import Moon01Icon from '@hugeicons/core-free-icons/Moon01Icon';
import Sun01Icon from '@hugeicons/core-free-icons/Sun01Icon';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const Moon = (props: { className?: string }) => <Icon icon={Moon01Icon} {...props} />;
const Sun = (props: { className?: string }) => <Icon icon={Sun01Icon} {...props} />;

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    //  Add actual theme switching logic here
    // document.documentElement.classList.toggle('dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-gray-600" />
      ) : (
        <Sun className="w-5 h-5 text-gray-600" />
      )}
    </button>
  );
};