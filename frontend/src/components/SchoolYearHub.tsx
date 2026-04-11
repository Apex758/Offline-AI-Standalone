import React, { useState, useCallback, useRef, useEffect, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { NeuroSegment } from './ui/NeuroSegment';
import { HugeiconsIcon } from '@hugeicons/react';
import Calendar03IconData from '@hugeicons/core-free-icons/Calendar03Icon';
import BookBookmark01IconData from '@hugeicons/core-free-icons/BookBookmark01Icon';
import Clock01IconData from '@hugeicons/core-free-icons/Clock01Icon';
import { HeartbeatLoader } from './ui/HeartbeatLoader';
import { getTeacherId } from '../lib/teacherId';

const SchoolYearCalendar = React.lazy(() => import('./SchoolYearCalendar'));
const CurriculumPlan = React.lazy(() => import('./CurriculumPlan'));
const Timetable = React.lazy(() => import('./Timetable'));

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

type PanelType = 'school-year' | 'curriculum-plan' | 'timetable';

const PANELS: PanelType[] = ['school-year', 'curriculum-plan', 'timetable'];

interface SchoolYearHubProps {
  tabId: string;
  savedData?: any;
  onDataChange?: (data: any) => void;
  isActive?: boolean;
}

const SchoolYearHub: React.FC<SchoolYearHubProps> = ({ tabId, savedData, onDataChange, isActive }) => {
  const { t } = useTranslation();
  const teacherId = getTeacherId();

  const [activePanel, setActivePanel] = useState<PanelType>(savedData?.activePanel || 'school-year');

  // Card flip state: dynamic face assignment for 3 panels
  const [frontContent, setFrontContent] = useState<PanelType>(savedData?.activePanel || 'school-year');
  const [backContent, setBackContent] = useState<PanelType>('curriculum-plan');
  const [flipped, setFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const flipContainerRef = useRef<HTMLDivElement>(null);

  // Persist activePanel via onDataChange
  const persistTimer = useRef<ReturnType<typeof setTimeout>>();
  const persistState = useCallback(() => {
    if (persistTimer.current) clearTimeout(persistTimer.current);
    persistTimer.current = setTimeout(() => {
      onDataChange?.({ activePanel });
    }, 0);
  }, [activePanel, onDataChange]);

  useEffect(() => {
    persistState();
    return () => { if (persistTimer.current) clearTimeout(persistTimer.current); };
  }, [persistState]);

  const flipToPanel = useCallback((target: PanelType) => {
    if (target === activePanel || isAnimating) return;

    setIsAnimating(true);
    // Place the target on the back face
    setBackContent(target);
    setActivePanel(target);

    // Trigger the flip
    requestAnimationFrame(() => {
      setFlipped(prev => !prev);
    });
  }, [activePanel, isAnimating]);

  const handleTransitionEnd = useCallback(() => {
    // After animation: move the active panel to the front and reset
    setFrontContent(activePanel);
    // Disable transition briefly for the instant reset
    const container = flipContainerRef.current;
    if (container) {
      container.style.transition = 'none';
      setFlipped(false);
      // Re-enable transition on the next frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (container) {
            container.style.transition = 'transform 0.7s cubic-bezier(0.4, 0.0, 0.2, 1)';
          }
          setIsAnimating(false);
        });
      });
    } else {
      setFlipped(false);
      setIsAnimating(false);
    }
  }, [activePanel]);

  // Dummy onDataChange for children that don't use it
  const noopDataChange = useCallback((_data: any) => {}, []);

  const renderPanel = (panel: PanelType) => {
    switch (panel) {
      case 'school-year':
        return (
          <SchoolYearCalendar
            tabId={tabId}
            savedData={undefined}
            onDataChange={noopDataChange}
            isActive={isActive && activePanel === 'school-year'}
          />
        );
      case 'curriculum-plan':
        return (
          <CurriculumPlan
            tabId={tabId}
            savedData={undefined}
            onDataChange={noopDataChange}
            isActive={isActive && activePanel === 'curriculum-plan'}
          />
        );
      case 'timetable':
        return (
          <Timetable
            tabId={tabId}
            savedData={savedData?.timetable}
            onDataChange={(data: any) => onDataChange?.({ ...savedData, timetable: data, activePanel })}
            isActive={isActive && activePanel === 'timetable'}
            teacherId={teacherId}
          />
        );
      default:
        return null;
    }
  };

  const panelLabels: Record<PanelType, { label: string; icon: any; color: string }> = {
    'school-year': {
      label: t('sidebar.schoolYear', 'School Year'),
      icon: Calendar03IconData,
      color: 'rgb(13,148,136)', // teal-600
    },
    'curriculum-plan': {
      label: t('sidebar.curriculumPlan', 'Curriculum'),
      icon: BookBookmark01IconData,
      color: 'rgb(5,150,105)', // emerald-600
    },
    'timetable': {
      label: 'Timetable',
      icon: Clock01IconData,
      color: 'rgb(79,70,229)', // indigo-600
    },
  };

  const current = panelLabels[activePanel];

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div
        className="px-6 py-3 flex-shrink-0 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-secondary)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${current.color}22, ${current.color}33)`,
              border: `1px solid ${current.color}44`,
              transition: 'all 0.3s ease',
            }}
          >
            <Icon icon={current.icon} className="w-4.5 h-4.5" style={{ color: current.color }} />
          </div>
          <div>
            <h1 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              {current.label}
            </h1>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              {activePanel === 'school-year' && 'Manage your academic calendar and events'}
              {activePanel === 'curriculum-plan' && 'Assign milestones to academic phases'}
              {activePanel === 'timetable' && 'Set your weekly class schedule'}
            </p>
          </div>
        </div>

        {/* Panel Toggle */}
        <NeuroSegment
          options={PANELS.map(p => ({
            value: p,
            label: panelLabels[p].label,
            icon: <Icon icon={panelLabels[p].icon} className="w-3.5 h-3.5" />,
          }))}
          value={activePanel}
          onChange={flipToPanel}
          size="sm"
          shape="rect"
        />
      </div>

      {/* Card Flip Container */}
      <div className="flex-1 overflow-hidden" style={{ perspective: '2000px' }}>
        <div
          ref={flipContainerRef}
          className="h-full"
          style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 0.7s cubic-bezier(0.4, 0.0, 0.2, 1)',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            position: 'relative',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {/* Front Face */}
          <div
            className="h-full"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              position: flipped ? 'absolute' : 'relative',
              inset: 0,
              pointerEvents: flipped ? 'none' : 'auto',
              overflow: 'auto',
            }}
          >
            <Suspense fallback={
              <div className="h-full flex items-center justify-center">
                <HeartbeatLoader className="w-8 h-8" />
              </div>
            }>
              {renderPanel(frontContent)}
            </Suspense>
          </div>

          {/* Back Face */}
          <div
            className="h-full"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              position: flipped ? 'relative' : 'absolute',
              inset: 0,
              pointerEvents: flipped ? 'auto' : 'none',
              overflow: 'auto',
            }}
          >
            <Suspense fallback={
              <div className="h-full flex items-center justify-center">
                <HeartbeatLoader className="w-8 h-8" />
              </div>
            }>
              {renderPanel(backContent)}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolYearHub;
