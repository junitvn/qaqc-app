import { View, StyleSheet } from 'react-native';

interface GapProps {
  size?: number;
  horizontal?: boolean;
}

/**
 * Gap component to add spacing between sections
 * @param size - The size of the gap in pixels (default: 16)
 * @param horizontal - If true, creates horizontal spacing instead of vertical (default: false)
 */
export function Gap({ size = 16, horizontal = false }: GapProps) {
  return (
    <View
      style={[
        horizontal ? { width: size } : { height: size },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  // No styles needed, using inline styles for dynamic sizing
});
