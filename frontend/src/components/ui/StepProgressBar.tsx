import React from 'react';
import './StepProgressBar.css';

interface StepProgressBarProps {
  steps: string[];
  currentStep: number; // 1-based
  onClick?: (step: number) => void;
}

const circleColors = {
  inactive: { backgroundColor: '#E8EAE3', color: '#9ca3af' },
  active:   { backgroundColor: '#1D362D', color: '#F8E59D' },
  complete: { backgroundColor: '#552A01', color: '#ffffff' },
};

const labelColors = {
  inactive: '#9ca3af',
  active:   '#1D362D',
  complete: '#552A01',
};

export default function StepProgressBar({ steps, currentStep, onClick }: StepProgressBarProps) {
  return (
    <div className="spb-wrapper border-b border-theme px-6 py-4 overflow-x-auto">
      <div className="spb-row">
        {steps.map((label, idx) => {
          const stepNumber = idx + 1;
          const status: 'complete' | 'active' | 'inactive' =
            currentStep > stepNumber ? 'complete' : currentStep === stepNumber ? 'active' : 'inactive';

          return (
            <React.Fragment key={stepNumber}>
              <div className="spb-item" style={{ cursor: onClick ? 'pointer' : undefined }} onClick={() => onClick?.(stepNumber)}>
                {/* Circle */}
                <div
                  className="spb-circle"
                  style={{
                    ...circleColors[status],
                    transition: 'background-color 0.3s, color 0.3s',
                  }}
                >
                  {status === 'complete' ? (
                    <CheckIcon />
                  ) : (
                    <span className="spb-number">{stepNumber}</span>
                  )}
                </div>

                {/* Label */}
                <span
                  className="spb-label"
                  style={{
                    color: labelColors[status],
                    transition: 'color 0.25s',
                  }}
                >
                  {label}
                </span>
              </div>

              {/* Connector */}
              {idx < steps.length - 1 && (
                <div className="spb-connector">
                  <div
                    className="spb-connector-fill"
                    style={{
                      width: currentStep > stepNumber ? '100%' : '0%',
                      transition: 'width 0.4s ease-in-out',
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="spb-check" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path
        className="spb-check-path"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
