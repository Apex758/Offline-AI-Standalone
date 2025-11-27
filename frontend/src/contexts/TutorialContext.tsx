import React, { createContext, useContext, useState } from 'react';
import TutorialOverlay from '../components/TutorialOverlay';
import { getTutorialById, TutorialId } from '../data/tutorialSteps';

interface TutorialContextType {
  startTutorial: (id: TutorialId) => void;
  stopTutorial: () => void;
  activeTutorialId: TutorialId | null;
}

const TutorialContext = createContext<TutorialContextType | null>(null);

export const TutorialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTutorialId, setActiveTutorialId] = useState<TutorialId | null>(null);

  const startTutorial = (id: TutorialId) => setActiveTutorialId(id);
  const stopTutorial = () => setActiveTutorialId(null);

  const currentTutorial = activeTutorialId ? getTutorialById(activeTutorialId) : null;

  return (
    <TutorialContext.Provider value={{ startTutorial, stopTutorial, activeTutorialId }}>
      {children}
      {currentTutorial && (
        <TutorialOverlay
          key={currentTutorial.id}
          steps={currentTutorial.steps}
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