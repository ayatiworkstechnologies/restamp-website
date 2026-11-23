import React from 'react';

export type DualToneIconName =
  | 'building'
  | 'award'
  | 'maximize'
  | 'sofa'
  | 'compass'
  | 'layers'
  | 'fan'
  | 'lightbulb'
  | 'bed'
  | 'bath'
  | 'balcony'
  | 'car'
  | 'pool'
  | 'gym'
  | 'shield'
  | 'trees'
  | 'users'
  | 'zap'
  | 'map-pin'
  | 'phone'
  | 'heart'
  | 'search'
  | 'calendar';

interface DualToneIconProps extends React.SVGProps<SVGSVGElement> {
  name: DualToneIconName;
  size?: number;
  primaryColor?: string;
  secondaryColor?: string;
  className?: string;
}

export default function DualToneIcon({
  name,
  size = 24,
  primaryColor = '#087ed9',
  secondaryColor = '#bae6fd',
  className = '',
  ...props
}: DualToneIconProps) {
  switch (name) {
    case 'building':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          {...props}
        >
          {/* Dual-tone building body */}
          <rect
            x="4"
            y="3"
            width="16"
            height="18"
            rx="2.5"
            fill={secondaryColor}
            fillOpacity="0.5"
            stroke={primaryColor}
            strokeWidth="1.75"
          />
          {/* Windows in 2 columns of 3 */}
          <rect x="7" y="6" width="2.5" height="2.5" rx="0.5" fill={primaryColor} />
          <rect x="14.5" y="6" width="2.5" height="2.5" rx="0.5" fill={primaryColor} />
          <rect x="7" y="10" width="2.5" height="2.5" rx="0.5" fill={primaryColor} />
          <rect x="14.5" y="10" width="2.5" height="2.5" rx="0.5" fill={primaryColor} />
          <rect x="7" y="14" width="2.5" height="2.5" rx="0.5" fill={primaryColor} />
          <rect x="14.5" y="14" width="2.5" height="2.5" rx="0.5" fill={primaryColor} />
          {/* Entrance door */}
          <path
            d="M10.25 21V17C10.25 16.45 10.7 16 11.25 16H12.75C13.3 16 13.75 16.45 13.75 17V21"
            fill={primaryColor}
          />
        </svg>
      );

    case 'award':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          {...props}
        >
          {/* Circular medallion with dual-tone fill */}
          <circle
            cx="12"
            cy="8.5"
            r="5.5"
            fill={secondaryColor}
            fillOpacity="0.6"
            stroke={primaryColor}
            strokeWidth="1.75"
          />
          <circle cx="12" cy="8.5" r="2.25" fill={primaryColor} />
          {/* Ribbon tails with notch */}
          <path
            d="M8.5 13.5L7.5 21L12 18.75L16.5 21L15.5 13.5"
            fill={secondaryColor}
            fillOpacity="0.35"
            stroke={primaryColor}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'maximize':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          {...props}
        >
          {/* Arrow 1: Top-Right with dual-tone head */}
          <polygon
            points="17,7 12.5,7 17,11.5"
            fill={secondaryColor}
            fillOpacity="0.7"
            stroke={primaryColor}
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <path
            d="M17 7L12 12"
            stroke={primaryColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Arrow 2: Bottom-Left with dual-tone head */}
          <polygon
            points="7,17 11.5,17 7,12.5"
            fill={secondaryColor}
            fillOpacity="0.7"
            stroke={primaryColor}
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <path
            d="M7 17L12 12"
            stroke={primaryColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'sofa':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          {...props}
        >
          {/* Backrest with dual-tone fill */}
          <path
            d="M6.5 8C6.5 6.6 7.6 5.5 9 5.5H15C16.4 5.5 17.5 6.6 17.5 8V13H6.5V8Z"
            fill={secondaryColor}
            fillOpacity="0.55"
            stroke={primaryColor}
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          {/* Left Armrest */}
          <rect
            x="3.5"
            y="10"
            width="3"
            height="7.5"
            rx="1.5"
            fill={secondaryColor}
            fillOpacity="0.45"
            stroke={primaryColor}
            strokeWidth="1.75"
          />
          {/* Right Armrest */}
          <rect
            x="17.5"
            y="10"
            width="3"
            height="7.5"
            rx="1.5"
            fill={secondaryColor}
            fillOpacity="0.45"
            stroke={primaryColor}
            strokeWidth="1.75"
          />
          {/* Seat cushion */}
          <path
            d="M6.5 13H17.5V16.5C17.5 17.05 17.05 17.5 16.5 17.5H7.5C6.95 17.5 6.5 17.05 6.5 16.5V13Z"
            fill={secondaryColor}
            fillOpacity="0.65"
            stroke={primaryColor}
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          {/* Legs */}
          <path
            d="M6.5 17.5L5.5 20.5M17.5 17.5L18.5 20.5"
            stroke={primaryColor}
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'compass':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          {...props}
        >
          {/* Outer circle with dual-tone fill */}
          <circle
            cx="12"
            cy="12"
            r="8.5"
            fill={secondaryColor}
            fillOpacity="0.4"
            stroke={primaryColor}
            strokeWidth="1.75"
          />
          {/* Dial needle pointing northeast */}
          <polygon
            points="12,12 16,8 11.5,10"
            fill={primaryColor}
          />
          <polygon
            points="12,12 8,16 10,11.5"
            fill={primaryColor}
          />
          <polygon
            points="12,12 16,8 14,12.5"
            fill={secondaryColor}
            stroke={primaryColor}
            strokeWidth="0.5"
          />
          <polygon
            points="12,12 8,16 12.5,14"
            fill={secondaryColor}
            stroke={primaryColor}
            strokeWidth="0.5"
          />
          <circle cx="12" cy="12" r="1.5" fill={primaryColor} />
        </svg>
      );

    case 'layers':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          {...props}
        >
          {/* Top layer diamond with dual-tone fill */}
          <path
            d="M12 3.5L20 8L12 12.5L4 8L12 3.5Z"
            fill={secondaryColor}
            fillOpacity="0.65"
            stroke={primaryColor}
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          {/* Middle layer */}
          <path
            d="M4 12L12 16.5L20 12"
            stroke={primaryColor}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Bottom layer */}
          <path
            d="M4 16L12 20.5L20 16"
            stroke={primaryColor}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'fan':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          {...props}
        >
          {/* Three outlined blades with soft fill, matching the other dual-tone icons */}
          {[0, 120, 240].map((deg) => (
            <path
              key={deg}
              d="M12 9.6C10.6 8.2 10.4 4.9 12 3.6C13.6 4.9 13.4 8.2 12 9.6Z"
              fill={secondaryColor}
              fillOpacity="0.5"
              stroke={primaryColor}
              strokeWidth="1.5"
              strokeLinejoin="round"
              transform={`rotate(${deg} 12 12)`}
            />
          ))}
          <circle cx="12" cy="12" r="2.4" fill={secondaryColor} fillOpacity="0.5" stroke={primaryColor} strokeWidth="1.75" />
        </svg>
      );

    case 'lightbulb':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          {...props}
        >
          {/* Bulb with soft fill */}
          <path
            d="M12 3.5C8.96 3.5 6.5 5.96 6.5 9C6.5 10.95 7.52 12.66 9.05 13.64C9.64 14.02 10 14.66 10 15.36V16H14V15.36C14 14.66 14.36 14.02 14.95 13.64C16.48 12.66 17.5 10.95 17.5 9C17.5 5.96 15.04 3.5 12 3.5Z"
            fill={secondaryColor}
            fillOpacity="0.5"
            stroke={primaryColor}
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          {/* Filament */}
          <path d="M10.5 10.5L12 12L13.5 10.5M12 12V16" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Base */}
          <path d="M9.75 18.25H14.25M10.75 20.75H13.25" stroke={primaryColor} strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );

    case 'bed':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          {...props}
        >
          <path
            d="M3 18V7"
            stroke={primaryColor}
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <path
            d="M21 18V12"
            stroke={primaryColor}
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <rect
            x="6"
            y="9"
            width="5"
            height="4"
            rx="1.5"
            fill={secondaryColor}
            stroke={primaryColor}
            strokeWidth="1.5"
          />
          <rect
            x="13"
            y="9"
            width="5"
            height="4"
            rx="1.5"
            fill={secondaryColor}
            stroke={primaryColor}
            strokeWidth="1.5"
          />
          <path
            d="M3 14H21V17C21 17.55 20.55 18 20 18H4C3.45 18 3 17.55 3 17V14Z"
            fill={secondaryColor}
            fillOpacity="0.5"
            stroke={primaryColor}
            strokeWidth="1.75"
          />
        </svg>
      );

    case 'bath':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          {...props}
        >
          <path
            d="M4 12H20V15C20 17.76 17.76 20 15 20H9C6.24 20 4 17.76 4 15V12Z"
            fill={secondaryColor}
            fillOpacity="0.5"
            stroke={primaryColor}
            strokeWidth="1.75"
          />
          <path
            d="M6 12V6C6 4.9 6.9 4 8 4C9.1 4 10 4.9 10 6V7"
            stroke={primaryColor}
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <path
            d="M7 20L6 22M17 20L18 22"
            stroke={primaryColor}
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'balcony':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          {...props}
        >
          {/* Glass door behind the railing */}
          <rect x="7" y="3" width="10" height="11" rx="1.5" fill={secondaryColor} fillOpacity="0.5" stroke={primaryColor} strokeWidth="1.75" />
          <path d="M12 3V14" stroke={primaryColor} strokeWidth="1.5" />
          {/* Railing */}
          <path d="M3 14H21" stroke={primaryColor} strokeWidth="1.75" strokeLinecap="round" />
          <path d="M3 20.5H21" stroke={primaryColor} strokeWidth="1.75" strokeLinecap="round" />
          {/* Balustrades */}
          <path d="M5 14V20.5M9 14V20.5M13 14V20.5M17 14V20.5M21 14V20.5M3 14V20.5" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'car':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          {...props}
        >
          <path
            d="M5 11L7 6H17L19 11M5 11H19M5 11C3.9 11 3 11.9 3 13V17H5M19 11C20.1 11 21 11.9 21 13V17H19"
            stroke={primaryColor}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 6H17L19 11H5L7 6Z"
            fill={secondaryColor}
            fillOpacity="0.5"
          />
          <circle cx="7.5" cy="16.5" r="1.5" fill={primaryColor} />
          <circle cx="16.5" cy="16.5" r="1.5" fill={primaryColor} />
        </svg>
      );

    case 'pool':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          {...props}
        >
          <path
            d="M3 15C5 15 6 14 8 14C10 14 11 15 13 15C15 15 16 14 18 14C20 14 21 15 22 15"
            stroke={primaryColor}
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <path
            d="M3 19C5 19 6 18 8 18C10 18 11 19 13 19C15 19 16 18 18 18C20 18 21 19 22 19"
            stroke={primaryColor}
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <circle
            cx="14"
            cy="7"
            r="2"
            fill={secondaryColor}
            stroke={primaryColor}
            strokeWidth="1.5"
          />
          <path
            d="M9 11L12.5 8.5L14.5 10.5"
            stroke={primaryColor}
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'gym':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          {...props}
        >
          <rect
            x="2"
            y="9"
            width="3"
            height="6"
            rx="1"
            fill={secondaryColor}
            stroke={primaryColor}
            strokeWidth="1.5"
          />
          <rect
            x="5"
            y="7"
            width="3"
            height="10"
            rx="1"
            fill={secondaryColor}
            stroke={primaryColor}
            strokeWidth="1.5"
          />
          <path
            d="M8 12H16"
            stroke={primaryColor}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <rect
            x="16"
            y="7"
            width="3"
            height="10"
            rx="1"
            fill={secondaryColor}
            stroke={primaryColor}
            strokeWidth="1.5"
          />
          <rect
            x="19"
            y="9"
            width="3"
            height="6"
            rx="1"
            fill={secondaryColor}
            stroke={primaryColor}
            strokeWidth="1.5"
          />
        </svg>
      );

    case 'shield':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          {...props}
        >
          <path
            d="M12 3L20 6.5V12C20 16.5 16.5 20.5 12 21.5C7.5 20.5 4 16.5 4 12V6.5L12 3Z"
            fill={secondaryColor}
            fillOpacity="0.45"
            stroke={primaryColor}
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <path
            d="M9 12L11 14L15 10"
            stroke={primaryColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'trees':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          {...props}
        >
          <path
            d="M12 3L7 11H17L12 3Z"
            fill={secondaryColor}
            fillOpacity="0.5"
            stroke={primaryColor}
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <path
            d="M12 11V21"
            stroke={primaryColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M6 18H18"
            stroke={primaryColor}
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'users':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          {...props}
        >
          <circle
            cx="9"
            cy="7"
            r="4"
            fill={secondaryColor}
            stroke={primaryColor}
            strokeWidth="1.75"
          />
          <path
            d="M2 19C2 15.5 5 13 9 13C13 13 16 15.5 16 19"
            stroke={primaryColor}
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <path
            d="M16 8C17.65 8 19 9.35 19 11C19 12.65 17.65 14 16 14"
            stroke={primaryColor}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M18 19C19.5 18 21 16.5 21 15"
            stroke={primaryColor}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'zap':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          {...props}
        >
          <polygon
            points="13,2 4,14 11,14 10,22 20,10 13,10"
            fill={secondaryColor}
            fillOpacity="0.55"
            stroke={primaryColor}
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'map-pin':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          {...props}
        >
          <path
            d="M12 21C16 17 20 13.4183 20 9.5C20 5.35786 16.4183 2 12 2C7.58172 2 4 5.35786 4 9.5C4 13.4183 8 17 12 21Z"
            fill={secondaryColor}
            fillOpacity="0.45"
            stroke={primaryColor}
            strokeWidth="1.75"
          />
          <circle cx="12" cy="9.5" r="2.5" fill={primaryColor} />
        </svg>
      );

    case 'phone':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          {...props}
        >
          <path
            d="M5 4H9L11 8.5L8.5 10.5C9.57 12.67 11.33 14.43 13.5 15.5L15.5 13L20 15V19C20 20.1 19.1 21 18 21C10.82 21 5 15.18 5 8C5 6.9 5.9 6 7 6"
            fill={secondaryColor}
            fillOpacity="0.4"
            stroke={primaryColor}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'heart':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          {...props}
        >
          <path
            d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
            fill={secondaryColor}
            fillOpacity="0.5"
            stroke={primaryColor}
            strokeWidth="1.75"
          />
        </svg>
      );

    case 'search':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          {...props}
        >
          <circle
            cx="11"
            cy="11"
            r="7"
            fill={secondaryColor}
            fillOpacity="0.45"
            stroke={primaryColor}
            strokeWidth="1.75"
          />
          <path
            d="M16 16L21 21"
            stroke={primaryColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'calendar':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          {...props}
        >
          <rect
            x="3"
            y="4"
            width="18"
            height="17"
            rx="2.5"
            fill={secondaryColor}
            fillOpacity="0.4"
            stroke={primaryColor}
            strokeWidth="1.75"
          />
          <path
            d="M16 2V6M8 2V6M3 9H21"
            stroke={primaryColor}
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <rect x="7" y="12" width="2" height="2" rx="0.5" fill={primaryColor} />
          <rect x="11" y="12" width="2" height="2" rx="0.5" fill={primaryColor} />
          <rect x="15" y="12" width="2" height="2" rx="0.5" fill={primaryColor} />
          <rect x="7" y="15" width="2" height="2" rx="0.5" fill={primaryColor} />
          <rect x="11" y="15" width="2" height="2" rx="0.5" fill={primaryColor} />
        </svg>
      );

    default:
      return null;
  }
}
