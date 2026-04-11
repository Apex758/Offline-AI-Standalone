// Wrapper that hides its children when a section has been fully auto-filled
// from a class config AND the user has not opened the override panel.
//
// Usage:
//   <AutoFilledSection autoFilled={hasConfig} overrideOpen={overrideOpen}>
//     {/* the form fields that were hydrated from ClassConfig */}
//   </AutoFilledSection>
//
// Behavior:
//   - autoFilled=false           -> always render children (no config, fall through)
//   - autoFilled=true, open=false -> hide children (form shrinks)
//   - autoFilled=true, open=true  -> render children (teacher is overriding)

import React from 'react';

interface AutoFilledSectionProps {
  autoFilled: boolean;
  overrideOpen: boolean;
  children: React.ReactNode;
}

const AutoFilledSection: React.FC<AutoFilledSectionProps> = ({
  autoFilled,
  overrideOpen,
  children,
}) => {
  if (autoFilled && !overrideOpen) return null;
  return <>{children}</>;
};

export default AutoFilledSection;
