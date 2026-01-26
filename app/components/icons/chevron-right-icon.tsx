import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

interface ChevronRightIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export function ChevronRightIcon({ 
  width = 24, 
  height = 24, 
  color = '#525252' 
}: ChevronRightIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path 
        d="M9 18L15 12L9 6" 
        stroke={color} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </Svg>
  );
}
