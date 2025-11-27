import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { TutorialProvider } from './contexts/TutorialContext';

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <TutorialProvider>
      <App />
    </TutorialProvider>
  </StrictMode>
);
