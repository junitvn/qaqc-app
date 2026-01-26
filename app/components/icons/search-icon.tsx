import * as React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface SearchIconProps {
  width?: number;
  height?: number;
  color?: string;
}

/**
 * SearchIcon - Magnifying glass search icon
 * Commonly used for search input fields
 */
export function SearchIcon({ 
  width = 24, 
  height = 24, 
  color = '#525252' 
}: SearchIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Circle 
        cx="11" 
        cy="11" 
        r="7" 
        stroke={color} 
        strokeWidth="1.5"
      />
      <Path 
        d="M16 16L21 21" 
        stroke={color} 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
    </Svg>
  );
}
