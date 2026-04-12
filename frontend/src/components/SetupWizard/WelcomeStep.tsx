import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLicense } from '../../contexts/LicenseContext';

interface WelcomeStepProps {
  onChooseManual: () => void;
  onOakActivated: () => void;
}

type View = 'choice' | 'oak';

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onChooseManual, onOakActivated }) => {
  const { t } = useTranslation();
  const { activate, loading, error: licenseError } = useLicense();

  const [view, setView] = useState<View>('choice');
  const [oakInput, setOakInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleActivateOak = async (e: React.FormEvent) => {
    e.preventDefault();
    const key = oakInput.trim().toUpperCase();
    if (!key) {
      setLocalError('Please enter your OAK license key.');
      return;
    }
    setLocalError(null);
    setSubmitting(true);
    const ok = await activate(key);
    setSubmitting(false);
    if (ok) {
      onOakActivated();
    }
  };

  return (
    <div className="flex flex-col items-center text-center px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3" style={{ color: '#F8E59D' }}>
          {t('setupWizard.welcome')}
        </h1>
        <p className="text-lg" style={{ color: '#F2A631' }}>
          {t('setupWizard.subtitle')}
        </p>
      </div>

      {view === 'choice' && (
        <>
          <div className="max-w-md mb-8">
            <p className="text-base leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.85)' }}>
              How would you like to get started?
            </p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Activate your OAK to sync your verified school and country, or continue without one.
            </p>
          </div>

          <div className="flex flex-col w-full max-w-sm gap-3">
            <button
              onClick={() => setView('oak')}
              className="px-6 py-3 rounded-xl font-semibold text-base transition-all hover:scale-[1.02] active:scale-95"
              style={{
                backgroundColor: '#F2A631',
                color: 'var(--text-heading)',
                boxShadow: '0 4px 16px rgba(242,166,49,0.3)',
              }}
            >
              Activate with OAK
            </button>
            <button
              onClick={onChooseManual}
              className="px-6 py-3 rounded-xl font-medium text-sm transition-all hover:scale-[1.02] active:scale-95"
              style={{
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.18)',
                color: 'rgba(255,255,255,0.85)',
              }}
            >
              Continue without OAK (manual setup)
            </button>
          </div>
        </>
      )}

      {view === 'oak' && (
        <form onSubmit={handleActivateOak} className="w-full max-w-sm">
          <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Enter your OECS Authentication Key. Your school and country will be
            retrieved automatically.
          </p>
          <input
            type="text"
            value={oakInput}
            onChange={(e) => setOakInput(e.target.value)}
            placeholder="OAK-XXXX-XXXX-XXXXXXXX"
            autoFocus
            className="w-full px-4 py-2.5 rounded-lg text-sm font-mono tracking-wider outline-none focus:ring-2 mb-3"
            style={{
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff',
            }}
          />
          {(localError || licenseError) && (
            <div
              className="text-xs px-3 py-2 rounded-md mb-3"
              style={{
                backgroundColor: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.4)',
                color: '#fecaca',
              }}
            >
              {localError || licenseError}
            </div>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setView('choice');
                setLocalError(null);
              }}
              className="px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{ color: 'rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.06)' }}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={submitting || loading}
              className="flex-1 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#F2A631',
                color: 'var(--text-heading)',
                boxShadow: '0 4px 16px rgba(242,166,49,0.3)',
              }}
            >
              {submitting || loading ? 'Validating...' : 'Activate'}
            </button>
          </div>
          <button
            type="button"
            onClick={onChooseManual}
            className="w-full mt-3 text-xs transition-opacity hover:opacity-100"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            I don't have an OAK - continue manually
          </button>
        </form>
      )}
    </div>
  );
};

export default WelcomeStep;
