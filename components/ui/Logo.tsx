'use client';

import { useCms } from '@/contexts/AppContext';
import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const sizes = {
  sm: { icon: 32, text: 'text-lg' },
  md: { icon: 40, text: 'text-xl' },
  lg: { icon: 56, text: 'text-2xl' }
};

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const { cms, t } = useCms();
  const { icon: iconSize, text: textSize } = sizes[size];
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon */}
      <div
        className="relative flex items-center justify-center rounded-xl gradient-bg glow-border"
        style={{ width: iconSize, height: iconSize }}
      >
        {cms.brand.logoImage ? (
          <Image
            src={cms.brand.logoImage}
            alt="Logo"
            width={iconSize - 8}
            height={iconSize - 8}
            className="rounded-lg object-contain"
          />
        ) : (
          <span className={`font-black text-white ${size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-xl' : 'text-lg'}`}>
            {cms.brand.logoLetter || 'A'}
          </span>
        )}
      </div>
      
      {/* Brand Name */}
      {showText && (
        <span className={`font-black ${textSize} gradient-text`}>
          {t(cms.brand.brandName)}
        </span>
      )}
    </div>
  );
}

export default Logo;
