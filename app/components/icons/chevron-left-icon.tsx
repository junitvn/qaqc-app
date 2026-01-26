import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

interface ChevronLeftIconProps {
  width?: number;
  height?: number;
  color?: string;
}

/**
 * ChevronLeftIcon - Left-pointing chevron icon
 * Commonly used for back navigation buttons
 */
export function ChevronLeftIcon({ 
  width = 24, 
  height = 24, 
  color = '#525252' 
}: ChevronLeftIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path 
        d="M15 18L9 12L15 6" 
        stroke={color} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </Svg>
  );
}
