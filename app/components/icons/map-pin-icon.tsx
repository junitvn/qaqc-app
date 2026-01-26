import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

interface MapPinIconProps {
  width?: number;
  height?: number;
  color?: string;
}

/**
 * MapPinIcon - Location pin icon
 * Used for indicating store locations
 */
export function MapPinIcon({ 
  width = 24, 
  height = 24, 
  color = '#525252' 
}: MapPinIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path 
        d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z" 
        stroke={color} 
        strokeWidth="1.5"
      />
      <Path 
        d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" 
        stroke={color} 
        strokeWidth="1.5"
      />
    </Svg>
  );
}
