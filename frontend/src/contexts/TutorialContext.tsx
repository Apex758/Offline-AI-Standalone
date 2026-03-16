import React, { createContext, useContext, useState, useEffect } from 'react';
import TutorialOverlay, { TutorialStep } from '../components/TutorialOverlay';
import type { TutorialId } from '../data/tutorialSteps';

interface TutorialContextType {
  startTutorial: (id: TutorialId) => void;
  stopTutorial: () => void;
  activeTutorialId: TutorialId | null;
}

const TutorialContext = createContext<TutorialContextType | null>(null);

export const TutorialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTutorialId, setActiveTutorialId] = useState<TutorialId | null>(null);
  const [activeSteps, setActiveSteps] = useState<TutorialStep[] | null>(null);

  const startTutorial = (id: TutorialId) => setActiveTutorialId(id);
  const stopTutorial = () => { setActiveTutorialId(null); setActiveSteps(null); };

  // Lazy-load tutorial steps only when a tutorial is started
  useEffect(() => {
    if (!activeTutorialId) { setActiveSteps(null); return; }
    import('../data/tutorialSteps').then(m => {
      const tutorial = m.getTutorialById(activeTutorialId);
      setActiveSteps(tutorial?.steps ?? null);
    });
  }, [activeTutorialId]);

  return (
    <TutorialContext.Provider value={{ startTutorial, stopTutorial, activeTutorialId }}>
      {children}
      {activeTutorialId && activeSteps && (
        <TutorialOverlay
          key={activeTutorialId}
          steps={activeSteps}
          onComplete={stopTutorial}
          autoStart
        />
      )}
    </TutorialContext.Provider>
  );
};

export const useTutorials = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorials must be used within a TutorialProvider');
  }
  return context;
};