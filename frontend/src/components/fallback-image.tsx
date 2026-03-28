import React, { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import Image01Icon from '@hugeicons/core-free-icons/Image01Icon';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const ImageIcon = (props: { className?: string }) => <Icon icon={Image01Icon} {...props} />;

interface FallbackImageProps {
  src?: string;
  alt?: string;
  className?: string;
  fallbackText?: string;
}

// Add named export
export function FallbackImage({
  src,
  alt = 'Image',
  className = '',
  fallbackText
}: FallbackImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!src || error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center text-gray-400">
          <ImageIcon className="w-12 h-12 mx-auto mb-2" />
          {fallbackText && <p className="text-sm">{fallbackText}</p>}
        </div>
      </div>
    );
  }

  return (
    <>
      {!loaded && (
        <div className={`flex items-center justify-center bg-gray-100 animate-pulse ${className}`}>
          <div className="text-gray-400">
            <ImageIcon className="w-12 h-12" />
          </div>
        </div>
      )}
      <img loading="lazy"
        src={src}
        alt={alt}
        className={`${className} ${!loaded ? 'hidden' : ''}`}
        onError={() => setError(true)}
        onLoad={() => setLoaded(true)}
      />
    </>
  );
}

// Keep default export
export default FallbackImage;