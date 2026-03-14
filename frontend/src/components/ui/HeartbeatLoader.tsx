import React from 'react';

interface HeartbeatLoaderProps {
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

const heartbeatKeyframes = `
@keyframes heartbeatLoader {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 2px rgba(165, 198, 77, 0.4));
  }
  12% {
    transform: scale(1.12);
    filter: drop-shadow(0 0 6px rgba(165, 198, 77, 0.85));
  }
  24% {
    transform: scale(1);
    filter: drop-shadow(0 0 2px rgba(165, 198, 77, 0.4));
  }
  36% {
    transform: scale(1.16);
    filter: drop-shadow(0 0 8px rgba(165, 198, 77, 1));
  }
  55% {
    transform: scale(1);
    filter: drop-shadow(0 0 2px rgba(165, 198, 77, 0.4));
  }
}
`;

// Inject keyframes once
let injected = false;
function injectKeyframes() {
  if (injected) return;
  const style = document.createElement('style');
  style.textContent = heartbeatKeyframes;
  document.head.appendChild(style);
  injected = true;
}

export const HeartbeatLoader: React.FC<HeartbeatLoaderProps> = ({
  className = '',
  size,
  style = {},
}) => {
  React.useEffect(() => { injectKeyframes(); }, []);

  // Parse size from className if not provided (e.g. "w-5 h-5" → 20px)
  const sizeMap: Record<string, number> = {
    'w-4': 16, 'w-5': 20, 'w-6': 24, 'w-8': 32, 'w-10': 40, 'w-12': 48,
  };

  let resolvedSize = size;
  if (!resolvedSize) {
    for (const [cls, px] of Object.entries(sizeMap)) {
      if (className.includes(cls)) {
        resolvedSize = px;
        break;
      }
    }
  }
  if (!resolvedSize) resolvedSize = 20;

  // Strip animate-spin and w-/h- classes since we handle sizing ourselves
  const filteredClass = className
    .split(' ')
    .filter(c => !c.startsWith('animate-') && !c.match(/^[wh]-\d/))
    .join(' ');

  return (
    <img
      src="/oecsnavlogo.png"
      alt=""
      className={filteredClass}
      style={{
        width: resolvedSize,
        height: resolvedSize,
        objectFit: 'contain',
        animation: 'heartbeatLoader 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        willChange: 'transform, filter',
        ...style,
      }}
    />
  );
};
