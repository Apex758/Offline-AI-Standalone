import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import Moon01Icon from '@hugeicons/core-free-icons/Moon01Icon';
import Sun01Icon from '@hugeicons/core-free-icons/Sun01Icon';
import { useSettings } from '../contexts/SettingsContext';
import { NeuroSwitch } from './ui/NeuroSwitch';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const Moon = () => <Icon icon={Moon01Icon} className="w-3.5 h-3.5" />;
const Sun = () => <Icon icon={Sun01Icon} className="w-3.5 h-3.5" />;

export const ThemeToggle: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const isDark = settings.theme === 'dark';

  return (
    <NeuroSwitch
      checked={isDark}
      onChange={(v) => updateSettings({ theme: v ? 'dark' : 'light' })}
      size="md"
      offIcon={<Moon />}
      onIcon={<Sun />}
      aria-label="Toggle theme"
    />
  );
};
