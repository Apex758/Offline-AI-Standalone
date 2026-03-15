import React from 'react';
import { motion } from 'framer-motion';
import './StepProgressBar.css';

interface StepProgressBarProps {
  steps: string[];
  currentStep: number; // 1-based
  onClick?: (step: number) => void;
}

export default function StepProgressBar({ steps, currentStep, onClick }: StepProgressBarProps) {
  return (
    <div className="spb-wrapper border-b border-theme px-6 py-4 overflow-x-auto">
      <div className="spb-row">
        {steps.map((label, idx) => {
          const stepNumber = idx + 1;
          const status =
            currentStep > stepNumber ? 'complete' : currentStep === stepNumber ? 'active' : 'inactive';

          return (
            <React.Fragment key={stepNumber}>
              <div className="spb-item" style={{ cursor: onClick ? 'pointer' : undefined }} onClick={() => onClick?.(stepNumber)}>
                {/* Circle */}
                <motion.div
                  className="spb-circle"
                  animate={status}
                  initial={false}
                  variants={{
                    inactive: { backgroundColor: '#E8EAE3', color: '#9ca3af' },
                    active:   { backgroundColor: '#1D362D', color: '#F8E59D' },
                    complete: { backgroundColor: '#552A01', color: '#ffffff' },
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {status === 'complete' ? (
                    <CheckIcon />
                  ) : (
                    <span className="spb-number">{stepNumber}</span>
                  )}
                </motion.div>

                {/* Label */}
                <motion.span
                  className="spb-label"
                  animate={status}
                  initial={false}
                  variants={{
                    inactive: { color: '#9ca3af' },
                    active:   { color: '#1D362D' },
                    complete: { color: '#552A01' },
                  }}
                  transition={{ duration: 0.25 }}
                >
                  {label}
                </motion.span>
              </div>

              {/* Connector */}
              {idx < steps.length - 1 && (
                <div className="spb-connector">
                  <motion.div
                    className="spb-connector-fill"
                    initial={false}
                    animate={{ width: currentStep > stepNumber ? '100%' : '0%' }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
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
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.05, duration: 0.25, ease: 'easeOut' }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
