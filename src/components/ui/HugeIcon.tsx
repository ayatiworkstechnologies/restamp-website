import React from 'react';
import { HugeiconsIcon, IconSvgElement } from '@hugeicons/react';

export interface HugeIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'color'> {
  icon: IconSvgElement;
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

export default function HugeIcon({
  icon,
  size = 24,
  color = 'currentColor',
  strokeWidth = 1.5,
  className = '',
  ...props
}: HugeIconProps) {
  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      color={color}
      primaryColor={color}
      strokeWidth={strokeWidth}
      className={className}
      {...props}
    />
  );
}
